#include <App.h>

// last 10 IBI values for average calculus
volatile int rate[10];
// average array flag so we startup with reasonable BPM
volatile boolean firstBeat = true;
// average array flag so we startup with reasonable BPM
volatile boolean secondBeat = false;
// used to determine pulse timing
volatile unsigned long sampleCounter = 0;
// used to find IBI
volatile unsigned long lastBeatTime = 0;
// pulse peak
volatile int P = 512;
// pulse trough
volatile int T = 512;
// instant moment of heart beat
volatile int thresh = 530;
// amplitude of pulse waveform
volatile int amp = 100;
// old Signal value
volatile int sensorValOld = 0;

// timer
hw_timer_t *timer = NULL;
volatile SemaphoreHandle_t timerSemaphore;

portMUX_TYPE timerMux = portMUX_INITIALIZER_UNLOCKED;
portMUX_TYPE intr = portMUX_INITIALIZER_UNLOCKED;

void ledFadeToBeat()
{
    // set LED fade value
    fadeRate -= 15;
    // keep LED fade value from going into negative numbers
    fadeRate = constrain(fadeRate, 0, 255);
}

int getPulse()
{
    //Signal = analogRead(pulsePin) / 4; // ESP32 ADC: 12bits -> set 10bits ADC value
    Signal = analogRead(pulsePin);
    Signal = map(Signal, 0, 4095, 0, 1023);

    // timer variable in mS
    sampleCounter += 2;
    // monitor the time since the last beat to avoid noise
    int N = sampleCounter - lastBeatTime;

    // Peak and Trough of the pulse wave
    // avoid dichrotic noise by waiting 3/5 of last IBI
    if (Signal < thresh && N > (IBI / 5) * 3)
    {
        if (Signal < T)
        {
            // Lowest point in pulse wave
            T = Signal;
        }
    }

    // Threshold condition to avoid noise
    if (Signal > thresh && Signal > P)
    {
        // Highest point in pulse wave
        P = Signal;
    }

    // if ((Signal - sensorValOld) > 600)
    // { // if the HRV variation between IBI is greater than 600ms
    //     BPM = 0;
    // }
    // if (Signal > 800)
    // {
    //     BPM = 0;
    // }

    // Pulse
    if (N > 250)
    {
        // avoid high frequency noise
        if ((Signal > thresh) && (Pulse == false) && (N > (IBI / 5) * 3))
        {
            // total of IBI values
            word runningTotal = 0;

            // Set Pulse flag
            Pulse = true;
            // pin2 LED = HIGH
            digitalWrite(blinkPin, HIGH);
            // measure time between beats in mS
            IBI = sampleCounter - lastBeatTime;
            // keep track of time for next pulse
            lastBeatTime = sampleCounter;

            if (secondBeat)
            {
                secondBeat = false;
                // average of BPM values to get a realisitic BPM at startup
                for (int i = 0; i <= 9; i++)
                {
                    rate[i] = IBI;
                }
            }

            if (firstBeat)
            {
                firstBeat = false;
                secondBeat = true;
                // enable interrupts
                sei();
                // return 0 if IBI value is unreliable
                return 0;
            }

            // keep a running total of the last 10 IBI values
            for (int i = 0; i <= 8; i++)
            {
                // shift data in the rate array
                // and drop the oldest IBI value
                rate[i] = rate[i + 1];
                // add up the 9 oldest IBI values
                runningTotal += rate[i];
            }

            // add the latest IBI to the rate array
            rate[9] = IBI;
            // add the latest IBI to runningTotal
            runningTotal += rate[9];
            runningTotal /= 10;
            BPM = 60000 / runningTotal;
            // set Quantified Self flag
            QS = true;
        }
    }

    //sensorValOld = Signal;

    // Decreasing values => the beat is over
    if (Signal < thresh && Pulse == true)
    {
        // turn off pin 2 LED
        digitalWrite(blinkPin, LOW);
        Pulse = false;
        // get amplitude of the pulse wave
        amp = P - T;
        // set threshold at 50% of the amplitude
        thresh = amp / 2 + T;
        // Reset peak & trough
        P = thresh;
        T = thresh;
    }

    // if 2.5 seconds go by without a beat
    if (N > 2500)
    {
        // set default values
        thresh = 530;
        P = 512;
        T = 512;
        // bring the lastBeatTime up to date
        lastBeatTime = sampleCounter;
        // set flags to avoid noise when we get the heartbeat back
        firstBeat = true;
        secondBeat = false;
    }

    // after the BPM and IBI have been determined
    if (QS == true)
    {
        // Makes the LED Fade Effect Happen
        fadeRate = 255;
        // reset the Quantified Self flag
        QS = false;
        ledFadeToBeat();
        return BPM;
    }
    else
    {
        return 0;
    }
}

void IRAM_ATTR isr()
{
    // disable interrupts
    portENTER_CRITICAL_ISR(&intr);
    getPulse();
    // enable interrupts
    portEXIT_CRITICAL_ISR(&intr);
    //uncheck timer semaphore
    xSemaphoreGiveFromISR(timerSemaphore, NULL);
}

void interruptSetup()
{
    attachInterrupt(digitalPinToInterrupt(pulsePin), isr, RISING);
    // Serial.println("start timer");

    timerSemaphore = xSemaphoreCreateBinary();
    // Initializes Timer1 to throw an interrupt every 2mS.
    // Use 1st timer of 4 (counted from zero).
    // Set 80 divider for prescaler
    timer = timerBegin(0, 80, true);         //prescaler set to obtain 1us
    timerAttachInterrupt(timer, &isr, true); //attach interrupt to timer
    timerAlarmWrite(timer, 2000, true);      //set alarm to call onTimer function every 2mS
    timerAlarmEnable(timer);                 //start alarm
}

void serialOutputWhenBeatHappens(int BPM)
{
    Serial.print("BPM: ");
    Serial.println(BPM);
}