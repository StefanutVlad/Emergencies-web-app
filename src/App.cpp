#include <Wire.h>
#include <Adafruit_MLX90614.h>
#include <TinyGPS++.h>
#include <HardwareSerial.h>
#include <ArduinoJson.h>
#include <pulseSensor.h>

#define EEPROM_SIZE 128
#define RXD0 3
#define TXD0 1

// --- Sensor objects ---
// temperature sensor object
Adafruit_MLX90614 mlx = Adafruit_MLX90614();
// gps object
TinyGPSPlus gps;
// Initializing GPS serial data on UART0
HardwareSerial SerialGPS(0);

// --- Pulse sensor variables ---
// pulse Sensor wire connected to analog pin 34
int pulsePin = 34;
// pin to blink led at each beat
int blinkPin = 2;
// pin to fade blink at each beat
int fadePin = 2;
// LED fade rate with PWM on fadePin
int fadeRate = 0;

// --- Volatile Variables, used in the interrupt service routine! ---
// raw analog data from sensor updated every 2mS
volatile int BPM = 0;
// holds the incoming raw data
volatile int Signal;
// time interval between beats
volatile int IBI = 600;
// check pulse=true
volatile boolean Pulse = false;
// true when ESP32 finds a beat.
volatile boolean QS = false;

// --- MPU6050 sensor variables ---
// I2C address of the MPU-6050
const int MPU_addr = 0x68;
// raw accelerometer and gyroscope values
int16_t rawAccX, rawAccY, rawAccZ, rawGyroX, rawGyroY, rawGyroZ;
// accelerometer and gyroscope variables for processing the data
float ax = 0, ay = 0, az = 0, gx = 0, gy = 0, gz = 0;
boolean trigger1 = false; //stores if first trigger (lower threshold) has occurred
boolean trigger2 = false; //stores if second trigger (upper threshold) has occurred
boolean trigger3 = false; //stores if third trigger (orientation change) has occurred

byte trigger1count = 0; //stores the counts past since trigger 1 was set true
byte trigger2count = 0; //stores the counts past since trigger 2 was set true
byte trigger3count = 0; //stores the counts past since trigger 3 was set true
int angleChange = 0;

boolean checkFall = false;
uint32_t softTimer;

// function that sends json data
String sendData(String data1, String data2, String data3, String data4, String data5)
{
  String json;
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject &root = jsonBuffer.createObject();
  root["BPM"] = data1;
  root["Temperature"] = data2;
  root["Latitude"] = data3;
  root["Longitude"] = data4;
  root["Fall"] = data5;
  root.printTo(json);

  return json;
}

//funciton to scan the I2C data bus and get the sensors adresses
void checkI2C()
{
  byte error, address;
  int nDevices;
  Serial.println("Scanning...");
  nDevices = 0;
  for (address = 1; address < 127; address++)
  {
    Wire.beginTransmission(address);
    error = Wire.endTransmission();
    if (error == 0)
    {
      Serial.print("I2C device found at address 0x");
      if (address < 16)
      {
        Serial.print("0");
      }
      Serial.println(address, HEX);
      nDevices++;
    }
    else if (error == 4)
    {
      Serial.print("Unknow error at address 0x");
      if (address < 16)
      {
        Serial.print("0");
      }
      Serial.println(address, HEX);
    }
  }
  if (nDevices == 0)
  {
    Serial.println("No I2C devices found\n");
  }
  else
  {
    Serial.println("done\n");
  }
}

//initialize MPU6050 sensor
void initMPU6050()
{
  Wire.begin();
  // begin transmission to the I2C slave
  Wire.beginTransmission(MPU_addr);
  // PWR_MGMT_1 register
  Wire.write(0x6B);
  // reset the 0x6B register (wakes up the MPU-6050)
  Wire.write(0x00);
  //end transmission
  Wire.endTransmission(true);
}

//read MPU6050 acceleration  data
void mpuReadAcc()
{
  Wire.beginTransmission(MPU_addr);
  // register 0x3B acc data first register address (ACCEL_XOUT_H)
  Wire.write(0x3B);
  Wire.endTransmission(false);
  // request 6 registers. each axis value is stored in 2 registers
  Wire.requestFrom(MPU_addr, 6, true);
  // 0x3B (ACCEL_XOUT_H) & 0x3C (ACCEL_XOUT_L)
  rawAccX = Wire.read() << 8 | Wire.read();
  // 0x3D (ACCEL_YOUT_H) & 0x3E (ACCEL_YOUT_L)
  rawAccY = Wire.read() << 8 | Wire.read();
  // 0x3F (ACCEL_ZOUT_H) & 0x40 (ACCEL_ZOUT_L)
  rawAccZ = Wire.read() << 8 | Wire.read();
}

