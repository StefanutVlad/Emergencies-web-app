#include <ESPAsyncWebServer.h>

String requestFormat(String, String, String, String, String);
String postt(String, String, String, String, String);
void connectToWiFi();
void checkI2C();
void initMPU6050();
void mpu_read();
String mpuFallDetection();
void sendGpsData();

extern volatile int Signal;
extern volatile int IBI;
extern volatile int BPM;
typedef bool boolean;
extern volatile boolean Pulse;
extern volatile boolean QS;
extern int pulsePin;
extern int blinkPin;
extern int fadeRate;