//read MPU6050 gyroscope data
void mpuReadGyro()
{
  Wire.beginTransmission(MPU_addr);
  // register 0x43 gyro data first register address (GYRO_XOUT_H)
  Wire.write(0x43);
  Wire.endTransmission(false);
  // request 6 registers. each axis value is stored in 2 registers
  Wire.requestFrom(MPU_addr, 6, true);
  // 0x43 (GYRO_XOUT_H) & 0x44 (GYRO_XOUT_L)
  rawGyroX = Wire.read() << 8 | Wire.read();
  // 0x45 (GYRO_YOUT_H) & 0x46 (GYRO_YOUT_L)
  rawGyroY = Wire.read() << 8 | Wire.read();
  // 0x47 (GYRO_ZOUT_H) & 0x48 (GYRO_ZOUT_L)
  rawGyroZ = Wire.read() << 8 | Wire.read();
}

//fall detection function
boolean mpuFallDetection()
{
  //set accelerometer domain +-2g => using 14 bits  //set gyroscope domain 250grades/s => 131.07
  mpuReadAcc();
  // previousTime = currentTime;                        // Previous time is stored before the actual time read
  // currentTime = millis();                            // Current time actual time read
  // elapsedTime = (currentTime - previousTime) / 1000; // Divide by 1000 to get seconds
  mpuReadGyro();

  //accelerometer and gryoscope processed data each for 3 axis
  ax = (rawAccX - 2050) / 16384.00;
  ay = (rawAccY - 77) / 16384.00;
  az = (rawAccZ - 1947) / 16384.00;
  gx = (rawGyroX + 270) / 131.07;
  gy = (rawGyroY - 351) / 131.07;
  gz = (rawGyroZ + 136) / 131.07;

  // calculating Amplitute vactor for 3 axis
  float Raw_AM = pow(pow(ax, 2) + pow(ay, 2) + pow(az, 2), 0.5);
  //multiply by 10 to get int value
  int AM = Raw_AM * 10;

  if (checkFall)
  {
    while (millis() - softTimer < 10000)
    {
    }

    checkFall = false;
    trigger1 = trigger2 = trigger3 = false;
    //reinitialize & read MPU6050 sensor
    initMPU6050();
    mpuReadAcc();
    mpuReadGyro();
    ax = (rawAccX - 2050) / 16384.00;
    ay = (rawAccY - 77) / 16384.00;
    az = (rawAccZ - 1947) / 16384.00;
    gx = (rawGyroX + 270) / 131.07;
    gy = (rawGyroY - 351) / 131.07;
    gz = (rawGyroZ + 136) / 131.07;
  }

  if (trigger3 == true)
  {
    angleChange = pow(pow(gx, 2) + pow(gy, 2) + pow(gz, 2), 0.5);
    //if orientation changes
    if ((angleChange >= 0) && (angleChange <= 400))
    {
      //start counter
      softTimer = millis();
      checkFall = true;
      trigger3 = false;
    }
    else
    {
      //user regained normal orientation
      trigger3 = false;
    }
  }

  if (trigger2 == true)
  {
    angleChange = pow(pow(gx, 2) + pow(gy, 2) + pow(gz, 2), 0.5);

    //if orientation changes by between 3-40 degrees
    if (angleChange >= 3 && angleChange <= 40)
    {
      trigger3 = true;
      trigger2 = false;
      trigger2count = 0;
    }
  }
  if (trigger1 == true)
  {
    trigger1count++;
    //if AM breaks upper threshold1
    if (AM >= 1)
    {
      trigger2 = true;
      trigger1 = false;
    }
  }
  //if AM breaks threshold2
  if (AM <= 4 && trigger2 == false)
  {
    trigger1 = true;
  }

  return checkFall;
}

//gps data function
void sendGpsData()
{
  if (SerialGPS.available())
  {
    char cIn = SerialGPS.read();
    gps.encode(cIn);
    if (gps.location.isUpdated())
    {
      //Serial.print("Latitude= ");
      //Serial.print(gps.location.lat(), 6);
      //Serial.print(" Longitude= ");
      //Serial.println(gps.location.lng(), 6);
    }
  }
}

//setup function
void setup()
{
  //pin that will blink to your heartbeat!
  pinMode(blinkPin, OUTPUT);

  //serial baudrate
  Serial.begin(9600);
  //gps baudrate
  SerialGPS.begin(9600, SERIAL_8N1, RXD0, TXD0);

  //Serial.println("Serial Tx is on pin: " + String(TX));
  //Serial.println("Serial Rx is on pin: " + String(RX));

  // initialize temperature sensor
  mlx.begin();
  // set temperature sensor's skin emissivity
  mlx.writeEmissivity(0.98);

  // initialize MPU6050 sensor
  initMPU6050();
  //checkI2C();
  //connectToWiFi();

  // sets up to read Pulse Sensor signal every 2mS
  interruptSetup();
}

void loop()
{
  // 500ms delay
  delay(500);

  // read gps data
  sendGpsData();

  //display sensors data
  Serial.println(sendData(String(BPM), String(mlx.readObjectTempC()) + " °C", String(gps.location.lat(), 6), String(gps.location.lng(), 6), String(mpuFallDetection())));
}