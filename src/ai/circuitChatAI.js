/**
 * TinkerAI Circuit Chat AI — v4 COMPLETE EDITION
 *
 * Self-contained, NO external APIs.
 * Covers all 184 components in the TinkerAI registry.
 * - Safe browser DOM access (guarded)
 * - Natural language conversation
 * - Exact pin-to-pin wiring for every component
 * - Multi-component wiring plans
 * - Full system design templates
 * - Troubleshooting + Electronics FAQ
 */

// ─── Board detection helpers ──────────────────────────────────────────────────
function mcuType(id = '') {
  if (id.includes('esp32-s3')) return 'esp32s3';
  if (id.includes('esp32-c3')) return 'esp32c3';
  if (id.includes('esp32'))   return 'esp32';
  if (id.includes('pico-w'))  return 'picow';
  if (id.includes('pico'))    return 'pico';
  if (id.includes('mega'))    return 'mega';
  if (id.includes('nano'))    return 'nano';
  if (id.includes('leonardo'))return 'leonardo';
  if (id.includes('due'))     return 'due';
  if (id.includes('stm32'))   return 'stm32';
  if (id.includes('attiny'))  return 'attiny';
  if (id.includes('teensy'))  return 'teensy';
  if (id.includes('microbit'))return 'microbit';
  return 'uno';
}
function mcuLabel(id = '') {
  return {
    esp32s3:'ESP32-S3', esp32c3:'ESP32-C3', esp32:'ESP32',
    picow:'Pi Pico W', pico:'Raspberry Pi Pico',
    mega:'Arduino Mega', nano:'Arduino Nano', leonardo:'Arduino Leonardo',
    due:'Arduino Due', stm32:'STM32 BluePill', attiny:'ATtiny85',
    teensy:'Teensy 4', microbit:'BBC micro:bit', uno:'Arduino Uno',
  }[mcuType(id)] || 'Arduino Uno';
}
let pinAllocator = null;

function i2c(id = '') {
  const map = {
    esp32:   { sda:'GPIO21', scl:'GPIO22' },
    esp32s3: { sda:'GPIO8',  scl:'GPIO9'  },
    esp32c3: { sda:'GPIO8',  scl:'GPIO9'  },
    pico:    { sda:'GP4',    scl:'GP5'    },
    picow:   { sda:'GP4',    scl:'GP5'    },
    mega:    { sda:'Pin 20', scl:'Pin 21' },
    nano:    { sda:'A4',     scl:'A5'     },
    due:     { sda:'SDA(20)',scl:'SCL(21)'},
    stm32:   { sda:'PB7',   scl:'PB6'    },
    teensy:  { sda:'Pin 18',scl:'Pin 19' },
    microbit:{ sda:'P20',   scl:'P19'    },
    uno:     { sda:'A4',    scl:'A5'     },
  }[mcuType(id)] || { sda:'A4', scl:'A5' };
  if (pinAllocator) {
    pinAllocator.add(map.sda); pinAllocator.add(map.scl);
  }
  return map;
}
function spi(id = '') {
  const map = {
    esp32:  { mosi:'GPIO23', miso:'GPIO19', sck:'GPIO18', cs:'GPIO5' },
    pico:   { mosi:'GP19',   miso:'GP16',   sck:'GP18',  cs:'GP17'  },
    mega:   { mosi:'D51',    miso:'D50',    sck:'D52',   cs:'D53'   },
    uno:    { mosi:'D11',    miso:'D12',    sck:'D13',   cs:'D10'   },
    nano:   { mosi:'D11',    miso:'D12',    sck:'D13',   cs:'D10'   },
  }[mcuType(id)] || { mosi:'D11', miso:'D12', sck:'D13', cs:'D10' };
  
  if (pinAllocator) {
    pinAllocator.add(map.mosi); pinAllocator.add(map.miso); pinAllocator.add(map.sck);
    let cs = map.cs;
    const dMap = {
      esp32: ['GPIO5','GPIO15','GPIO4','GPIO2','GPIO13'],
      pico:  ['GP17','GP22','GP21','GP20','GP15'],
      mega:  ['D53','D48','D49','D47','D46'],
      uno:   ['D10','D9','D8','D7','D6'],
      nano:  ['D10','D9','D8','D7','D6'],
    }[mcuType(id)] || ['D10','D9','D8','D7'];
    for (const p of dMap) if (!pinAllocator.has(p)) { cs = p; break; }
    pinAllocator.add(cs);
    return { ...map, cs };
  }
  return map;
}
function pwmPin(id = '', n = 0) {
  const map = {
    esp32: ['GPIO14','GPIO12','GPIO13','GPIO15','GPIO2','GPIO4','GPIO16','GPIO17'],
    pico:  ['GP0','GP1','GP2','GP3','GP10','GP11','GP12','GP13'],
    mega:  ['D9','D10','D11','D44','D45','D46','D12','D13'],
    nano:  ['D9','D10','D11','D3','D5','D6'],
    uno:   ['D9','D10','D11','D3','D5','D6'],
  }[mcuType(id)] || ['D9','D10','D11','D3','D5','D6'];
  if (pinAllocator) {
    for (const p of map) if (!pinAllocator.has(p)) { pinAllocator.add(p); return p; }
    return 'No free PWM';
  }
  return map[n] || map[0];
}
function dpin(id = '', n = 0) {
  const map = {
    esp32: ['GPIO27','GPIO26','GPIO25','GPIO33','GPIO32','GPIO5','GPIO18','GPIO19','GPIO4','GPIO2','GPIO12','GPIO13','GPIO14','GPIO15'],
    pico:  ['GP6','GP7','GP8','GP9','GP10','GP11','GP12','GP13','GP14','GP15','GP16','GP17','GP18','GP19','GP20','GP21','GP22'],
    mega:  ['D4','D5','D6','D7','D8','D22','D23','D24','D25','D26','D27','D28','D29','D30','D31','D32'],
    nano:  ['D4','D5','D6','D7','D8','D12','D2','D3','D13','D11'],
    uno:   ['D4','D5','D6','D7','D8','D12','D2','D3','D13','D11'],
  }[mcuType(id)] || ['D4','D5','D6','D7','D8','D12','D2','D3'];
  if (pinAllocator) {
    for (const p of map) if (!pinAllocator.has(p)) { pinAllocator.add(p); return p; }
    return 'No free D-Pin';
  }
  return map[n] || map[0];
}
function apin(id = '', n = 0) {
  const map = {
    esp32: ['GPIO34','GPIO35','GPIO36','GPIO39','GPIO32','GPIO33'],
    pico:  ['GP26','GP27','GP28','GP29'],
    mega:  ['A0','A1','A2','A3','A4','A5','A6','A7','A8','A9'],
    nano:  ['A0','A1','A2','A3','A4','A5','A6','A7'],
    uno:   ['A0','A1','A2','A3','A4','A5'],
  }[mcuType(id)] || ['A0','A1','A2','A3'];
  if (pinAllocator) {
    for (const p of map) if (!pinAllocator.has(p)) { pinAllocator.add(p); return p; }
    return 'No free A-Pin';
  }
  return map[n] || map[0];
}

// ─── Component alias lookup ───────────────────────────────────────────────────
const ALIASES = [
  // Microcontrollers
  { id:'arduino-uno',         names:['arduino uno','arduino','uno','atmega328'] },
  { id:'arduino-nano',        names:['arduino nano','nano'] },
  { id:'arduino-mega',        names:['arduino mega','mega','mega 2560'] },
  { id:'arduino-leonardo',    names:['arduino leonardo','leonardo'] },
  { id:'arduino-due',         names:['arduino due','due'] },
  { id:'esp32',               names:['esp32','esp 32','espressif'] },
  { id:'esp32-s3',            names:['esp32-s3','esp32 s3'] },
  { id:'esp32-c3',            names:['esp32-c3','esp32 c3'] },
  { id:'esp8266',             names:['esp8266','nodemcu','wemos d1'] },
  { id:'raspberry-pi-pico',   names:['pico','pi pico','rp2040','raspberry pico'] },
  { id:'raspberry-pi-pico-w', names:['pico w','pi pico w','pico wireless'] },
  { id:'stm32-bluepill',      names:['stm32','bluepill','stm32f103'] },
  { id:'attiny85',            names:['attiny','attiny85'] },
  { id:'teensy-4',            names:['teensy','teensy 4'] },
  { id:'bbc-microbit',        names:['microbit','micro:bit','bbc microbit'] },
  // Sensors — distance/motion
  { id:'hc-sr04',             names:['hc-sr04','hcsr04','ultrasonic','distance sensor','sonar'] },
  { id:'pir-sensor',          names:['pir','pir sensor','motion sensor','motion detector','hc-sr501'] },
  { id:'ir-sensor',           names:['ir sensor','infrared sensor','ir obstacle','tcrt5000'] },
  { id:'ir-receiver',         names:['ir receiver','ir remote','infrared receiver','tsop'] },
  { id:'rotary-encoder',      names:['rotary encoder','encoder','ky-040'] },
  { id:'hall-effect',         names:['hall effect','hall sensor','magnetic sensor'] },
  { id:'vibration-sensor',    names:['vibration sensor','vibration','sw-420'] },
  { id:'tilt-sensor',         names:['tilt sensor','tilt','tilt switch'] },
  { id:'flex-sensor',         names:['flex sensor','bend sensor','flex'] },
  { id:'force-sensor',        names:['force sensor','fsr','pressure pad','force'] },
  { id:'touch-sensor',        names:['touch sensor','capacitive touch','ttp223'] },
  { id:'fingerprint-sensor',  names:['fingerprint','fingerprint sensor','r307','r503'] },
  // Sensors — environmental
  { id:'dht22',               names:['dht22','dht 22','am2302'] },
  { id:'dht11',               names:['dht11','dht 11'] },
  { id:'bmp280',              names:['bmp280','bmp 280','pressure sensor','barometric'] },
  { id:'bme280',              names:['bme280','bme 280','bme'] },
  { id:'mpu6050',             names:['mpu6050','mpu 6050','imu','gyroscope','accelerometer','gyro'] },
  { id:'adxl345',             names:['adxl345','adxl','accelerometer module'] },
  { id:'ds18b20',             names:['ds18b20','ds18','waterproof temp','one wire temp','onewire temperature'] },
  { id:'ldr',                 names:['ldr','light sensor','photoresistor','light dependent'] },
  { id:'soil-moisture',       names:['soil moisture','soil sensor','moisture sensor'] },
  { id:'mq2-gas',             names:['mq2','mq-2','gas sensor','smoke sensor','mq 2'] },
  { id:'mq135-air',           names:['mq135','mq-135','air quality','co2 sensor','mq 135'] },
  { id:'water-level',         names:['water level','water sensor','flood sensor'] },
  { id:'flame-sensor',        names:['flame sensor','fire sensor','flame detector'] },
  { id:'rain-sensor',         names:['rain sensor','rain detector','rain module'] },
  { id:'sound-sensor',        names:['sound sensor','microphone sensor','mic sensor','sound module','ky-038'] },
  { id:'uv-sensor',           names:['uv sensor','ultraviolet sensor','ml8511'] },
  { id:'acs712',              names:['acs712','current sensor','hall current'] },
  { id:'hx711',               names:['hx711','load cell','weight sensor'] },
  { id:'max30102',            names:['max30102','heart rate','pulse oximeter','spo2'] },
  { id:'tcs3200',             names:['tcs3200','color sensor','colour sensor','tcs34725'] },
  { id:'voltage-sensor',      names:['voltage sensor','voltage divider module','voltage module'] },
  { id:'thermistor-ntc',      names:['thermistor','ntc','thermistor ntc'] },
  // Displays
  { id:'lcd-16x2',            names:['lcd','lcd display','lcd 16x2','16x2','character lcd','liquid crystal'] },
  { id:'lcd-20x4',            names:['lcd 20x4','20x4','20 4 lcd','large lcd'] },
  { id:'oled-096',            names:['oled','oled display','oled screen','ssd1306','0.96 oled'] },
  { id:'oled-130',            names:['oled 1.3','1.3 oled','sh1106'] },
  { id:'tft-18',              names:['1.8 tft','tft 1.8','st7735','tft display small'] },
  { id:'tft-28',              names:['tft','tft display','2.8 tft','ili9341','touch screen','tft 2.8'] },
  { id:'7seg-display',        names:['7 segment','seven segment','7seg','seven seg'] },
  { id:'4digit-7seg',         names:['4 digit','4-digit 7 segment','tm1637','7 segment 4'] },
  { id:'led-matrix-8x8',      names:['led matrix','8x8 matrix','max7219','matrix display'] },
  { id:'epaper',              names:['epaper','e-paper','e ink','eink display'] },
  // LEDs
  { id:'led-red',             names:['led','red led','led light','light emitting diode'] },
  { id:'led-green',           names:['green led'] },
  { id:'led-blue',            names:['blue led'] },
  { id:'led-yellow',          names:['yellow led'] },
  { id:'led-white',           names:['white led'] },
  { id:'led-ir',              names:['ir led','infrared led'] },
  { id:'rgb-led',             names:['rgb led','rgb','colour led','color led'] },
  { id:'neopixel-ring',       names:['neopixel ring','neopixel','ws2812','addressable led'] },
  { id:'neopixel-strip',      names:['led strip','neopixel strip','rgb strip','ws2812b strip'] },
  // Motors & Actuators
  { id:'dc-motor-3v',         names:['dc motor','dc motor 3v','small dc motor','toy motor'] },
  { id:'dc-motor-6v',         names:['6v motor','dc motor 6v'] },
  { id:'dc-motor-12v',        names:['12v motor','dc motor 12v'] },
  { id:'servo-sg90',          names:['servo','servo motor','sg90','micro servo'] },
  { id:'servo-mg996r',        names:['mg996r','high torque servo','metal servo'] },
  { id:'stepper-28byj48',     names:['stepper','stepper motor','28byj48','uln2003','28byj'] },
  { id:'stepper-nema17',      names:['nema17','nema 17','stepper nema','bipolar stepper'] },
  { id:'linear-actuator',     names:['linear actuator','actuator','linear motor'] },
  { id:'solenoid-5v',         names:['solenoid 5v','solenoid','door lock'] },
  { id:'solenoid-12v',        names:['solenoid 12v','12v solenoid'] },
  { id:'water-pump',          names:['water pump','pump','mini pump','submersible pump'] },
  { id:'fan-5v',              names:['fan','cooling fan','5v fan','dc fan'] },
  { id:'vibration-motor',     names:['vibration motor','vibration actuator','haptic motor'] },
  // Motor Drivers
  { id:'l298n',               names:['l298n','l298','motor driver','motor controller','h-bridge','h bridge'] },
  { id:'l293d',               names:['l293d','l293','dual h bridge'] },
  { id:'a4988',               names:['a4988','a4988 driver','stepper driver a4988'] },
  { id:'drv8825',             names:['drv8825','drv 8825','stepper driver drv'] },
  { id:'tb6612fng',           names:['tb6612','tb6612fng','sparkfun motor driver'] },
  { id:'uln2003',             names:['uln2003','uln 2003','darlington array'] },
  // 4WD chassis
  { id:'4wd-car-chassis',     names:['4wd','car chassis','robot car','smart car','chassis','4 wheel drive','robot chassis'] },
  // Wireless
  { id:'bluetooth-hc05',      names:['bluetooth','hc-05','hc05','bt module','hc 05','bluetooth module'] },
  { id:'bluetooth-hc06',      names:['hc-06','hc06','hc 06','bluetooth hc06'] },
  { id:'wifi-esp8266',        names:['wifi module','esp8266 module','wifi shield'] },
  { id:'nrf24l01',            names:['nrf24','nrf24l01','2.4ghz','rf module','nordic'] },
  { id:'lora-sx1278',         names:['lora','sx1278','ra-02','long range radio'] },
  { id:'gsm-sim800l',         names:['gsm','sim800','gsm module','sim800l','cellular'] },
  { id:'gps-neo6m',           names:['gps','neo6m','neo-6m','gps module'] },
  { id:'rfid-rc522',          names:['rfid','rc522','rfid reader','mfrc522'] },
  { id:'ir-transmitter',      names:['ir transmitter','ir blaster','ir sender'] },
  // Interface
  { id:'rs485-module',        names:['rs485','rs-485','modbus','max485'] },
  { id:'can-mcp2515',         names:['can bus','mcp2515','can module','canbus'] },
  { id:'ethernet-w5500',      names:['ethernet','w5500','ethernet module','w5100'] },
  { id:'sd-card-module',      names:['sd card','sd module','micro sd','sdcard'] },
  { id:'dfplayer-mini',       names:['dfplayer','mp3 module','dfplayer mini','audio module','mp3 player'] },
  { id:'pam8403',             names:['pam8403','audio amplifier','amp module','speaker amp'] },
  // ICs & Special
  { id:'74hc595',             names:['74hc595','shift register','595','serial to parallel'] },
  { id:'pcf8574',             names:['pcf8574','i2c io expander','io expander','gpio expander'] },
  { id:'ads1115',             names:['ads1115','adc module','16bit adc','analog to digital'] },
  { id:'mcp4725',             names:['mcp4725','dac module','digital to analog'] },
  { id:'at24c256',            names:['at24c256','eeprom','i2c eeprom','external eeprom'] },
  { id:'ds3231',              names:['ds3231','rtc','real time clock','real-time clock'] },
  { id:'ds1307',              names:['ds1307','rtc 1307'] },
  { id:'555-timer',           names:['555','ne555','555 timer','timer ic'] },
  { id:'lm741-opamp',         names:['lm741','741','op amp','operational amplifier'] },
  { id:'lm358-opamp',         names:['lm358','358','dual op amp'] },
  { id:'optocoupler-817',     names:['optocoupler','opto','4n35','pc817','opto-isolator'] },
  { id:'bridge-rectifier',    names:['bridge rectifier','full wave','rectifier'] },
  // Relays & Sound
  { id:'relay-module',        names:['relay','relay module','single relay','5v relay'] },
  { id:'relay-4ch',           names:['4 channel relay','4ch relay','relay 4','relay board'] },
  { id:'relay-8ch',           names:['8 channel relay','8ch relay','relay 8'] },
  { id:'buzzer-active',       names:['buzzer','active buzzer','beeper','buzzer active'] },
  { id:'buzzer-passive',      names:['passive buzzer','piezo','piezo buzzer'] },
  { id:'speaker-8ohm',        names:['speaker','8 ohm speaker','small speaker'] },
  // Passive components
  { id:'resistor-220ohm',     names:['220 ohm','220ohm','resistor 220'] },
  { id:'resistor-330ohm',     names:['330 ohm','330ohm','resistor 330'] },
  { id:'resistor-1kohm',      names:['1k','1kohm','1 kohm','1k resistor'] },
  { id:'resistor-10kohm',     names:['10k','10kohm','10 kohm','10k resistor'] },
  { id:'resistor-100kohm',    names:['100k','100kohm','100k resistor'] },
  { id:'resistor-4.7kohm',    names:['4.7k','4k7','4.7kohm','pull up resistor'] },
  { id:'potentiometer-10k',   names:['potentiometer','pot','10k pot','knob','variable resistor'] },
  { id:'potentiometer-100k',  names:['100k pot','100k potentiometer'] },
  { id:'trimmer-10k',         names:['trimmer','trim pot','trimmer potentiometer'] },
  { id:'cap-ceramic-100nf',   names:['100nf','0.1uf','decoupling cap','ceramic cap'] },
  { id:'cap-electrolytic-100uf',  names:['100uf','electrolytic capacitor','electrolytic cap'] },
  { id:'cap-electrolytic-1000uf', names:['1000uf','1000 uf','big cap','bulk capacitor'] },
  { id:'inductor-10uh',       names:['inductor','10uh','coil','inductor 10'] },
  { id:'diode-1n4007',        names:['diode','1n4007','rectifier diode'] },
  { id:'diode-1n4148',        names:['1n4148','signal diode','fast diode'] },
  { id:'zener-5v1',           names:['zener','5.1v zener','zener diode','voltage clamp'] },
  { id:'schottky-1n5819',     names:['schottky','1n5819','schottky diode'] },
  // Transistors & MOSFETs
  { id:'npn-2n2222',          names:['npn','2n2222','npn transistor','bjt'] },
  { id:'pnp-2n2907',          names:['pnp','2n2907','pnp transistor'] },
  { id:'npn-tip120',          names:['tip120','tip 120','darlington transistor'] },
  { id:'mosfet-irf540n',      names:['irf540','mosfet','n-channel mosfet','nmos'] },
  { id:'mosfet-irlz44n',      names:['irlz44','logic level mosfet','irlz44n'] },
  // Power
  { id:'battery-9v',          names:['9v battery','9 volt','9v'] },
  { id:'battery-aa',          names:['aa battery','aa cell','1.5v battery'] },
  { id:'battery-lipo-3.7v',   names:['lipo','lipo battery','3.7v battery','lithium polymer'] },
  { id:'battery-18650',       names:['18650','18650 battery','li-ion cell'] },
  { id:'battery-holder-2cell',names:['battery holder','2 cell battery','2xaa holder'] },
  { id:'lm7805',              names:['7805','lm7805','5v regulator','voltage regulator 5v'] },
  { id:'lm7812',              names:['7812','lm7812','12v regulator'] },
  { id:'lm317',               names:['lm317','adjustable regulator','317'] },
  { id:'ams1117-3.3',         names:['ams1117','3.3v regulator','ams 1117','3.3 ldo'] },
  { id:'buck-converter',      names:['buck converter','buck','step down','dc-dc converter'] },
  { id:'boost-converter',     names:['boost converter','boost','step up','boost module'] },
  { id:'solar-panel-6v',      names:['solar panel','solar','solar cell','photovoltaic'] },
  { id:'tp4056',              names:['tp4056','lipo charger','battery charger','charging module'] },
  { id:'power-bank-5v',       names:['power bank','usb power bank','5v bank'] },
  // Input
  { id:'push-button',         names:['button','push button','pushbutton','switch','tactile switch'] },
  { id:'toggle-switch',       names:['toggle switch','on off switch','toggle'] },
  { id:'slide-switch',        names:['slide switch','spdt switch'] },
  { id:'rocker-switch',       names:['rocker switch','rocker'] },
  { id:'dip-switch-4',        names:['dip switch','4 dip switch','dip'] },
  { id:'keypad-4x4',          names:['keypad','4x4 keypad','matrix keypad','4 by 4 keypad'] },
  { id:'keypad-4x3',          names:['4x3 keypad','phone keypad','numeric keypad'] },
  { id:'joystick',            names:['joystick','analog joystick','thumbstick','ky-023'] },
  // Misc
  { id:'level-shifter-4ch',   names:['level shifter','level converter','voltage level','5v to 3.3v','3.3v to 5v'] },
  { id:'usb-cable',           names:['usb cable','usb','usb connection'] },
  { id:'breadboard-830',      names:['breadboard','solderless breadboard'] },
];

// ─── Wiring DB — one function per component ID ─────────────────────────────────
// fn(mcuId) → { title, rows:[[from,to]], note, code }
const WIRING = {

  // ── DISPLAYS ────────────────────────────────────────────────────────────────
  'lcd-16x2': m => { const p=i2c(m),n=mcuLabel(m); return {
    title:'LCD 16×2 Display (I2C Backpack)',
    rows:[['LCD VCC',`${n} 5V`],['LCD GND',`${n} GND`],['LCD SDA',`${n} ${p.sda} (SDA)`],['LCD SCL',`${n} ${p.scl} (SCL)`]],
    note:'💡 I2C address: **0x27** or **0x3F**. Adjust blue potentiometer on backpack for contrast.\n⚠️ Without I2C backpack you need 6 digital pins + contrast pot.',
    code:`#include <Wire.h>\n#include <LiquidCrystal_I2C.h>\nLiquidCrystal_I2C lcd(0x27, 16, 2);\nvoid setup() { lcd.init(); lcd.backlight(); lcd.print("Hello!"); }\nvoid loop() {}`,
  };},
  'lcd-20x4': m => { const p=i2c(m),n=mcuLabel(m); return {
    title:'LCD 20×4 Display (I2C)',
    rows:[['LCD VCC',`${n} 5V`],['LCD GND',`${n} GND`],['LCD SDA',`${n} ${p.sda}`],['LCD SCL',`${n} ${p.scl}`]],
    note:'💡 I2C address: **0x27** or **0x3F**. Same wiring as 16×2 — just change lcd(0x27, 20, 4).',
    code:`#include <Wire.h>\n#include <LiquidCrystal_I2C.h>\nLiquidCrystal_I2C lcd(0x27, 20, 4);\nvoid setup() { lcd.init(); lcd.backlight(); lcd.setCursor(0,0); lcd.print("20x4 LCD!"); }\nvoid loop() {}`,
  };},
  'oled-096': m => { const p=i2c(m),n=mcuLabel(m); return {
    title:'OLED 0.96" SSD1306 (I2C)',
    rows:[['OLED VCC',`${n} 3.3V ⚠️`],['OLED GND',`${n} GND`],['OLED SDA',`${n} ${p.sda}`],['OLED SCL',`${n} ${p.scl}`]],
    note:'⚠️ Use **3.3V**, NOT 5V! I2C address: **0x3C**. Library: Adafruit SSD1306 + GFX.',
    code:`#include <Wire.h>\n#include <Adafruit_GFX.h>\n#include <Adafruit_SSD1306.h>\nAdafruit_SSD1306 display(128,64,&Wire,-1);\nvoid setup() { display.begin(SSD1306_SWITCHCAPVCC,0x3C); display.clearDisplay(); display.setTextColor(WHITE); display.print("Hello!"); display.display(); }\nvoid loop() {}`,
  };},
  'oled-130': m => { const p=i2c(m),n=mcuLabel(m); return {
    title:'OLED 1.3" SH1106 (I2C)',
    rows:[['OLED VCC',`${n} 3.3V`],['OLED GND',`${n} GND`],['OLED SDA',`${n} ${p.sda}`],['OLED SCL',`${n} ${p.scl}`]],
    note:'💡 Use Adafruit SH110X library. I2C address: **0x3C** or **0x3D**.',
    code:`#include <Wire.h>\n#include <Adafruit_GFX.h>\n#include <Adafruit_SH110X.h>\nAdafruit_SH1106G display(128,64,&Wire,-1);\nvoid setup() { display.begin(0x3c,true); display.print("1.3 OLED!"); display.display(); }`,
  };},
  'tft-28': m => { const sp=spi(m),n=mcuLabel(m); return {
    title:'2.8" TFT Display ILI9341 (SPI)',
    rows:[['TFT VCC',`${n} 5V`],['TFT GND',`${n} GND`],['TFT CS',`${n} ${sp.cs}`],['TFT RST',`${n} ${dpin(m,4)}`],['TFT DC',`${n} ${dpin(m,5)}`],['TFT MOSI/SDI',`${n} ${sp.mosi}`],['TFT SCK',`${n} ${sp.sck}`],['TFT LED',`${n} 3.3V or via 100Ω to 5V`],['TFT MISO',`${n} ${sp.miso} (optional)`]],
    note:'💡 Use Adafruit ILI9341 library. TFT_eSPI is faster on ESP32.',
    code:`#include <Adafruit_GFX.h>\n#include <Adafruit_ILI9341.h>\n#define TFT_CS ${sp.cs.replace(/[^0-9A-Za-z]/g,'')}\n#define TFT_DC ${dpin(m,5).replace(/[^0-9A-Za-z]/g,'')}\nAdafruit_ILI9341 tft(TFT_CS, TFT_DC);\nvoid setup() { tft.begin(); tft.fillScreen(ILI9341_BLACK); tft.setTextColor(ILI9341_WHITE); tft.print("TinkerAI"); }`,
  };},
  'tft-18': m => { const sp=spi(m),n=mcuLabel(m); return {
    title:'1.8" TFT Display ST7735 (SPI)',
    rows:[['TFT VCC',`${n} 5V`],['TFT GND',`${n} GND`],['TFT CS',`${n} ${sp.cs}`],['TFT RST',`${n} ${dpin(m,4)}`],['TFT A0/DC',`${n} ${dpin(m,5)}`],['TFT SDA/MOSI',`${n} ${sp.mosi}`],['TFT SCK',`${n} ${sp.sck}`],['TFT LED',`${n} 3.3V`]],
    note:'💡 Use Adafruit ST7735 library.',
    code:`#include <Adafruit_GFX.h>\n#include <Adafruit_ST7735.h>\nAdafruit_ST7735 tft(&SPI, ${sp.cs.replace(/[^0-9A-Za-z]/g,'')}, ${dpin(m,5).replace(/[^0-9A-Za-z]/g,'')}, ${dpin(m,4).replace(/[^0-9A-Za-z]/g,'')});\nvoid setup() { tft.initR(INITR_BLACKTAB); tft.fillScreen(ST77XX_BLACK); tft.print("ST7735"); }`,
  };},
  '7seg-display': m => { const n=mcuLabel(m); return {
    title:'7-Segment Display (Common Cathode)',
    rows:[['Segment a',`${n} ${dpin(m,0)} + 220Ω`],['Segment b',`${n} ${dpin(m,1)} + 220Ω`],['Segment c',`${n} ${dpin(m,2)} + 220Ω`],['Segment d',`${n} ${dpin(m,3)} + 220Ω`],['Segment e',`${n} ${dpin(m,4)} + 220Ω`],['Segment f',`${n} ${dpin(m,5)} + 220Ω`],['Segment g',`${n} ${dpin(m,6)} + 220Ω`],['Common Cathode',`${n} GND`]],
    note:'💡 For Common Anode: reverse — common to 5V, segments go LOW to light up.\n💡 Use a 74HC595 shift register to control with only 3 pins.',
    code:`byte digits[] = {0x3F,0x06,0x5B,0x4F,0x66,0x6D,0x7D,0x07,0x7F,0x6F}; // 0-9\nvoid showDigit(int d) {\n  // Map bits to pins d4–d10\n  for(int i=0;i<7;i++) digitalWrite(4+i, (digits[d]>>i)&1);\n}`,
  };},
  '4digit-7seg': m => { const p=i2c(m),n=mcuLabel(m); return {
    title:'4-Digit 7-Segment Display TM1637',
    rows:[['TM1637 VCC',`${n} 5V`],['TM1637 GND',`${n} GND`],['TM1637 CLK',`${n} ${dpin(m,6)}`],['TM1637 DIO',`${n} ${dpin(m,7)}`]],
    note:'💡 Only needs 2 data pins (not I2C). Use TM1637Display library.',
    code:`#include <TM1637Display.h>\n#define CLK ${dpin(m,6).replace(/[^0-9]/g,'')}\n#define DIO ${dpin(m,7).replace(/[^0-9]/g,'')}\nTM1637Display d(CLK,DIO);\nvoid setup() { d.setBrightness(5); d.showNumberDec(1234); }`,
  };},
  'led-matrix-8x8': m => { const n=mcuLabel(m); return {
    title:'8×8 LED Matrix (MAX7219)',
    rows:[['MAX7219 VCC',`${n} 5V`],['MAX7219 GND',`${n} GND`],['MAX7219 DIN',`${n} ${dpin(m,0)}`],['MAX7219 CLK',`${n} ${dpin(m,1)}`],['MAX7219 CS/LOAD',`${n} ${dpin(m,2)}`]],
    note:'💡 Use LedControl or MD_MAX72XX library. Can daisy-chain multiple matrices.',
    code:`#include <LedControl.h>\nLedControl lc(${dpin(m,0).replace(/[^0-9]/g,'')},${dpin(m,1).replace(/[^0-9]/g,'')},${dpin(m,2).replace(/[^0-9]/g,'')},1);\nvoid setup() { lc.shutdown(0,false); lc.setIntensity(0,8); lc.clearDisplay(0); }`,
  };},
  'epaper': m => { const sp=spi(m),n=mcuLabel(m); return {
    title:'E-Paper / E-Ink Display (SPI)',
    rows:[['EPD VCC',`${n} 3.3V`],['EPD GND',`${n} GND`],['EPD DIN/MOSI',`${n} ${sp.mosi}`],['EPD CLK',`${n} ${sp.sck}`],['EPD CS',`${n} ${sp.cs}`],['EPD DC',`${n} ${dpin(m,4)}`],['EPD RST',`${n} ${dpin(m,5)}`],['EPD BUSY',`${n} ${dpin(m,6)}`]],
    note:'💡 Use GxEPD2 library. E-paper updates slowly (~2s) but holds image with NO power.',
    code:`// Install GxEPD2 library, then:\n#include <GxEPD2_BW.h>\nGxEPD2_BW<GxEPD2_154, GxEPD2_154::HEIGHT> display(GxEPD2_154(10,8,9,7));`,
  };},

  // ── LEDs ────────────────────────────────────────────────────────────────────
  'led-red': m => { const n=mcuLabel(m),p=dpin(m,6),r=m.includes('esp32')||m.includes('pico')?'330Ω':'220Ω'; return {
    title:'LED (any colour)',
    rows:[[`LED Anode (+) long leg`,`${r} resistor → ${n} ${p}`],[`LED Cathode (−) short leg`,`${n} GND`]],
    note:`⚠️ **Always use a current-limiting resistor!**\nFormula: R = (Vcc − Vf) / I\n- 5V supply + Red LED: (5−2)/0.02 = 150Ω → use **220Ω**\n- 3.3V supply: (3.3−2)/0.02 = 65Ω → use **100–220Ω**`,
    code:`#define LED ${p.replace(/[^0-9]/g,'')}\nvoid setup() { pinMode(LED, OUTPUT); }\nvoid loop() { digitalWrite(LED, HIGH); delay(1000); digitalWrite(LED, LOW); delay(1000); }`,
  };},
  'led-green': m => WIRING['led-red'](m),
  'led-blue': m => { const d = WIRING['led-red'](m); d.note += '\n💡 Blue/White LEDs have Vf ≈ 3.2V, so R = (5−3.2)/0.02 = 90Ω → use 100Ω.'; return d; },
  'led-yellow': m => WIRING['led-red'](m),
  'led-white': m => WIRING['led-blue'](m),
  'led-ir': m => { const n=mcuLabel(m),p=dpin(m,6); return {
    title:'IR LED (Infrared Transmitter)',
    rows:[['IR LED Anode (+)','100Ω resistor → '+n+' '+p],['IR LED Cathode (−)',n+' GND']],
    note:'💡 Invisible to human eyes but visible on phone cameras. Use with IRremote library for TV remote codes.',
    code:`#include <IRremote.h>\nIRsend irsend;\nvoid loop() { irsend.sendNEC(0xFFA25D, 32); delay(1000); }`,
  };},
  'rgb-led': m => { const n=mcuLabel(m); return {
    title:'RGB LED (Common Cathode)',
    rows:[['R Pin','220Ω → '+n+' '+pwmPin(m,0)],['G Pin','220Ω → '+n+' '+pwmPin(m,1)],['B Pin','220Ω → '+n+' '+pwmPin(m,2)],['Common Cathode (longest)',n+' GND']],
    note:'💡 Common Anode type: connect longest pin to 5V, drive pins LOW to light.\n💡 PWM pins allow color mixing.',
    code:`void setup() { pinMode(${pwmPin(m,0).replace(/[^0-9]/g,'')},OUTPUT); pinMode(${pwmPin(m,1).replace(/[^0-9]/g,'')},OUTPUT); pinMode(${pwmPin(m,2).replace(/[^0-9]/g,'')},OUTPUT); }\nvoid loop() { analogWrite(${pwmPin(m,0).replace(/[^0-9]/g,'')},255); analogWrite(${pwmPin(m,1).replace(/[^0-9]/g,'')},0); analogWrite(${pwmPin(m,2).replace(/[^0-9]/g,'')},128); delay(1000); }`,
  };},
  'neopixel-ring': m => { const n=mcuLabel(m),p=dpin(m,6); return {
    title:'NeoPixel Ring / Strip WS2812B',
    rows:[['NeoPixel VCC 5V','External 5V supply (NOT Arduino 5V pin for >10 LEDs)'],['NeoPixel GND',n+' GND + external supply GND'],['NeoPixel DIN','300Ω resistor → '+n+' '+p]],
    note:'💡 **1000µF capacitor** between 5V and GND prevents spikes.\n300–500Ω on DIN prevents signal corruption.\n⚠️ Each LED draws 60mA at full white — plan your power supply!',
    code:`#include <Adafruit_NeoPixel.h>\n#define PIN ${p.replace(/[^0-9]/g,'')}\n#define N 16\nAdafruit_NeoPixel strip(N,PIN,NEO_GRB+NEO_KHZ800);\nvoid setup() { strip.begin(); strip.show(); }\nvoid loop() { for(int i=0;i<N;i++) { strip.setPixelColor(i,strip.Color(0,150,0)); strip.show(); delay(50); } }`,
  };},
  'neopixel-strip': m => WIRING['neopixel-ring'](m),

  // ── SENSORS — Distance/Motion ────────────────────────────────────────────
  'hc-sr04': m => { const n=mcuLabel(m),t=dpin(m,0),e=dpin(m,1); return {
    title:'HC-SR04 Ultrasonic Distance Sensor',
    rows:[['HC-SR04 VCC',n+' 5V'],['HC-SR04 GND',n+' GND'],['HC-SR04 TRIG',n+' '+t],['HC-SR04 ECHO',n+' '+e+(m.includes('esp32')||m.includes('pico')?' → 1kΩ+2kΩ divider ⚠️':'')]],
    note:'⚠️ ECHO is 5V — safe for Arduino, needs voltage divider for ESP32/Pico (3.3V logic).\n💡 Trigger with 10µs HIGH pulse, measure echo duration → distance in cm.',
    code:`#define TRIG ${t.replace(/[^0-9]/g,'')}\n#define ECHO ${e.replace(/[^0-9]/g,'')}\nvoid setup() { Serial.begin(9600); pinMode(TRIG,OUTPUT); pinMode(ECHO,INPUT); }\nvoid loop() { digitalWrite(TRIG,LOW); delayMicroseconds(2); digitalWrite(TRIG,HIGH); delayMicroseconds(10); digitalWrite(TRIG,LOW); Serial.println(pulseIn(ECHO,HIGH)/58.2); delay(500); }`,
  };},
  'pir-sensor': m => { const n=mcuLabel(m),p=dpin(m,4); return {
    title:'PIR Motion Sensor HC-SR501',
    rows:[['PIR VCC',n+' 5V'],['PIR GND',n+' GND'],['PIR OUT',n+' '+p]],
    note:'💡 Warm-up time: **30–60 seconds** after power on.\nTwo trimmers: sensitivity (left) and time delay (right).',
    code:`#define PIR ${p.replace(/[^0-9]/g,'')}\nvoid setup() { Serial.begin(9600); pinMode(PIR,INPUT); delay(30000); }\nvoid loop() { if(digitalRead(PIR)) { Serial.println("Motion!"); delay(1000); } }`,
  };},
  'ir-sensor': m => { const n=mcuLabel(m),p=dpin(m,4); return {
    title:'IR Obstacle Sensor (TCRT5000)',
    rows:[['IR Sensor VCC',n+' 5V'],['IR Sensor GND',n+' GND'],['IR Sensor OUT',n+' '+p]],
    note:'💡 OUT = LOW when object detected, HIGH when clear. Adjust sensitivity via onboard potentiometer.',
    code:`#define IR_PIN ${p.replace(/[^0-9]/g,'')}\nvoid setup() { Serial.begin(9600); pinMode(IR_PIN,INPUT); }\nvoid loop() { Serial.println(digitalRead(IR_PIN)==LOW?"Object detected":"Clear"); delay(200); }`,
  };},
  'ir-receiver': m => { const n=mcuLabel(m),p=dpin(m,4); return {
    title:'IR Receiver (TSOP1838)',
    rows:[['IR Receiver VCC (left)',n+' 5V'],['IR Receiver GND (middle)',n+' GND'],['IR Receiver OUT (right)',n+' '+p]],
    note:'💡 Receives modulated IR signals from remote controls. Use IRremote library.',
    code:`#include <IRremote.h>\n#define RECV_PIN ${p.replace(/[^0-9]/g,'')}\nIRrecv irrecv(RECV_PIN);\nvoid setup() { Serial.begin(9600); irrecv.enableIRIn(); }\nvoid loop() { if(irrecv.decode()) { Serial.println(irrecv.decodedIRData.decodedRawData,HEX); irrecv.resume(); } }`,
  };},
  'rotary-encoder': m => { const n=mcuLabel(m),clk=dpin(m,4),dt=dpin(m,5),sw=dpin(m,6); return {
    title:'Rotary Encoder KY-040',
    rows:[['Encoder VCC (+)',n+' 5V'],['Encoder GND',n+' GND'],['Encoder CLK',n+' '+clk],['Encoder DT',n+' '+dt],['Encoder SW (button)',n+' '+sw]],
    note:'💡 CLK and DT change when you turn the knob. SW goes LOW when pressed.\nAdd pull-up resistors or use INPUT_PULLUP.',
    code:`#define CLK ${clk.replace(/[^0-9]/g,'')}\n#define DT ${dt.replace(/[^0-9]/g,'')}\nint counter=0; int lastCLK;\nvoid setup() { Serial.begin(9600); pinMode(CLK,INPUT); pinMode(DT,INPUT); lastCLK=digitalRead(CLK); }\nvoid loop() { int c=digitalRead(CLK); if(c!=lastCLK) { if(digitalRead(DT)!=c) counter++; else counter--; Serial.println(counter); lastCLK=c; } }`,
  };},
  'hall-effect': m => { const n=mcuLabel(m),p=apin(m,0); return {
    title:'Hall Effect Sensor (KY-024)',
    rows:[['Hall VCC',n+' 5V'],['Hall GND',n+' GND'],['Hall AO',n+' '+p],['Hall DO',n+' '+dpin(m,4)]],
    note:'💡 Detects magnetic fields. AO = analog field strength, DO = digital threshold.',
    code:`void loop() { int val=analogRead(A0); if(val<400) Serial.println("Magnet detected!"); delay(100); }`,
  };},
  'vibration-sensor': m => { const n=mcuLabel(m),p=dpin(m,4); return {
    title:'Vibration Sensor SW-420',
    rows:[['Sensor VCC',n+' 5V'],['Sensor GND',n+' GND'],['Sensor DO',n+' '+p]],
    note:'💡 Goes HIGH when vibration detected. Adjust sensitivity with onboard potentiometer.',
    code:`#define VIB ${p.replace(/[^0-9]/g,'')}\nvoid setup() { pinMode(VIB,INPUT); }\nvoid loop() { if(digitalRead(VIB)) Serial.println("Vibration!"); }`,
  };},
  'tilt-sensor': m => { const n=mcuLabel(m),p=dpin(m,4); return {
    title:'Tilt Switch Sensor',
    rows:[['Tilt VCC',n+' 5V'],['Tilt GND',n+' GND'],['Tilt Signal',n+' '+p+' + 10kΩ pull-up to VCC']],
    note:'💡 Closes circuit when tilted. Use INPUT_PULLUP mode.',
    code:`#define TILT ${p.replace(/[^0-9]/g,'')}\nvoid setup() { pinMode(TILT,INPUT_PULLUP); }\nvoid loop() { Serial.println(digitalRead(TILT)==LOW?"Tilted":"Level"); delay(200); }`,
  };},
  'touch-sensor': m => { const n=mcuLabel(m),p=dpin(m,4); return {
    title:'Capacitive Touch Sensor TTP223',
    rows:[['Touch VCC',n+' 5V (or 3.3V)'],['Touch GND',n+' GND'],['Touch IO',n+' '+p]],
    note:'💡 Output goes HIGH when touched. No mechanical parts — very reliable.',
    code:`#define TOUCH ${p.replace(/[^0-9]/g,'')}\nvoid setup() { pinMode(TOUCH,INPUT); }\nvoid loop() { if(digitalRead(TOUCH)) { Serial.println("Touched!"); delay(200); } }`,
  };},
  'flex-sensor': m => { const n=mcuLabel(m),p=apin(m,0); return {
    title:'Flex / Bend Sensor',
    rows:[['Flex pin 1',n+' 5V'],['Flex pin 2',n+' 10kΩ to GND AND '+p]],
    note:'💡 Resistance increases when bent. Read with analogRead — flat≈10kΩ, bent≈40kΩ+.',
    code:`void loop() { int val=analogRead(A0); Serial.println(val); delay(100); }`,
  };},
  'force-sensor': m => { const n=mcuLabel(m),p=apin(m,0); return {
    title:'Force Sensitive Resistor (FSR)',
    rows:[['FSR pin 1',n+' 5V'],['FSR pin 2',n+' 10kΩ to GND AND '+p]],
    note:'💡 Resistance decreases with pressure. No force ≈ ∞Ω, max force ≈ 200Ω.',
    code:`void loop() { int f=analogRead(A0); Serial.print("Force: "); Serial.println(f); delay(100); }`,
  };},
  'fingerprint-sensor': m => { const n=mcuLabel(m); return {
    title:'Fingerprint Sensor R307/R503 (UART)',
    rows:[['Sensor VCC',n+' 3.3V or 5V (check spec)'],['Sensor GND',n+' GND'],['Sensor TX',n+' '+dpin(m,7)+' (RX)'],['Sensor RX',n+' '+dpin(m,8)+' (TX)']],
    note:'💡 Use Adafruit Fingerprint Sensor library. Baud rate: 57600.',
    code:`#include <Adafruit_Fingerprint.h>\n#include <SoftwareSerial.h>\nSoftwareSerial mySerial(${dpin(m,7).replace(/[^0-9]/g,'')},${dpin(m,8).replace(/[^0-9]/g,'')});\nAdafruit_Fingerprint finger(&mySerial);\nvoid setup() { finger.begin(57600); }`,
  };},

  // ── SENSORS — Environmental ──────────────────────────────────────────────
  'dht22': m => { const n=mcuLabel(m),p=dpin(m,4); return {
    title:'DHT22 Temperature & Humidity Sensor',
    rows:[['DHT22 VCC',n+' 5V'],['DHT22 GND',n+' GND'],['DHT22 DATA',n+' '+p+' + 4.7kΩ pull-up to VCC']],
    note:'💡 **4.7kΩ pull-up is required** — sensor fails without it.\nLibrary: DHT sensor library by Adafruit.',
    code:`#include <DHT.h>\nDHT dht(${p.replace(/[^0-9]/g,'')},DHT22);\nvoid setup() { Serial.begin(9600); dht.begin(); }\nvoid loop() { delay(2000); Serial.print("T:"); Serial.print(dht.readTemperature()); Serial.print(" H:"); Serial.println(dht.readHumidity()); }`,
  };},
  'dht11': m => { const n=mcuLabel(m),p=dpin(m,4); return {
    title:'DHT11 Temperature & Humidity Sensor',
    rows:[['DHT11 VCC',n+' 5V'],['DHT11 GND',n+' GND'],['DHT11 DATA',n+' '+p+' + 4.7kΩ pull-up']],
    note:'💡 Less accurate than DHT22. Same wiring. Change DHT22 → DHT11 in code.',
    code:`#include <DHT.h>\nDHT dht(${p.replace(/[^0-9]/g,'')},DHT11);\nvoid setup() { Serial.begin(9600); dht.begin(); }\nvoid loop() { delay(2000); Serial.println(dht.readTemperature()); }`,
  };},
  'bmp280': m => { const p=i2c(m),n=mcuLabel(m); return {
    title:'BMP280 Pressure + Temperature (I2C)',
    rows:[['BMP280 VCC',n+' 3.3V ⚠️'],['BMP280 GND',n+' GND'],['BMP280 SCL',n+' '+p.scl],['BMP280 SDA',n+' '+p.sda]],
    note:'⚠️ **3.3V only!** I2C address: 0x76 (SDO=GND) or 0x77 (SDO=3.3V).',
    code:`#include <Adafruit_BMP280.h>\nAdafruit_BMP280 bmp;\nvoid setup() { Serial.begin(9600); bmp.begin(0x76); }\nvoid loop() { Serial.print(bmp.readTemperature()); Serial.print("°C "); Serial.print(bmp.readPressure()/100); Serial.println("hPa"); delay(1000); }`,
  };},
  'bme280': m => { const p=i2c(m),n=mcuLabel(m); return {
    title:'BME280 Temperature + Humidity + Pressure (I2C)',
    rows:[['BME280 VCC',n+' 3.3V ⚠️'],['BME280 GND',n+' GND'],['BME280 SCL',n+' '+p.scl],['BME280 SDA',n+' '+p.sda]],
    note:'⚠️ 3.3V only! Combines DHT22+BMP280 in one chip. Address: 0x76 or 0x77.',
    code:`#include <Adafruit_BME280.h>\nAdafruit_BME280 bme;\nvoid setup() { Serial.begin(9600); bme.begin(0x76); }\nvoid loop() { Serial.print(bme.readTemperature()); Serial.print("°C "); Serial.print(bme.readHumidity()); Serial.println("%"); delay(1000); }`,
  };},
  'mpu6050': m => { const p=i2c(m),n=mcuLabel(m); return {
    title:'MPU6050 Gyroscope + Accelerometer (I2C)',
    rows:[['MPU6050 VCC',n+' 3.3V ⚠️ NOT 5V'],['MPU6050 GND',n+' GND'],['MPU6050 SCL',n+' '+p.scl],['MPU6050 SDA',n+' '+p.sda],['MPU6050 AD0',n+' GND (addr=0x68)'],['MPU6050 INT','Optional → '+dpin(m,5)]],
    note:'⚠️ **3.3V only! 5V will permanently damage it.**\nAddress: 0x68 (AD0=GND) or 0x69 (AD0=3.3V).',
    code:`#include <MPU6050.h>\nMPU6050 mpu;\nvoid setup() { Wire.begin(); mpu.initialize(); }\nvoid loop() { int16_t ax,ay,az,gx,gy,gz; mpu.getMotion6(&ax,&ay,&az,&gx,&gy,&gz); Serial.println(ax); delay(100); }`,
  };},
  'adxl345': m => { const p=i2c(m),n=mcuLabel(m); return {
    title:'ADXL345 Accelerometer (I2C)',
    rows:[['ADXL VCC',n+' 3.3V'],['ADXL GND',n+' GND'],['ADXL SCL',n+' '+p.scl],['ADXL SDA',n+' '+p.sda],['ADXL SDO',n+' GND (addr=0x53)']],
    note:'⚠️ 3.3V max. Address: 0x53 (SDO=GND) or 0x1D (SDO=3.3V).',
    code:`#include <Adafruit_ADXL345_U.h>\nAdafruit_ADXL345_Unified accel(12345);\nvoid setup() { accel.begin(); }\nvoid loop() { sensors_event_t e; accel.getEvent(&e); Serial.println(e.acceleration.x); delay(500); }`,
  };},
  'ldr': m => { const n=mcuLabel(m),p=apin(m,0); return {
    title:'LDR Light Sensor (Voltage Divider)',
    rows:[['LDR leg 1',n+' 5V'],['LDR leg 2',n+' '+p+' AND 10kΩ to GND']],
    note:'💡 Bright = low resistance = high voltage. Dark = high resistance = low voltage.\nIn bright light: analogRead ≈ 900+. In dark: ≈ 50.',
    code:`void setup() { Serial.begin(9600); }\nvoid loop() { Serial.println(analogRead(A0)); delay(200); }`,
  };},
  'soil-moisture': m => { const n=mcuLabel(m),ao=apin(m,1),dout=dpin(m,4); return {
    title:'Soil Moisture Sensor',
    rows:[['Sensor VCC',n+' 5V'],['Sensor GND',n+' GND'],['Sensor AO',n+' '+ao],['Sensor DO',n+' '+dout]],
    note:'💡 Wet soil = lower analogRead value. Calibrate THRESHOLD by reading dry and wet soil.',
    code:`#define THRESHOLD 600\nvoid setup() { Serial.begin(9600); }\nvoid loop() { int m=analogRead(A1); Serial.println(m<THRESHOLD?"Wet":"Dry"); delay(1000); }`,
  };},
  'mq2-gas': m => { const n=mcuLabel(m),ao=apin(m,2),dout=dpin(m,4); return {
    title:'MQ-2 Gas / Smoke Sensor',
    rows:[['MQ-2 VCC',n+' 5V'],['MQ-2 GND',n+' GND'],['MQ-2 AO',n+' '+ao],['MQ-2 DO',n+' '+dout]],
    note:'⚠️ **30 second warm-up** required. Detects: LPG, propane, smoke, alcohol, hydrogen.',
    code:`void setup() { Serial.begin(9600); delay(30000); }\nvoid loop() { int g=analogRead(A2); if(g>400) Serial.println("Gas detected!"); delay(500); }`,
  };},
  'mq135-air': m => { const n=mcuLabel(m),ao=apin(m,2); return {
    title:'MQ-135 Air Quality / CO2 Sensor',
    rows:[['MQ-135 VCC',n+' 5V'],['MQ-135 GND',n+' GND'],['MQ-135 AO',n+' '+ao],['MQ-135 DO',n+' '+dpin(m,4)]],
    note:'⚠️ 30 second warm-up. Detects CO2, NH3, NOx. Use MQ135 library for ppm values.',
    code:`#include <MQ135.h>\nMQ135 gasSensor(A2);\nvoid loop() { float ppm=gasSensor.getPPM(); Serial.print("CO2: "); Serial.println(ppm); delay(1000); }`,
  };},
  'water-level': m => { const n=mcuLabel(m),p=apin(m,3); return {
    title:'Water Level Sensor',
    rows:[['Sensor VCC',n+' 5V'],['Sensor GND',n+' GND'],['Sensor SIG',n+' '+p]],
    note:'💡 Analog value increases with water coverage. Higher = more water.',
    code:`void loop() { int w=analogRead(A3); Serial.println(w<300?"Empty":w<700?"Half":"Full"); delay(500); }`,
  };},
  'flame-sensor': m => { const n=mcuLabel(m),p=apin(m,2),d=dpin(m,4); return {
    title:'Flame Detector Sensor',
    rows:[['Flame VCC',n+' 5V'],['Flame GND',n+' GND'],['Flame AO',n+' '+p],['Flame DO',n+' '+d]],
    note:'⚠️ Detects IR from flames at 760–1100nm. DO goes LOW when flame detected.',
    code:`#define FLAME_DO ${d.replace(/[^0-9]/g,'')}\nvoid setup() { pinMode(FLAME_DO,INPUT); }\nvoid loop() { if(!digitalRead(FLAME_DO)) Serial.println("FIRE!"); delay(200); }`,
  };},
  'rain-sensor': m => { const n=mcuLabel(m),ao=apin(m,3),d=dpin(m,4); return {
    title:'Rain / Water Detection Sensor',
    rows:[['Rain VCC',n+' 5V'],['Rain GND',n+' GND'],['Rain AO',n+' '+ao],['Rain DO',n+' '+d]],
    note:'💡 AO decreases as water increases on probe. DO = LOW when raining (adjustable).',
    code:`void loop() { int r=analogRead(A3); Serial.println(r>800?"Dry":r>400?"Light rain":"Heavy rain"); delay(500); }`,
  };},
  'sound-sensor': m => { const n=mcuLabel(m),ao=apin(m,2),d=dpin(m,4); return {
    title:'Sound / Microphone Sensor Module',
    rows:[['Sound VCC',n+' 5V'],['Sound GND',n+' GND'],['Sound AO',n+' '+ao],['Sound DO',n+' '+d]],
    note:'💡 AO = analog sound level, DO = HIGH when sound exceeds threshold (adjustable pot).',
    code:`void loop() { if(digitalRead(${d.replace(/[^0-9]/g,'')})) { Serial.println("Sound!"); delay(200); } }`,
  };},
  'uv-sensor': m => { const n=mcuLabel(m),p=apin(m,2); return {
    title:'UV Sensor ML8511',
    rows:[['UV VCC',n+' 3.3V'],['UV GND',n+' GND'],['UV OUT',n+' '+p],['UV EN',n+' 3.3V (enable)']],
    note:'💡 Output voltage proportional to UV intensity. 1.0V = 0 mW/cm², 2.8V = 15 mW/cm².',
    code:`void loop() { float v=analogRead(A2)*3.3/1023.0; float uv=map(v*1000,1000,2800,0,150)/10.0; Serial.println(uv); delay(1000); }`,
  };},
  'acs712': m => { const n=mcuLabel(m),p=apin(m,0); return {
    title:'ACS712 Current Sensor',
    rows:[['ACS712 VCC',n+' 5V'],['ACS712 GND',n+' GND'],['ACS712 OUT',n+' '+p],['IP+ / IP−','In series with load current path']],
    note:'💡 Variants: 5A (185mV/A), 20A (100mV/A), 30A (66mV/A). Zero current = VCC/2.',
    code:`void loop() { int raw=analogRead(A0); float v=raw*(5.0/1023); float amps=(v-2.5)/0.185; Serial.println(amps); delay(500); }`,
  };},
  'hx711': m => { const n=mcuLabel(m),dout=dpin(m,4),clk=dpin(m,5); return {
    title:'HX711 Load Cell Amplifier',
    rows:[['HX711 VCC',n+' 5V'],['HX711 GND',n+' GND'],['HX711 DOUT',n+' '+dout],['HX711 CLK',n+' '+clk],['HX711 E+',`Load cell excitation (+)`],['HX711 E−',`Load cell excitation (−)`],['HX711 A+',`Load cell signal A (+)`],['HX711 A−',`Load cell signal A (−)`]],
    note:'💡 Use HX711 library by bogde. Run calibration sketch with known weight first.',
    code:`#include <HX711.h>\nHX711 scale;\nvoid setup() { scale.begin(${dout.replace(/[^0-9]/g,'')},${clk.replace(/[^0-9]/g,'')}); scale.set_scale(2280); scale.tare(); }\nvoid loop() { Serial.println(scale.get_units()); delay(500); }`,
  };},
  'max30102': m => { const p=i2c(m),n=mcuLabel(m); return {
    title:'MAX30102 Heart Rate + SpO2 Sensor (I2C)',
    rows:[['MAX30102 VIN',n+' 3.3V'],['MAX30102 GND',n+' GND'],['MAX30102 SCL',n+' '+p.scl],['MAX30102 SDA',n+' '+p.sda],['MAX30102 INT',n+' '+dpin(m,5)+' (optional)']],
    note:'💡 Place finger gently on sensor. Use SparkFun MAX3010x library.',
    code:`#include <Wire.h>\n#include "MAX30105.h"\nMAX30105 particleSensor;\nvoid setup() { Wire.begin(); particleSensor.begin(Wire,I2C_SPEED_FAST); particleSensor.setup(); }\nvoid loop() { Serial.println(particleSensor.getIR()); delay(100); }`,
  };},
  'tcs3200': m => { const n=mcuLabel(m); return {
    title:'TCS3200 Color Sensor',
    rows:[['TCS3200 VCC',n+' 5V'],['TCS3200 GND',n+' GND'],['TCS3200 S0',n+' '+dpin(m,0)+' (freq scale)'],['TCS3200 S1',n+' '+dpin(m,1)],['TCS3200 S2',n+' '+dpin(m,2)+' (filter)'],['TCS3200 S3',n+' '+dpin(m,3)],['TCS3200 OUT',n+' '+dpin(m,4)]],
    note:'💡 S0/S1 set output frequency scaling. S2/S3 select R/G/B/Clear filter.',
    code:`#define S0 4\n#define S1 5\n#define S2 6\n#define S3 7\n#define OUT 8\nvoid setup() { pinMode(S0,OUTPUT);pinMode(S1,OUTPUT);pinMode(S2,OUTPUT);pinMode(S3,OUTPUT);pinMode(OUT,INPUT); digitalWrite(S0,HIGH);digitalWrite(S1,LOW); }`,
  };},
  'ds18b20': m => { const n=mcuLabel(m),p=dpin(m,4); return {
    title:'DS18B20 Waterproof Temperature Sensor (OneWire)',
    rows:[['DS18B20 Red (VCC)',n+' 5V'],['DS18B20 Black (GND)',n+' GND'],['DS18B20 Yellow (DQ)',n+' '+p+' + 4.7kΩ pull-up to 5V']],
    note:'💡 Multiple DS18B20s can share the SAME data wire — each has a unique address.\nLibraries needed: OneWire + DallasTemperature.',
    code:`#include <OneWire.h>\n#include <DallasTemperature.h>\nOneWire ow(${p.replace(/[^0-9]/g,'')});\nDallasTemperature sensors(&ow);\nvoid setup() { Serial.begin(9600); sensors.begin(); }\nvoid loop() { sensors.requestTemperatures(); Serial.println(sensors.getTempCByIndex(0)); delay(1000); }`,
  };},
  'thermistor-ntc': m => { const n=mcuLabel(m),p=apin(m,0); return {
    title:'NTC Thermistor (Temperature)',
    rows:[['Thermistor leg 1',n+' 5V'],['Thermistor leg 2',n+' '+p+' AND 10kΩ to GND']],
    note:'💡 Resistance decreases with temperature (NTC). Use Steinhart-Hart equation for accuracy.',
    code:`void loop() { int r=analogRead(A0); float t=1.0/(1.0/298.15+log(10000.0*r/(1023-r)/10000.0)/3950.0)-273.15; Serial.println(t); delay(1000); }`,
  };},
  'voltage-sensor': m => { const n=mcuLabel(m),p=apin(m,1); return {
    title:'Voltage Sensor Module (0–25V)',
    rows:[['Module VCC',n+' 5V'],['Module GND',n+' GND'],['Module S (signal)',n+' '+p]],
    note:'💡 Divides input voltage by ~5. To get real voltage: V = analogRead/1023*5*5.',
    code:`void loop() { float v=analogRead(A1)*(5.0/1023)*5.0; Serial.print("Voltage: "); Serial.print(v); Serial.println("V"); delay(500); }`,
  };},

  // ── MOTOR DRIVERS ────────────────────────────────────────────────────────
  'l298n': m => { const n=mcuLabel(m),ena=pwmPin(m,0),enb=pwmPin(m,1),in1=dpin(m,0),in2=dpin(m,1),in3=dpin(m,2),in4=dpin(m,3); return {
    title:'L298N Motor Driver',
    rows:[['Battery (+)','L298N 12V / VIN'],['Battery (−)','L298N GND'],['L298N GND',n+' GND ← common ground!'],['L298N ENA',n+' '+ena+' (PWM/jumper)'],['L298N IN1',n+' '+in1],['L298N IN2',n+' '+in2],['L298N ENB',n+' '+enb+' (PWM/jumper)'],['L298N IN3',n+' '+in3],['L298N IN4',n+' '+in4],['L298N OUT1','Motor A (+)'],['L298N OUT2','Motor A (−)'],['L298N OUT3','Motor B (+)'],['L298N OUT4','Motor B (−)']],
    note:'💡 Leave ENA/ENB jumpers ON for full speed. Remove for PWM speed control.\n⚠️ Common GND is mandatory!',
    code:`#define IN1 ${in1.replace(/[^0-9]/g,'')} \n#define IN2 ${in2.replace(/[^0-9]/g,'')} \n#define IN3 ${in3.replace(/[^0-9]/g,'')} \n#define IN4 ${in4.replace(/[^0-9]/g,'')}\nvoid forward()  { digitalWrite(IN1,H);digitalWrite(IN2,L);digitalWrite(IN3,H);digitalWrite(IN4,L); }\nvoid backward() { digitalWrite(IN1,L);digitalWrite(IN2,H);digitalWrite(IN3,L);digitalWrite(IN4,H); }\nvoid stopAll()  { digitalWrite(IN1,L);digitalWrite(IN2,L);digitalWrite(IN3,L);digitalWrite(IN4,L); }`,
  };},
  'l293d': m => { const n=mcuLabel(m),en1=pwmPin(m,0),in1=dpin(m,0),in2=dpin(m,1),en2=pwmPin(m,1),in3=dpin(m,2),in4=dpin(m,3); return {
    title:'L293D Dual H-Bridge Driver',
    rows:[['L293D VCC1 (pin 16)',n+' 5V (IC power)'],['L293D VCC2 (pin 8)','Motor power 4.5–36V'],['All GND (pins 4,5,12,13)',n+' GND'],['L293D EN1 (pin 1)',n+' '+en1],['L293D IN1 (pin 2)',n+' '+in1],['L293D IN2 (pin 7)',n+' '+in2],['L293D EN2 (pin 9)',n+' '+en2],['L293D IN3 (pin 10)',n+' '+in3],['L293D IN4 (pin 15)',n+' '+in4],['L293D OUT1/OUT2','Motor A'],['L293D OUT3/OUT4','Motor B']],
    note:'💡 Same logic as L298N but comes in DIP IC. Max 600mA per channel.',
    code:`// Same as L298N code — control IN1–IN4 and EN1/EN2`,
  };},
  'a4988': m => { const n=mcuLabel(m),step=dpin(m,0),dir=dpin(m,1),en=dpin(m,2); return {
    title:'A4988 Stepper Motor Driver',
    rows:[['A4988 VDD',n+' 5V'],['A4988 GND (logic)',n+' GND'],['A4988 VMOT','Motor supply 8–35V'],['A4988 GND (motor)','Motor power GND'],['A4988 STEP',n+' '+step],['A4988 DIR',n+' '+dir],['A4988 EN',n+' '+en+' (LOW=enabled)'],['A4988 RST',n+' 5V (or connect to SLP)'],['A4988 SLP',n+' 5V'],['A4988 1A,1B,2A,2B','Stepper motor coils (check order)']],
    note:'⚠️ Set current limit before powering motor (Vref = I × 8 × Rsense).\n⚠️ Add 100µF capacitor between VMOT and GND close to driver.',
    code:`#define STEP ${step.replace(/[^0-9]/g,'')}\n#define DIR ${dir.replace(/[^0-9]/g,'')}\nvoid setup() { pinMode(STEP,OUTPUT); pinMode(DIR,OUTPUT); digitalWrite(DIR,HIGH); }\nvoid loop() { digitalWrite(STEP,HIGH); delayMicroseconds(1000); digitalWrite(STEP,LOW); delayMicroseconds(1000); }`,
  };},
  'drv8825': m => { const d=WIRING['a4988'](m); d.title='DRV8825 Stepper Motor Driver'; d.note='Same pinout as A4988 but supports up to 32 microstepping and 2.2A per channel.\n'+d.note; return d; },
  'tb6612fng': m => { const n=mcuLabel(m); return {
    title:'TB6612FNG Dual Motor Driver',
    rows:[['VCC',n+' 3.3V or 5V (logic)'],['VMOT','Motor supply 2.7–13.5V'],['GND',n+' GND'],['AIN1',n+' '+dpin(m,0)],['AIN2',n+' '+dpin(m,1)],['PWMA',n+' '+pwmPin(m,0)],['BIN1',n+' '+dpin(m,2)],['BIN2',n+' '+dpin(m,3)],['PWMB',n+' '+pwmPin(m,1)],['STBY',n+' 3.3V (standby disable)'],['AO1,AO2','Motor A'],['BO1,BO2','Motor B']],
    note:'💡 Better than L298N — no voltage drop, 3.3V compatible. Max 1.2A per channel.',
    code:`// Control via AIN1/AIN2 + PWMA like L298N`,
  };},
  'uln2003': m => { const n=mcuLabel(m),in1=dpin(m,0),in2=dpin(m,1),in3=dpin(m,2),in4=dpin(m,3); return {
    title:'ULN2003 Stepper Driver (28BYJ-48)',
    rows:[['ULN2003 VCC',n+' 5V'],['ULN2003 GND',n+' GND'],['ULN2003 IN1',n+' '+in1],['ULN2003 IN2',n+' '+in2],['ULN2003 IN3',n+' '+in3],['ULN2003 IN4',n+' '+in4],['Motor connector','28BYJ-48 motor plug']],
    note:'💡 Use the ready-made ULN2003 board that plugs directly into 28BYJ-48. Use Stepper or AccelStepper library.',
    code:`#include <Stepper.h>\nStepper motor(2048,${in1.replace(/[^0-9]/g,'')},${in3.replace(/[^0-9]/g,'')},${in2.replace(/[^0-9]/g,'')},${in4.replace(/[^0-9]/g,'')});\nvoid setup() { motor.setSpeed(15); }\nvoid loop() { motor.step(2048); delay(500); motor.step(-2048); delay(500); }`,
  };},

  // ── MOTORS / ACTUATORS ───────────────────────────────────────────────────
  'dc-motor-3v': m => { return {
    title:'DC Motor (directly with transistor)',
    rows:[['Transistor Base','1kΩ → MCU '+dpin(m,0)],['Transistor Collector','Motor (−)'],['Motor (+)','5V or battery'],['Transistor Emitter','GND'],['Diode across motor','Flyback protection (1N4007)']],
    note:'⚠️ Never drive a motor directly from an Arduino pin — use a transistor (TIP120, 2N2222) or motor driver!\nUse L298N or L293D for easy H-bridge control.',
    code:`#define MOTOR_PIN ${dpin(m,0).replace(/[^0-9]/g,'')}\nvoid setup() { pinMode(MOTOR_PIN,OUTPUT); }\nvoid loop() { analogWrite(MOTOR_PIN,200); delay(2000); analogWrite(MOTOR_PIN,0); delay(1000); }`,
  };},
  'dc-motor-6v': m => WIRING['dc-motor-3v'](m),
  'dc-motor-12v': m => WIRING['dc-motor-3v'](m),
  'servo-sg90': m => { const n=mcuLabel(m),sig=pwmPin(m,2); return {
    title:'SG90 Servo Motor',
    rows:[['Servo Red (VCC)',n+' 5V'],['Servo Brown/Black (GND)',n+' GND'],['Servo Orange (SIGNAL)',n+' '+sig+' (PWM)']],
    note:'⚠️ For 2+ servos: use external 5V power supply for VCC, share GND with Arduino.\n💡 Servo.write(0–180) controls angle.',
    code:`#include <Servo.h>\nServo myServo;\nvoid setup() { myServo.attach(${sig.replace(/[^0-9]/g,'')}); }\nvoid loop() { myServo.write(0); delay(1000); myServo.write(90); delay(1000); myServo.write(180); delay(1000); }`,
  };},
  'servo-mg996r': m => { const d=WIRING['servo-sg90'](m); d.title='MG996R High-Torque Servo'; d.note='⚠️ Draws up to 1A — always use external 5V/2A supply for motor power.\n'+d.note; return d; },
  'stepper-28byj48': m => WIRING['uln2003'](m),
  'stepper-nema17': m => WIRING['a4988'](m),
  'linear-actuator': m => { return {
    title:'Linear Actuator',
    rows:[['Actuator (+)','Motor driver OUT1 or relay NO'],['Actuator (−)','Motor driver OUT2 or relay COM'],['Control','Use L298N or relay module for direction/stop']],
    note:'💡 Use an H-bridge (L298N) to extend and retract. Use a relay if only one direction needed.',
    code:`// Use L298N wiring — same as DC motor direction control`,
  };},
  'solenoid-5v': m => { const n=mcuLabel(m),p=dpin(m,4); return {
    title:'5V Solenoid / Electromagnet',
    rows:[['TIP120 Base','1kΩ → '+n+' '+p],['TIP120 Collector','Solenoid (−)'],['Solenoid (+)','5V'],['TIP120 Emitter',n+' GND'],['Flyback diode (1N4007)','Across solenoid, cathode to +']],
    note:'⚠️ Use a transistor or relay — never directly from MCU pin!\n1N4007 diode protects against back-EMF.',
    code:`#define SOL ${p.replace(/[^0-9]/g,'')}\nvoid setup() { pinMode(SOL,OUTPUT); }\nvoid loop() { digitalWrite(SOL,HIGH); delay(500); digitalWrite(SOL,LOW); delay(2000); }`,
  };},
  'solenoid-12v': m => { const d=WIRING['solenoid-5v'](m); d.title='12V Solenoid'; d.rows[2][1]='12V supply (NOT 5V!)'; return d; },
  'water-pump': m => { const n=mcuLabel(m); return {
    title:'Mini Water Pump',
    rows:[['Relay NO','Pump VCC (+)'],['Relay COM','Power supply (+)'],['Pump (−)','Power supply GND'],['Relay control','See relay module wiring above']],
    note:'💡 Use a relay module to switch the pump on/off. Arduino pin → relay IN → relay switches pump power.\n⚠️ Never power the pump directly from Arduino 5V pin.',
    code:`// Control via relay — same as relay module code`,
  };},
  'fan-5v': m => { const d=WIRING['dc-motor-3v'](m); d.title='5V Cooling Fan'; return d; },
  'vibration-motor': m => { const n=mcuLabel(m),p=dpin(m,5); return {
    title:'Vibration Motor (Haptic)',
    rows:[['Transistor Base','1kΩ → '+n+' '+p],['Transistor Collector','Motor (−)'],['Motor (+)','3.3V or 5V'],['Transistor Emitter',n+' GND']],
    note:'💡 Use a TIP120 or 2N2222 transistor. Add flyback diode for protection.',
    code:`#define VIB ${p.replace(/[^0-9]/g,'')}\nvoid setup() { pinMode(VIB,OUTPUT); }\nvoid loop() { digitalWrite(VIB,HIGH); delay(200); digitalWrite(VIB,LOW); delay(800); }`,
  };},

  // ── 4WD CHASSIS ─────────────────────────────────────────────────────────
  '4wd-car-chassis': m => { const n=mcuLabel(m),ena=pwmPin(m,0),enb=pwmPin(m,1),in1=dpin(m,0),in2=dpin(m,1),in3=dpin(m,2),in4=dpin(m,3); return {
    title:'4WD Robot Car Chassis + L298N',
    rows:[['Battery (+)','L298N VIN (12V)'],['Battery (−)','L298N GND'],['L298N GND',n+' GND ← critical!'],['L298N ENA',n+' '+ena+' (PWM or jumper)'],['L298N IN1',n+' '+in1+' (left fwd)'],['L298N IN2',n+' '+in2+' (left bwd)'],['L298N ENB',n+' '+enb+' (PWM or jumper)'],['L298N IN3',n+' '+in3+' (right fwd)'],['L298N IN4',n+' '+in4+' (right bwd)'],['L298N OUT1','Chassis M1+ (Front-Left)'],['L298N OUT2','Chassis M1− (Front-Left)'],['L298N OUT3','Chassis M2+ (Front-Right)'],['L298N OUT4','Chassis M2− (Front-Right)'],['Chassis M3+','Parallel with OUT1 (Rear-Left)'],['Chassis M3−','Parallel with OUT2'],['Chassis M4+','Parallel with OUT3 (Rear-Right)'],['Chassis M4−','Parallel with OUT4']],
    note:'💡 Rear motors connect **in parallel** with front motors — same wires.\n⚠️ Use 7.4V 18650 Li-Ion battery for best power.',
    code:`#define IN1 ${in1.replace(/[^0-9]/g,'')} \n#define IN2 ${in2.replace(/[^0-9]/g,'')} \n#define IN3 ${in3.replace(/[^0-9]/g,'')} \n#define IN4 ${in4.replace(/[^0-9]/g,'')}\nvoid setup() { pinMode(IN1,OUTPUT);pinMode(IN2,OUTPUT);pinMode(IN3,OUTPUT);pinMode(IN4,OUTPUT); analogWrite(${ena.replace(/[^0-9]/g,'')},200); analogWrite(${enb.replace(/[^0-9]/g,'')},200); }\nvoid forward()  { digitalWrite(IN1,H);digitalWrite(IN2,L);digitalWrite(IN3,H);digitalWrite(IN4,L); }\nvoid turnLeft() { digitalWrite(IN1,L);digitalWrite(IN2,H);digitalWrite(IN3,H);digitalWrite(IN4,L); }`,
  };},

  // ── RELAYS / SOUND ───────────────────────────────────────────────────────
  'relay-module': m => { const n=mcuLabel(m),p=dpin(m,5); return {
    title:'Relay Module (Single Channel)',
    rows:[['Relay VCC',n+' 5V'],['Relay GND',n+' GND'],['Relay IN',n+' '+p],['Relay COM','Load line 1 (common)'],['Relay NO','Load line 2 (connected when ON)'],['Relay NC','Connected when OFF (optional)']],
    note:'⚠️ Most relay modules are **active-LOW**: LOW = ON, HIGH = OFF.\n⚠️ For mains voltage — be VERY careful!',
    code:`#define RELAY ${p.replace(/[^0-9]/g,'')}\nvoid setup() { pinMode(RELAY,OUTPUT); digitalWrite(RELAY,HIGH); }\nvoid loop() { digitalWrite(RELAY,LOW); delay(5000); digitalWrite(RELAY,HIGH); delay(5000); }`,
  };},
  'relay-4ch': m => { const n=mcuLabel(m),p1=dpin(m,0),p2=dpin(m,1),p3=dpin(m,2),p4=dpin(m,3); return {
    title:'4-Channel Relay Module',
    rows:[['VCC',n+' 5V'],['GND',n+' GND'],['IN1',n+' '+p1],['IN2',n+' '+p2],['IN3',n+' '+p3],['IN4',n+' '+p4],['COM/NO/NC (per channel)','Connect load to each channel']],
    note:'💡 Same as single relay × 4. Each IN controls one relay independently.',
    code:`int relays[] = {${p1.replace(/[^0-9]/g,'')},${p2.replace(/[^0-9]/g,'')},${p3.replace(/[^0-9]/g,'')},${p4.replace(/[^0-9]/g,'')}};\nvoid setup() { for(int r:relays) { pinMode(r,OUTPUT); digitalWrite(r,HIGH); } }`,
  };},
  'relay-8ch': m => { const d=WIRING['relay-4ch'](m); d.title='8-Channel Relay Module'; d.note='Same wiring as 4-channel, extended to 8 control pins. '+d.note; return d; },
  'buzzer-active': m => { const n=mcuLabel(m),p=dpin(m,5); return {
    title:'Active Buzzer',
    rows:[['Buzzer + ',n+' '+p],['Buzzer − ',n+' GND']],
    note:'💡 Makes a fixed tone when HIGH. Simple on/off control.',
    code:`#define BUZZ ${p.replace(/[^0-9]/g,'')}\nvoid setup() { pinMode(BUZZ,OUTPUT); }\nvoid loop() { digitalWrite(BUZZ,HIGH); delay(500); digitalWrite(BUZZ,LOW); delay(500); }`,
  };},
  'buzzer-passive': m => { const n=mcuLabel(m),p=pwmPin(m,2); return {
    title:'Passive Buzzer (Piezo)',
    rows:[['Buzzer +',n+' '+p+' (PWM pin)'],['Buzzer −',n+' GND']],
    note:'💡 Use tone(pin, frequency) to play different notes. Great for music!',
    code:`#define BUZZ ${p.replace(/[^0-9]/g,'')}\nvoid setup() { }\nvoid loop() { tone(BUZZ,440); delay(500); tone(BUZZ,880); delay(500); noTone(BUZZ); delay(500); }`,
  };},
  'speaker-8ohm': m => { const n=mcuLabel(m),p=pwmPin(m,2); return {
    title:'8Ω Speaker (via PAM8403 Amplifier)',
    rows:[['PAM8403 VCC',n+' 5V'],['PAM8403 GND',n+' GND'],['PAM8403 L_IN',n+' '+p],['PAM8403 L_OUT+','Speaker (+)'],['PAM8403 L_OUT−','Speaker (−)']],
    note:'💡 Use PAM8403 for better volume. For simple tones, connect via 100Ω directly to PWM pin.',
    code:`// For music: use DFPlayer Mini + PAM8403\n// For simple tones: tone(pin, frequency, duration)`,
  };},
  'pam8403': m => WIRING['speaker-8ohm'](m),

  // ── WIRELESS ────────────────────────────────────────────────────────────
  'bluetooth-hc05': m => { const n=mcuLabel(m); return {
    title:'HC-05 Bluetooth Module (UART)',
    rows:[['HC-05 VCC',n+' 5V'],['HC-05 GND',n+' GND'],['HC-05 TX',n+' '+dpin(m,7)+' (as RX)'],['HC-05 RX',n+' '+dpin(m,8)+' (TX) via 1kΩ+2kΩ divider ⚠️']],
    note:'⚠️ HC-05 RX is 3.3V — Arduino TX sends 5V → use voltage divider!\nDefault baud: 9600. Pair code: **1234** or **0000**.',
    code:`#include <SoftwareSerial.h>\nSoftwareSerial bt(${dpin(m,7).replace(/[^0-9]/g,'')},${dpin(m,8).replace(/[^0-9]/g,'')});\nvoid setup() { Serial.begin(9600); bt.begin(9600); }\nvoid loop() { if(bt.available()) { char c=bt.read(); if(c=='1') digitalWrite(13,HIGH); if(c=='0') digitalWrite(13,LOW); } }`,
  };},
  'bluetooth-hc06': m => { const d=WIRING['bluetooth-hc05'](m); d.title='HC-06 Bluetooth Module (Slave Only)'; d.note='Similar to HC-05 but slave mode only. Same wiring.\n'+d.note; return d; },
  'nrf24l01': m => { const sp=spi(m),n=mcuLabel(m),ce=dpin(m,6),csn=dpin(m,7); return {
    title:'nRF24L01 2.4GHz RF Module (SPI)',
    rows:[['nRF24 VCC',n+' 3.3V ⚠️ NOT 5V'],['nRF24 GND',n+' GND'],['nRF24 CE',n+' '+ce],['nRF24 CSN',n+' '+csn],['nRF24 SCK',n+' '+sp.sck],['nRF24 MOSI',n+' '+sp.mosi],['nRF24 MISO',n+' '+sp.miso],['nRF24 IRQ','Optional → '+dpin(m,8)]],
    note:'⚠️ **3.3V only!** Add 10µF + 100nF capacitor between VCC and GND to stabilize power.\n💡 Use RF24 library by TMRh20.',
    code:`#include <RF24.h>\nRF24 radio(${ce.replace(/[^0-9]/g,'')},${csn.replace(/[^0-9]/g,'')});\nvoid setup() { radio.begin(); radio.openWritingPipe(0xF0F0F0F0E1LL); radio.setPALevel(RF24_PA_LOW); }`,
  };},
  'lora-sx1278': m => { const sp=spi(m),n=mcuLabel(m); return {
    title:'LoRa SX1278 RF Module (SPI)',
    rows:[['LoRa VCC',n+' 3.3V'],['LoRa GND',n+' GND'],['LoRa SCK',n+' '+sp.sck],['LoRa MOSI',n+' '+sp.mosi],['LoRa MISO',n+' '+sp.miso],['LoRa NSS/CS',n+' '+sp.cs],['LoRa RST',n+' '+dpin(m,4)],['LoRa DIO0',n+' '+dpin(m,5)]],
    note:'💡 Use LoRa library by Sandeep Mistry. Range: up to 10km line-of-sight.',
    code:`#include <LoRa.h>\nvoid setup() { LoRa.begin(433E6); LoRa.setPins(${sp.cs.replace(/[^0-9]/g,'')},${dpin(m,4).replace(/[^0-9]/g,'')},${dpin(m,5).replace(/[^0-9]/g,'')}); }\nvoid loop() { LoRa.beginPacket(); LoRa.print("Hello!"); LoRa.endPacket(); delay(5000); }`,
  };},
  'gsm-sim800l': m => { const n=mcuLabel(m),tx=dpin(m,7),rx=dpin(m,8); return {
    title:'GSM SIM800L Module (UART)',
    rows:[['SIM800L VCC','3.4–4.4V Li-Ion (NOT 5V or 3.3V from regulator!)'],['SIM800L GND',n+' GND'],['SIM800L TX',n+' '+tx+' (as RX)'],['SIM800L RX',n+' '+rx+' (via 1kΩ+2kΩ divider)']],
    note:'⚠️ SIM800L needs **3.4–4.4V** at up to 2A — use a 18650 Li-Ion battery directly!\nA power supply blink = power issue. Use large capacitor (1000µF).',
    code:`#include <SoftwareSerial.h>\nSoftwareSerial gsm(${tx.replace(/[^0-9]/g,'')},${rx.replace(/[^0-9]/g,'')});\nvoid setup() { gsm.begin(9600); gsm.println("AT"); delay(1000); gsm.println("AT+CMGF=1"); delay(1000); gsm.println("AT+CMGS=\\"+1234567890\\""); delay(1000); gsm.println("Hello!"); gsm.write(26); }`,
  };},
  'gps-neo6m': m => { const n=mcuLabel(m),tx=dpin(m,7),rx=dpin(m,8); return {
    title:'GPS Module Neo-6M (UART)',
    rows:[['GPS VCC',n+' 5V'],['GPS GND',n+' GND'],['GPS TX',n+' '+tx+' (as RX)'],['GPS RX',n+' '+rx+' (TX, 3.3V-safe)']],
    note:'💡 Wait 30–60 seconds for first fix. Best outdoors or near window.\nUse TinyGPS++ library for parsing NMEA data.',
    code:`#include <TinyGPSPlus.h>\n#include <SoftwareSerial.h>\nSoftwareSerial ss(${tx.replace(/[^0-9]/g,'')},${rx.replace(/[^0-9]/g,'')});\nTinyGPSPlus gps;\nvoid setup() { Serial.begin(9600); ss.begin(9600); }\nvoid loop() { while(ss.available()>0) gps.encode(ss.read()); Serial.print(gps.location.lat()); Serial.print(","); Serial.println(gps.location.lng()); }`,
  };},
  'rfid-rc522': m => { const sp=spi(m),n=mcuLabel(m),rst=dpin(m,4); return {
    title:'RFID Reader RC522 (SPI)',
    rows:[['RC522 VCC',n+' 3.3V ⚠️'],['RC522 GND',n+' GND'],['RC522 SCK',n+' '+sp.sck],['RC522 MOSI',n+' '+sp.mosi],['RC522 MISO',n+' '+sp.miso],['RC522 SDA/SS',n+' '+sp.cs],['RC522 RST',n+' '+rst],['RC522 IRQ','Not connected']],
    note:'⚠️ **3.3V only!** Use MFRC522 library. Read UIDs from RFID cards and tags.',
    code:`#include <MFRC522.h>\nMFRC522 rfid(${sp.cs.replace(/[^0-9]/g,'')},${rst.replace(/[^0-9]/g,'')});\nvoid setup() { SPI.begin(); rfid.PCD_Init(); }\nvoid loop() { if(rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) { for(int i=0;i<rfid.uid.size;i++) Serial.print(rfid.uid.uidByte[i],HEX); Serial.println(); } }`,
  };},
  'ir-transmitter': m => { const n=mcuLabel(m),p=pwmPin(m,0); return {
    title:'IR Transmitter LED',
    rows:[['IR LED Anode','100Ω resistor → '+n+' '+p],['IR LED Cathode',n+' GND']],
    note:'💡 Use IRremote library to send TV remote codes at 38kHz. Pair with IR Receiver.',
    code:`#include <IRremote.h>\n#define IR_SEND_PIN ${p.replace(/[^0-9]/g,'')}\nIRsend irsend;\nvoid loop() { irsend.sendNEC(0xFFA25D,32); delay(1000); }`,
  };},
  'rs485-module': m => { const n=mcuLabel(m),tx=dpin(m,7),rx=dpin(m,8),de=dpin(m,9); return {
    title:'RS485 Module (MAX485)',
    rows:[['MAX485 VCC',n+' 5V'],['MAX485 GND',n+' GND'],['MAX485 DI',n+' TX ('+tx+')'],['MAX485 RO',n+' RX ('+rx+')'],['MAX485 DE',n+' '+de+' (transmit enable)'],['MAX485 RE',n+' '+de+' (same as DE)'],['MAX485 A+','RS485 bus A'],['MAX485 B−','RS485 bus B']],
    note:'💡 RS485 is for long-distance multi-device communication (Modbus). Pull DE/RE to HIGH when transmitting, LOW when receiving.',
    code:`#define DE_RE ${de.replace(/[^0-9]/g,'')}\n#include <SoftwareSerial.h>\nSoftwareSerial rs485(${rx.replace(/[^0-9]/g,'')},${tx.replace(/[^0-9]/g,'')});\nvoid sendData(String msg) { digitalWrite(DE_RE,HIGH); rs485.print(msg); delay(10); digitalWrite(DE_RE,LOW); }`,
  };},
  'can-mcp2515': m => { const sp=spi(m),n=mcuLabel(m),int_pin=dpin(m,6); return {
    title:'CAN Bus Module MCP2515 (SPI)',
    rows:[['MCP2515 VCC',n+' 5V'],['MCP2515 GND',n+' GND'],['MCP2515 SCK',n+' '+sp.sck],['MCP2515 SI/MOSI',n+' '+sp.mosi],['MCP2515 SO/MISO',n+' '+sp.miso],['MCP2515 CS',n+' '+sp.cs],['MCP2515 INT',n+' '+int_pin],['CANH','CAN bus High wire'],['CANL','CAN bus Low wire']],
    note:'💡 Use mcp2515 library by autowp. CAN bus for automotive/industrial comms.',
    code:`#include <mcp2515.h>\nMCP2515 mcp(${sp.cs.replace(/[^0-9]/g,'')});\nvoid setup() { SPI.begin(); mcp.reset(); mcp.setBitrate(CAN_500KBPS); mcp.setNormalMode(); }`,
  };},
  'ethernet-w5500': m => { const sp=spi(m),n=mcuLabel(m); return {
    title:'Ethernet Module W5500 (SPI)',
    rows:[['W5500 VCC',n+' 3.3V'],['W5500 GND',n+' GND'],['W5500 MOSI',n+' '+sp.mosi],['W5500 MISO',n+' '+sp.miso],['W5500 SCLK',n+' '+sp.sck],['W5500 SCS',n+' '+sp.cs],['W5500 RST',n+' '+dpin(m,4)],['RJ45 port','Ethernet cable to router']],
    note:'💡 Use Ethernet library (for W5100/W5200) or Ethernet2 library for W5500.',
    code:`#include <Ethernet.h>\nbyte mac[] = {0xDE,0xAD,0xBE,0xEF,0xFE,0xED};\nvoid setup() { Ethernet.begin(mac); EthernetServer server(80); server.begin(); }`,
  };},

  // ── STORAGE / AUDIO ──────────────────────────────────────────────────────
  'sd-card-module': m => { const sp=spi(m),n=mcuLabel(m); return {
    title:'SD Card Module (SPI)',
    rows:[['SD VCC',n+' 5V'],['SD GND',n+' GND'],['SD MISO',n+' '+sp.miso],['SD MOSI',n+' '+sp.mosi],['SD SCK',n+' '+sp.sck],['SD CS',n+' '+sp.cs]],
    note:'💡 Format SD card as FAT32. Use SD library (built-in Arduino).',
    code:`#include <SD.h>\nvoid setup() { SD.begin(${sp.cs.replace(/[^0-9]/g,'')}); File f=SD.open("log.txt",FILE_WRITE); f.println("Hello!"); f.close(); }`,
  };},
  'dfplayer-mini': m => { const n=mcuLabel(m),tx=dpin(m,7),rx=dpin(m,8); return {
    title:'DFPlayer Mini MP3 Module (UART)',
    rows:[['DFPlayer VCC',n+' 5V'],['DFPlayer GND',n+' GND'],['DFPlayer TX (pin 3)',n+' '+tx+' (as RX)'],['DFPlayer RX (pin 2)',n+' 1kΩ → '+rx+' (TX)'],['DFPlayer SPK1','Speaker (+)'],['DFPlayer SPK2','Speaker (−)']],
    note:'💡 Put MP3 files in /01/ folder on micro-SD card. Named 001.mp3, 002.mp3...\n1kΩ on RX protects DFPlayer.',
    code:`#include <DFRobotDFPlayerMini.h>\n#include <SoftwareSerial.h>\nSoftwareSerial mySoftwareSerial(${tx.replace(/[^0-9]/g,'')},${rx.replace(/[^0-9]/g,'')});\nDFRobotDFPlayerMini myDFPlayer;\nvoid setup() { mySoftwareSerial.begin(9600); myDFPlayer.begin(mySoftwareSerial); myDFPlayer.play(1); }`,
  };},

  // ── ICs ────────────────────────────────────────────────────────────────
  '74hc595': m => { const n=mcuLabel(m),data=dpin(m,0),latch=dpin(m,1),clock=dpin(m,2); return {
    title:'74HC595 Shift Register (Serial → Parallel)',
    rows:[['74HC595 VCC (pin 16)',n+' 5V'],['74HC595 GND (pin 8)',n+' GND'],['74HC595 DS (pin 14)',n+' '+data+' (data)'],['74HC595 ST_CP (pin 12)',n+' '+latch+' (latch)'],['74HC595 SH_CP (pin 11)',n+' '+clock+' (clock)'],['74HC595 OE (pin 13)',n+' GND (always output)'],['74HC595 MR (pin 10)',n+' 5V (no reset)'],['Outputs Q0–Q7','LEDs or other loads via 220Ω']],
    note:'💡 Control 8 outputs with only 3 Arduino pins. Chain multiple 595s for more outputs.',
    code:`#define DATA ${data.replace(/[^0-9]/g,'')} \n#define LATCH ${latch.replace(/[^0-9]/g,'')} \n#define CLOCK ${clock.replace(/[^0-9]/g,'')}\nvoid shiftOut595(byte val) { digitalWrite(LATCH,LOW); shiftOut(DATA,CLOCK,MSBFIRST,val); digitalWrite(LATCH,HIGH); }\nvoid loop() { shiftOut595(0b10101010); delay(500); shiftOut595(0b01010101); delay(500); }`,
  };},
  'pcf8574': m => { const p=i2c(m),n=mcuLabel(m); return {
    title:'PCF8574 I2C GPIO Expander',
    rows:[['PCF8574 VCC',n+' 5V'],['PCF8574 GND',n+' GND'],['PCF8574 SDA',n+' '+p.sda],['PCF8574 SCL',n+' '+p.scl],['A0,A1,A2','GND or VCC for address bits'],['P0–P7','Digital I/O pins']],
    note:'💡 8 extra GPIO pins via I2C! Address 0x20–0x27 (set by A0/A1/A2). Use PCF8574 library.',
    code:`#include <PCF8574.h>\nPCF8574 expander(0x20);\nvoid setup() { expander.begin(); }\nvoid loop() { expander.write(0,HIGH); delay(500); expander.write(0,LOW); delay(500); }`,
  };},
  'ads1115': m => { const p=i2c(m),n=mcuLabel(m); return {
    title:'ADS1115 16-bit ADC (I2C)',
    rows:[['ADS1115 VCC',n+' 3.3V or 5V'],['ADS1115 GND',n+' GND'],['ADS1115 SCL',n+' '+p.scl],['ADS1115 SDA',n+' '+p.sda],['ADS1115 ADDR','GND = 0x48, VCC = 0x49'],['ADS1115 A0–A3','Analog inputs to measure']],
    note:'💡 16-bit precision vs Arduino\'s 10-bit. ±6.144V range. Use Adafruit ADS1X15 library.',
    code:`#include <Adafruit_ADS1X15.h>\nAdafruit_ADS1115 ads;\nvoid setup() { ads.begin(); }\nvoid loop() { int16_t val=ads.readADC_SingleEnded(0); Serial.println(val*0.1875); delay(500); }`,
  };},
  'mcp4725': m => { const p=i2c(m),n=mcuLabel(m); return {
    title:'MCP4725 12-bit DAC (I2C)',
    rows:[['MCP4725 VCC',n+' 5V'],['MCP4725 GND',n+' GND'],['MCP4725 SCL',n+' '+p.scl],['MCP4725 SDA',n+' '+p.sda],['MCP4725 OUT','Analog voltage output 0–VCC']],
    note:'💡 Generates true analog voltage 0–5V (or 0–3.3V). Address: 0x60 or 0x61.',
    code:`#include <Adafruit_MCP4725.h>\nAdafruit_MCP4725 dac;\nvoid setup() { dac.begin(0x60); }\nvoid loop() { for(int v=0;v<4096;v+=100) { dac.setVoltage(v,false); delay(10); } }`,
  };},
  'at24c256': m => { const p=i2c(m),n=mcuLabel(m); return {
    title:'AT24C256 EEPROM (I2C)',
    rows:[['EEPROM VCC',n+' 5V'],['EEPROM GND',n+' GND'],['EEPROM SCL',n+' '+p.scl],['EEPROM SDA',n+' '+p.sda],['A0,A1,A2','Address pins — all to GND = 0x50']],
    note:'💡 32KB external non-volatile storage. Address range: 0x50–0x57. Use extEEPROM library.',
    code:`#include <Wire.h>\nvoid writeEEPROM(int addr, byte val) { Wire.beginTransmission(0x50); Wire.write(addr>>8); Wire.write(addr&0xFF); Wire.write(val); Wire.endTransmission(); delay(5); }`,
  };},
  'ds3231': m => { const p=i2c(m),n=mcuLabel(m); return {
    title:'DS3231 Real-Time Clock (I2C)',
    rows:[['DS3231 VCC',n+' 3.3V or 5V'],['DS3231 GND',n+' GND'],['DS3231 SCL',n+' '+p.scl],['DS3231 SDA',n+' '+p.sda],['DS3231 SQW','Optional interrupt → '+dpin(m,5)],['Battery slot','CR2032 coin cell (3V)']],
    note:'💡 Keeps time even with no power (via battery). Address: **0x68**. Use RTClib library.',
    code:`#include <RTClib.h>\nRTC_DS3231 rtc;\nvoid setup() { rtc.begin(); rtc.adjust(DateTime(F(__DATE__),F(__TIME__))); }\nvoid loop() { DateTime now=rtc.now(); Serial.print(now.hour()); Serial.print(":"); Serial.println(now.minute()); delay(1000); }`,
  };},
  'ds1307': m => { const d=WIRING['ds3231'](m); d.title='DS1307 Real-Time Clock (I2C)'; d.note='Same as DS3231 wiring. Less accurate but cheaper. Address: 0x68.'; return d; },
  '555-timer': m => { return {
    title:'555 Timer IC',
    rows:[['Pin 1 GND','GND'],['Pin 8 VCC','5V–15V'],['Pin 4 RST','VCC (high to enable)'],['Pin 2 TRIG','⅓ VCC threshold (set by R/C)'],['Pin 6 THR','⅔ VCC threshold'],['Pin 7 DIS','Discharge — connects to R/C network'],['Pin 5 CV','100nF to GND (optional stability)'],['Pin 3 OUT','Output signal (0V or VCC)']],
    note:'💡 **Astable mode** (oscillator): frequency = 1.44/((R1+2×R2)×C)\n**Monostable** (one-shot): pulse = 1.1×R×C',
    code:`// No Arduino code needed — 555 is standalone IC\n// Connect a potentiometer to R2 for variable frequency`,
  };},
  'optocoupler-817': m => { const n=mcuLabel(m),p=dpin(m,4); return {
    title:'PC817 Optocoupler',
    rows:[['Pin 1 Anode (+)','1kΩ → '+n+' '+p],['Pin 2 Cathode (−)',n+' GND (input side)'],['Pin 3 Emitter','Output GND'],['Pin 4 Collector','Load or other MCU pin']],
    note:'💡 Provides electrical isolation between circuits (e.g. Arduino controlling 12V circuit safely).',
    code:`// Drive pin HIGH to activate — pulls collector LOW (output side)`,
  };},

  // ── INPUT DEVICES ────────────────────────────────────────────────────────
  'push-button': m => { const n=mcuLabel(m),p=dpin(m,4); return {
    title:'Push Button',
    rows:[['Button leg 1',n+' '+p+' + 10kΩ pull-down to GND (or use INPUT_PULLUP)'],['Button leg 2',n+' 5V (or GND for pull-up mode)']],
    note:'💡 Use INPUT_PULLUP mode — button reads HIGH normally, LOW when pressed. No external resistor needed.',
    code:`#define BTN ${p.replace(/[^0-9]/g,'')}\nvoid setup() { pinMode(BTN,INPUT_PULLUP); }\nvoid loop() { if(!digitalRead(BTN)) { Serial.println("Pressed!"); delay(200); } }`,
  };},
  'toggle-switch': m => { const d=WIRING['push-button'](m); d.title='Toggle Switch'; return d; },
  'slide-switch': m => { const n=mcuLabel(m),p=dpin(m,4); return {
    title:'SPDT Slide Switch',
    rows:[['Center (COM)',n+' '+p],['Position A (NO)','5V + 10kΩ to pin'],['Position B (NC)','GND']],
    note:'💡 Reads HIGH in position A, LOW in position B.',
    code:`#define SW ${p.replace(/[^0-9]/g,'')}\nvoid setup() { pinMode(SW,INPUT); }\nvoid loop() { Serial.println(digitalRead(SW)?"ON":"OFF"); delay(200); }`,
  };},
  'rocker-switch': m => WIRING['toggle-switch'](m),
  'dip-switch-4': m => { const n=mcuLabel(m); return {
    title:'4-Position DIP Switch',
    rows:[['Switch 1',''+dpin(m,4)+' + 10kΩ pull-down'],['Switch 2',''+dpin(m,5)+' + 10kΩ pull-down'],['Switch 3',''+dpin(m,6)+' + 10kΩ pull-down'],['Switch 4',''+dpin(m,7)+' + 10kΩ pull-down'],['All Common','5V']],
    note:'💡 Each switch reads HIGH when ON. Use for configuration settings.',
    code:`void setup() { for(int p=4;p<=7;p++) pinMode(p,INPUT); }\nvoid loop() { for(int p=4;p<=7;p++) Serial.print(digitalRead(p)); Serial.println(); delay(500); }`,
  };},
  'keypad-4x4': m => { const n=mcuLabel(m); return {
    title:'4×4 Matrix Keypad',
    rows:[['Row 1–4',''+dpin(m,0)+'–'+dpin(m,3)+' (with pull-up)'],['Col 1–4',''+dpin(m,4)+'–'+dpin(m,7)],['Total pins','8 pins used']],
    note:'💡 Use Keypad library by Mark Stanley. Rows and columns are scanned to detect key presses.',
    code:`#include <Keypad.h>\nchar keys[4][4] = {{'1','2','3','A'},{'4','5','6','B'},{'7','8','9','C'},{'*','0','#','D'}};\nbyte rowPins[4] = {${dpin(m,0).replace(/[^0-9]/g,'')},${dpin(m,1).replace(/[^0-9]/g,'')},${dpin(m,2).replace(/[^0-9]/g,'')},${dpin(m,3).replace(/[^0-9]/g,'')}};\nbyte colPins[4] = {${dpin(m,4).replace(/[^0-9]/g,'')},${dpin(m,5).replace(/[^0-9]/g,'')},${dpin(m,6).replace(/[^0-9]/g,'')},${dpin(m,7).replace(/[^0-9]/g,'')}};\nKeypad keypad = Keypad(makeKeymap(keys),rowPins,colPins,4,4);\nvoid loop() { char key=keypad.getKey(); if(key) Serial.println(key); }`,
  };},
  'keypad-4x3': m => { const d=WIRING['keypad-4x4'](m); d.title='4×3 Numeric Keypad'; return d; },
  'joystick': m => { const n=mcuLabel(m),vx=apin(m,0),vy=apin(m,1),sw=dpin(m,4); return {
    title:'Analog Joystick (KY-023)',
    rows:[['Joystick VCC',n+' 5V'],['Joystick GND',n+' GND'],['Joystick VRx',n+' '+vx+' (X-axis)'],['Joystick VRy',n+' '+vy+' (Y-axis)'],['Joystick SW',n+' '+sw+' (push button)']],
    note:'💡 Center = 512. Full left/right/up/down = 0 or 1023. SW is active LOW.',
    code:`void setup() { Serial.begin(9600); pinMode(${sw.replace(/[^0-9]/g,'')},INPUT_PULLUP); }\nvoid loop() { int x=analogRead(A0),y=analogRead(A1); bool btn=!digitalRead(${sw.replace(/[^0-9]/g,'')}); Serial.print(x); Serial.print(","); Serial.print(y); Serial.print(","); Serial.println(btn); delay(100); }`,
  };},
  'potentiometer-10k': m => { const n=mcuLabel(m),p=apin(m,0); return {
    title:'10kΩ Potentiometer',
    rows:[['Pot leg 1 (VCC)',n+' 5V'],['Pot leg 2 (wiper)',n+' '+p],['Pot leg 3 (GND)',n+' GND']],
    note:'💡 Rotating the knob gives 0–5V output. analogRead returns 0–1023.',
    code:`void loop() { int val=analogRead(A0); int pct=map(val,0,1023,0,100); Serial.print(pct); Serial.println("%"); delay(100); }`,
  };},
  'potentiometer-100k': m => WIRING['potentiometer-10k'](m),
  'trimmer-10k': m => WIRING['potentiometer-10k'](m),
  'rotary-encoder': m => { const n=mcuLabel(m),clk=dpin(m,4),dt=dpin(m,5),sw=dpin(m,6); return {
    title:'Rotary Encoder KY-040',
    rows:[['Encoder + (VCC)',n+' 5V'],['Encoder GND',n+' GND'],['Encoder CLK',n+' '+clk],['Encoder DT',n+' '+dt],['Encoder SW',n+' '+sw+' (press button)']],
    note:'💡 Turn = CLK/DT change. Press = SW goes LOW. Use INPUT_PULLUP on all signal pins.',
    code:`#define CLK ${clk.replace(/[^0-9]/g,'')}\n#define DT ${dt.replace(/[^0-9]/g,'')}\nint counter=0,lastCLK;\nvoid setup() { pinMode(CLK,INPUT); pinMode(DT,INPUT); lastCLK=digitalRead(CLK); }\nvoid loop() { int c=digitalRead(CLK); if(c!=lastCLK){if(digitalRead(DT)!=c)counter++;else counter--; Serial.println(counter); lastCLK=c;} }`,
  };},

  // ── POWER ───────────────────────────────────────────────────────────────
  'lm7805': m => { return {
    title:'LM7805 5V Voltage Regulator',
    rows:[['Input (pin 1)','7–35V DC'],['GND (pin 2)','Common GND'],['Output (pin 3)','5V DC output'],['Capacitor IN','100µF between input and GND'],['Capacitor OUT','10µF between output and GND']],
    note:'⚠️ Add heatsink for currents >500mA. Maximum 1.5A output.\n💡 Input must be at least 7V for stable 5V output.',
    code:`// No code needed — analog circuit`,
  };},
  'lm7812': m => { const d=WIRING['lm7805'](m); d.title='LM7812 12V Voltage Regulator'; d.rows[0][1]='14–35V DC'; d.rows[2][1]='12V DC output'; return d; },
  'lm317': m => { return {
    title:'LM317 Adjustable Voltage Regulator',
    rows:[['Input','Input voltage (Vout+3V to 40V)'],['GND/Adj','R1 (240Ω) to output, R2 (pot) to GND'],['Output','Adjustable 1.25V–37V'],['Bypass cap','10µF on output']],
    note:'💡 Vout = 1.25 × (1 + R2/R1). Use 240Ω for R1, 5kΩ pot for R2.',
    code:`// Formula: Vout = 1.25 × (1 + R2/R1)\n// R1=240Ω, R2=0–5kΩ pot → Vout = 1.25V–27V`,
  };},
  'ams1117-3.3': m => { return {
    title:'AMS1117 3.3V LDO Regulator',
    rows:[['IN','4.75–12V input'],['GND','GND'],['OUT','3.3V output (max 800mA)'],['Cap IN','10µF ceramic'],['Cap OUT','10µF ceramic']],
    note:'💡 Common on ESP8266/ESP32 breakout boards. Dropout voltage ~1.1V.',
    code:`// No code needed`,
  };},
  'buck-converter': m => { return {
    title:'Buck Converter (DC-DC Step-Down)',
    rows:[['IN+','Higher voltage input (e.g. 12V)'],['IN−','GND'],['OUT+','Adjusted lower voltage (set via pot)'],['OUT−','GND']],
    note:'💡 Adjust output voltage using the onboard potentiometer. Much more efficient than linear regulators.',
    code:`// No code needed — set output voltage with multimeter`,
  };},
  'boost-converter': m => { return {
    title:'Boost Converter (DC-DC Step-Up)',
    rows:[['IN+','Lower voltage input (e.g. 3.7V)'],['IN−','GND'],['OUT+','Higher voltage output (e.g. 5V or 9V)'],['OUT−','GND']],
    note:'💡 Common use: boost 3.7V LiPo to 5V for Arduino power. Adjust with potentiometer.',
    code:`// No code needed`,
  };},
  'tp4056': m => { return {
    title:'TP4056 Li-Ion Battery Charger Module',
    rows:[['VCC (USB)','5V USB input'],['GND','GND'],['BAT+','Li-Ion battery positive'],['BAT−','Li-Ion battery negative'],['OUT+','Protected output to load'],['OUT−','GND to load']],
    note:'💡 Red LED = charging, Blue/Green = fully charged.\n⚠️ Use TP4056 WITH protection circuit (model with 4 pads, not just 2).',
    code:`// No code needed — automatic charging IC`,
  };},
  'solar-panel-6v': m => { return {
    title:'Solar Panel (6V)',
    rows:[['Solar (+)','Buck converter IN+ or TP4056 VCC+'],['Solar (−)','GND'],['Protection diode','1N4007 in series on + line (prevents backflow)']],
    note:'💡 Output voltage varies with light. Use a buck converter to regulate to 5V.\nFor battery charging, use TP4056 with solar input.',
    code:`// No code — connect via regulator circuit`,
  };},

  // ── PASSIVE COMPONENTS ────────────────────────────────────────────────
  'resistor-220ohm': m => { return {
    title:'220Ω Resistor',
    rows:[['Usage','LED current limiting from 5V','Formula: R=(Vcc-Vf)/I=(5-2)/0.02=150Ω → use 220Ω'],['Colour bands','Red - Red - Brown - Gold']],
    note:'💡 Colour: **Red-Red-Brown-Gold**. Use for LEDs connected to 5V Arduino.',
    code:`// In series between digital pin and LED anode`,
  };},
  'resistor-330ohm': m => { return {
    title:'330Ω Resistor',
    rows:[['Usage','LED current limiting from 3.3V (ESP32)'],['Colour bands','Orange - Orange - Brown - Gold']],
    note:'💡 For LEDs connected to 3.3V (ESP32, Pico). Colour: **Orange-Orange-Brown**.',
    code:`// In series between GPIO pin and LED anode on 3.3V system`,
  };},
  'resistor-1kohm': m => { return {
    title:'1kΩ Resistor',
    rows:[['Colour bands','Brown-Black-Red-Gold'],['Common uses','Transistor base, signal protection, voltage divider R1']],
    note:'💡 Colour: **Brown-Black-Red-Gold**.',
    code:'',
  };},
  'resistor-4.7kohm': m => { return {
    title:'4.7kΩ Pull-up Resistor',
    rows:[['Usage','I2C SDA/SCL pull-up, DHT22 data pull-up'],['Connection','Between VCC and signal line'],['Colour bands','Yellow-Violet-Red-Gold']],
    note:'💡 Colour: **Yellow-Violet-Red-Gold**. Required for I2C and DHT sensors.',
    code:'',
  };},
  'resistor-10kohm': m => { return {
    title:'10kΩ Pull-up / Pull-down Resistor',
    rows:[['Pull-up','Between VCC and signal pin'],['Pull-down','Between signal pin and GND'],['Colour bands','Brown-Black-Orange-Gold']],
    note:'💡 Colour: **Brown-Black-Orange-Gold**. Standard pull-up/pull-down value.',
    code:'',
  };},
  'cap-ceramic-100nf': m => { return {
    title:'100nF (0.1µF) Ceramic Capacitor',
    rows:[['Usage','Decoupling — place near IC power pins'],['Connection','Between VCC and GND, as close to IC as possible'],['Polarity','No polarity — any orientation']],
    note:'💡 Non-polarized. Filters high-frequency noise on power supply rails.',
    code:'',
  };},
  'cap-electrolytic-100uf': m => { return {
    title:'100µF Electrolytic Capacitor',
    rows:[['Long leg (+ stripe)','VCC / positive rail'],['Short leg (− stripe)','GND'],['Usage','Bulk power filtering, motor supply, NeoPixel bypass']],
    note:'⚠️ Polarized — connect + to positive, − to GND. Reverse connection can rupture the capacitor.',
    code:'',
  };},
  'cap-electrolytic-1000uf': m => { return {
    title:'1000µF Electrolytic Capacitor',
    rows:[['Long leg (+)','VCC'],['Short leg (−)','GND'],['Usage','NeoPixel/motor bulk capacitor — prevents brownouts']],
    note:'⚠️ Polarized! ⚠️\n💡 Add across 5V and GND near NeoPixel/motor power input.',
    code:'',
  };},
  'diode-1n4007': m => { return {
    title:'1N4007 Rectifier Diode',
    rows:[['Anode (+)','Input / motor (−) terminal'],['Cathode (−) [striped end]','Positive supply'],['Direction','Current flows anode→cathode only']],
    note:'💡 Used as flyback diode across motors/relays/solenoids to absorb back-EMF spikes.\nStripe marks cathode (−).',
    code:'',
  };},
  'diode-1n4148': m => { return {
    title:'1N4148 Signal Diode',
    rows:[['Anode','Signal input'],['Cathode (striped end)','Output / protected node']],
    note:'💡 Fast switching signal diode. Not for power — use 1N4007 for motors.',
    code:'',
  };},
  'zener-5v1': m => { return {
    title:'5.1V Zener Diode',
    rows:[['Cathode (striped)','Input signal (5V)'],['Anode','GND via resistor'],['Use case','Clamp 5V signal to 5.1V max for voltage protection']],
    note:'💡 Use to protect 3.3V pins from 5V signals (with resistor). Conducts in reverse at Vz=5.1V.',
    code:'',
  };},
  'npn-2n2222': m => { const n=mcuLabel(m),p=dpin(m,4); return {
    title:'2N2222 NPN Transistor (Switch)',
    rows:[['Base','1kΩ resistor → '+n+' '+p],['Collector','Load negative terminal (e.g. LED −, motor −)'],['Emitter',n+' GND'],['Load (+)','5V or battery']],
    note:'💡 Transistor = MCU-controlled switch. HIGH on base → transistor ON → current flows.\nMax 600mA. For higher current use TIP120 or MOSFET.',
    code:`#define CTL ${p.replace(/[^0-9]/g,'')}\nvoid setup() { pinMode(CTL,OUTPUT); }\nvoid loop() { digitalWrite(CTL,HIGH); delay(1000); digitalWrite(CTL,LOW); delay(1000); }`,
  };},
  'pnp-2n2907': m => { return {
    title:'2N2907 PNP Transistor',
    rows:[['Base','1kΩ → MCU pin (LOW = ON)'],['Collector','Load (−) or next circuit'],['Emitter','5V (PNP switches from Emitter)']],
    note:'💡 Opposite of NPN — active LOW. LOW on base = transistor ON.',
    code:`// Drive base LOW to turn on load`,
  };},
  'npn-tip120': m => { const n=mcuLabel(m),p=dpin(m,4); return {
    title:'TIP120 Darlington NPN Transistor',
    rows:[['Base','1kΩ → '+n+' '+p],['Collector','Motor/relay/solenoid (−)'],['Emitter',n+' GND'],['Load (+)','12V or motor power'],['Flyback diode','1N4007 across load']],
    note:'💡 High-gain — can switch 5A. Perfect for motors, solenoids, high-power LEDs.',
    code:`#define CTL ${p.replace(/[^0-9]/g,'')}\nvoid setup() { pinMode(CTL,OUTPUT); }\nvoid loop() { digitalWrite(CTL,HIGH); delay(2000); digitalWrite(CTL,LOW); delay(1000); }`,
  };},
  'mosfet-irf540n': m => { const n=mcuLabel(m),p=dpin(m,4); return {
    title:'IRF540N N-Channel MOSFET',
    rows:[['Gate (G)','10kΩ pull-down to GND + 220Ω → '+n+' '+p],['Drain (D)','Load (−) terminal'],['Source (S)','GND'],['Load (+)','12V supply']],
    note:'⚠️ Logic level: needs 10V+ gate for full turn-on from 5V MCU. Use IRL540N/IRLZ44N for logic-level (3.3V/5V).',
    code:`#define GATE ${p.replace(/[^0-9]/g,'')}\nvoid setup() { pinMode(GATE,OUTPUT); }\nvoid loop() { analogWrite(GATE,200); delay(2000); analogWrite(GATE,0); delay(1000); }`,
  };},
  'mosfet-irlz44n': m => { const d=WIRING['mosfet-irf540n'](m); d.title='IRLZ44N Logic-Level N-Channel MOSFET'; d.note='💡 Logic-level compatible — fully on with just 3.3V or 5V gate signal. Great for LED strips, motors.'; return d; },
  'level-shifter-4ch': m => { const n=mcuLabel(m); return {
    title:'4-Channel Bidirectional Level Shifter',
    rows:[['HV (High Voltage side)','5V'],['LV (Low Voltage side)','3.3V'],['GND both sides',n+' GND'],['HV1–HV4','5V signal inputs/outputs'],['LV1–LV4','3.3V signal inputs/outputs']],
    note:'💡 Essential when connecting 5V Arduino to 3.3V ESP32/sensors.\nBidirectional — works for I2C, UART, SPI signals.',
    code:`// Transparent — signals pass through automatically`,
  };},

  // ── INTERFACE MODULES ─────────────────────────────────────────────────
  'wifi-esp8266': m => { const n=mcuLabel(m); return {
    title:'ESP8266 WiFi Module (as AT modem)',
    rows:[['ESP8266 VCC',n+' 3.3V (NOT 5V!) + 1000µF cap'],['ESP8266 GND',n+' GND'],['ESP8266 CH_PD',n+' 3.3V (enable)'],['ESP8266 TX',n+' '+dpin(m,7)+' (as RX)'],['ESP8266 RX',n+' '+dpin(m,8)+' (TX via 1kΩ+2kΩ divider)'],['ESP8266 RST','3.3V (or 10kΩ pull-up + button to GND)']],
    note:'⚠️ **3.3V only, but can draw 300mA peaks!** Arduino 3.3V pin can\'t supply this — use AMS1117.\n⚠️ RX is 3.3V — use voltage divider from Arduino 5V TX.',
    code:`// Use AT commands via SoftwareSerial:\n// AT → OK\n// AT+CWMODE=1 → STA mode\n// AT+CWJAP="SSID","pass" → connect WiFi`,
  };},
};

// ─── System design templates ──────────────────────────────────────────────────
const SYSTEMS = {
  car: {
    keywords:['car','robot car','smart car','4wd','robot vehicle','make a car','build a car','autonomous car'],
    title:'🚗 4WD Smart Robot Car',
    components:['ESP32 or Arduino Uno','L298N Motor Driver','4WD Car Chassis','7.4V 18650 Battery (2-cell)','Jumper wires'],
    wiringLines:['Battery (+) → L298N VIN','Battery (−) → L298N GND','L298N GND → ESP32 GND  ← CRITICAL!','L298N ENA → ESP32 GPIO14 (PWM left speed)','L298N IN1 → ESP32 GPIO27','L298N IN2 → ESP32 GPIO26','L298N ENB → ESP32 GPIO12 (PWM right speed)','L298N IN3 → ESP32 GPIO25','L298N IN4 → ESP32 GPIO33','L298N OUT1 → M1+ (Front-Left)','L298N OUT2 → M1− (Front-Left)','L298N OUT3 → M2+ (Front-Right)','L298N OUT4 → M2− (Front-Right)','M3+/M3− → parallel with OUT1/OUT2 (Rear-Left)','M4+/M4− → parallel with OUT3/OUT4 (Rear-Right)'],
    tips:['Share GND between ESP32, L298N and battery always','Leave ENA/ENB jumpers ON for full speed, remove for PWM speed','Rear motors parallel with front motors — same OUT terminals','Use 7.4V Li-Ion for proper motor torque'],
    code:`#define IN1 27 \n#define IN2 26 \n#define IN3 25 \n#define IN4 33 \n#define ENA 14 \n#define ENB 12\nvoid setup() { pinMode(IN1,OUTPUT);pinMode(IN2,OUTPUT);pinMode(IN3,OUTPUT);pinMode(IN4,OUTPUT); analogWrite(ENA,200);analogWrite(ENB,200); }\nvoid forward()  { digitalWrite(IN1,H);digitalWrite(IN2,L);digitalWrite(IN3,H);digitalWrite(IN4,L); }\nvoid backward() { digitalWrite(IN1,L);digitalWrite(IN2,H);digitalWrite(IN3,L);digitalWrite(IN4,H); }\nvoid turnLeft() { digitalWrite(IN1,L);digitalWrite(IN2,H);digitalWrite(IN3,H);digitalWrite(IN4,L); }\nvoid turnRight(){ digitalWrite(IN1,H);digitalWrite(IN2,L);digitalWrite(IN3,L);digitalWrite(IN4,H); }\nvoid stopCar()  { digitalWrite(IN1,L);digitalWrite(IN2,L);digitalWrite(IN3,L);digitalWrite(IN4,L); }`,
  },
  weather: {
    keywords:['weather','weather station','temperature station','environment monitor'],
    title:'🌤️ Weather Station',
    components:['Arduino Uno or ESP32','DHT22 (temp+humidity)','BMP280 (pressure+altitude)','OLED 0.96" or LCD 16×2'],
    wiringLines:['DHT22 VCC → 5V','DHT22 GND → GND','DHT22 DATA → D2 (Arduino) or GPIO4 (ESP32) + 4.7kΩ pull-up','BMP280 VCC → 3.3V  ⚠️','BMP280 GND → GND','BMP280 SCL → A5 / GPIO22','BMP280 SDA → A4 / GPIO21','OLED VCC → 3.3V','OLED GND → GND','OLED SCL → A5 / GPIO22  ← shares I2C with BMP280','OLED SDA → A4 / GPIO21  ← shares I2C with BMP280'],
    tips:['BMP280 and OLED share the same I2C SDA/SCL — that\'s correct!','BMP280 address=0x76, OLED address=0x3C','DHT22 needs 4.7kΩ pull-up resistor on DATA pin'],
    code:`#include <DHT.h>\n#include <Adafruit_BMP280.h>\n#include <Adafruit_SSD1306.h>\nDHT dht(2,DHT22);\nAdafruit_BMP280 bmp;\nAdafruit_SSD1306 display(128,64,&Wire,-1);\nvoid setup() { dht.begin(); bmp.begin(0x76); display.begin(SSD1306_SWITCHCAPVCC,0x3C); }\nvoid loop() { display.clearDisplay(); display.setCursor(0,0); display.print("T:"); display.print(dht.readTemperature()); display.println("C"); display.print("H:"); display.print(dht.readHumidity()); display.println("%"); display.print("P:"); display.print(bmp.readPressure()/100); display.println("hPa"); display.display(); delay(2000); }`,
  },
  alarm: {
    keywords:['alarm','security alarm','motion alarm','burglar','security system'],
    title:'🚨 Motion Alarm System',
    components:['Arduino Uno','PIR Motion Sensor','Active Buzzer','LED','Optional: Relay + siren'],
    wiringLines:['PIR VCC → 5V','PIR GND → GND','PIR OUT → D2','Buzzer (+) → D8','Buzzer (−) → GND','LED Anode → 220Ω → D13','LED Cathode → GND'],
    tips:['PIR needs 30–60 second warm-up after power on','Adjust sensitivity/delay with PIR trimmers'],
    code:`#define PIR 2\n#define BUZZ 8\n#define LED 13\nvoid setup() { Serial.begin(9600); pinMode(PIR,INPUT); pinMode(BUZZ,OUTPUT); pinMode(LED,OUTPUT); delay(30000); }\nvoid loop() { if(digitalRead(PIR)) { Serial.println("ALERT!"); digitalWrite(BUZZ,HIGH); digitalWrite(LED,HIGH); delay(3000); } else { digitalWrite(BUZZ,LOW); digitalWrite(LED,LOW); } }`,
  },
  plant: {
    keywords:['plant watering','auto water','irrigation','plant system','garden water'],
    title:'🌱 Automatic Plant Watering',
    components:['Arduino Uno','Soil Moisture Sensor','Relay Module','Water Pump (5V)','5V Power Supply'],
    wiringLines:['Soil Sensor VCC → 5V','Soil Sensor GND → GND','Soil Sensor AO → A0','Relay VCC → 5V','Relay GND → GND','Relay IN → D7','Relay COM → Pump (+)','Relay NO → 5V supply','Pump (−) → GND'],
    tips:['Dry soil = high analogRead. Wet = low. Calibrate threshold!','Never power pump from Arduino 5V — use external supply via relay'],
    code:`#define SOIL A0\n#define RELAY 7\n#define THRESHOLD 600\nvoid setup() { Serial.begin(9600); pinMode(RELAY,OUTPUT); digitalWrite(RELAY,HIGH); }\nvoid loop() { int s=analogRead(SOIL); if(s>THRESHOLD) { Serial.println("Watering..."); digitalWrite(RELAY,LOW); delay(3000); digitalWrite(RELAY,HIGH); delay(60000); } delay(1000); }`,
  },
  smart_home: {
    keywords:['smart home','home automation','iot','wifi control','remote control'],
    title:'🏠 Smart Home (ESP32 WiFi)',
    components:['ESP32','4-Channel Relay','DHT22','OLED Display','5V Power Supply'],
    wiringLines:['Relay VCC → 5V','Relay GND → GND','Relay IN1–IN4 → GPIO26,GPIO27,GPIO14,GPIO12','DHT22 DATA → GPIO4 + 4.7kΩ pull-up','DHT22 VCC → 5V','DHT22 GND → GND','OLED VCC → 3.3V','OLED SDA → GPIO21','OLED SCL → GPIO22'],
    tips:['ESP32 is 3.3V — ensure relay module is 3.3V compatible or use optocouplers','Common GND between all components'],
    code:`#include <WiFi.h>\n#include <DHT.h>\n#define RELAY1 26\nDHT dht(4,DHT22);\nvoid setup() { pinMode(RELAY1,OUTPUT); dht.begin(); WiFi.begin("SSID","PASS"); }`,
  },
  line_follower: {
    keywords:['line follower','line following','line tracking','black line robot'],
    title:'📏 Line Follower Robot',
    components:['Arduino Uno','L298N Motor Driver','2× DC Motors','3× IR Sensors','9V Battery'],
    wiringLines:['L298N ENA → D9 (PWM)','L298N IN1 → D4','L298N IN2 → D5','L298N IN3 → D6','L298N IN4 → D7','L298N ENB → D10','IR Sensor Left OUT → D2','IR Sensor Center OUT → D3','IR Sensor Right OUT → D8','All VCC → 5V','All GND → GND'],
    tips:['IR sensors: LOW = black line detected, HIGH = white','Place IR sensors 1–2cm above surface'],
    code:`#define IR_L 2\n#define IR_C 3\n#define IR_R 8\n#define IN1 4\n#define IN2 5\n#define IN3 6\n#define IN4 7\nvoid forward()  { digitalWrite(IN1,H);digitalWrite(IN2,L);digitalWrite(IN3,H);digitalWrite(IN4,L); }\nvoid turnLeft() { digitalWrite(IN1,L);digitalWrite(IN2,H);digitalWrite(IN3,H);digitalWrite(IN4,L); }\nvoid turnRight(){ digitalWrite(IN1,H);digitalWrite(IN2,L);digitalWrite(IN3,L);digitalWrite(IN4,H); }\nvoid loop() { bool L=!digitalRead(IR_L),C=!digitalRead(IR_C),R=!digitalRead(IR_R); if(C)forward(); else if(L)turnLeft(); else if(R)turnRight(); }`,
  },
  drone: {
    keywords:['drone','quadcopter','uav','flight controller'],
    title:'🚁 Quadcopter / Drone',
    components:['ESP32 or Arduino Nano','MPU6050 (Gyro/Accel)','4× Coreless DC Motors','4× N-Channel MOSFETs (IRLZ44N)','nRF24L01 (Radio)','3.7V LiPo High Discharge'],
    wiringLines:['MPU6050 SDA → I2C SDA (GPIO21 / A4)','MPU6050 SCL → I2C SCL (GPIO22 / A5)','nRF24L01 MOSI/MISO/SCK → SPI pins','nRF24L01 CSN/CE → GPIO5 / GPIO4','Motor 1–4 (−) → MOSFET Drain','MOSFET Source → GND','MOSFET Gate → PWM Pins (via 220Ω) + 10kΩ to GND','Motor 1–4 (+) → Battery (+)'],
    tips:['Motors need high current! Never run them through the MCU.','Use logic-level MOSFETs (IRLZ44N).','Balance your propellers and calibrate MPU6050 offsets.'],
  },
  rfid_lock: {
    keywords:['door lock','rfid lock','smart lock','access control','security door'],
    title:'🚪 Smart RFID Door Lock',
    components:['Arduino Uno','RC522 RFID Reader','Servo Motor or 12V Solenoid + Relay','LED (Red/Green)','Buzzer'],
    wiringLines:['RC522 SDA(SS) → D10','RC522 SCK → D13','RC522 MOSI → D11','RC522 MISO → D12','RC522 VCC → 3.3V ⚠️ (NOT 5V)','Servo Signal → D9','Green LED → D6','Red LED → D7','Buzzer → D8'],
    tips:['RC522 uses 3.3V power, but 5V tolerant logic pins.','Store authorized UID tags in a code array.'],
  },
  cnc: {
    keywords:['cnc','3d printer','plotter','drawing robot','stepper machine'],
    title:'⚙️ CNC Plotter / 3D Printer (Basic)',
    components:['Arduino Uno','CNC Shield (A4988 Drivers)','3× NEMA17 Stepper Motors','12V 5A Power Supply'],
    wiringLines:['Mount CNC Shield on top of Arduino Uno','Insert A4988 drivers into X, Y, Z slots','Connect NEMA17 4-wire cables to shield pins (A1,A2,B1,B2)','Connect 12V Supply to CNC Shield Power Terminals'],
    tips:['Make sure A4988 driver orientation is correct before powering!','Adjust current limit potentiometer on drivers.','Install GRBL firmware on Arduino to parse G-code.'],
  },
  smart_clock: {
    keywords:['clock','smart clock','matrix clock','time display'],
    title:'⏰ LED Matrix Smart Clock',
    components:['ESP8266 / ESP32','4-in-1 MAX7219 LED Matrix (32x8)','DS3231 RTC (Optional if using NTP WiFi time)'],
    wiringLines:['MAX7219 VCC → 5V','MAX7219 GND → GND','MAX7219 DIN → MOSI (D11 / GPIO23)','MAX7219 CS → D10 / GPIO5','MAX7219 CLK → SCK (D13 / GPIO18)','DS3231 SDA → I2C SDA','DS3231 SCL → I2C SCL'],
    tips:['Since ESP32 has WiFi, you can get exact time via NTP instead of an RTC!','Use MD_Parola library for scrolling text animations.'],
  }
};

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQ = [
  {keys:['pull up','pullup'],            answer:`**Pull-up Resistor** — holds signal HIGH by default:\n- Between VCC and signal pin\n- Value: **10kΩ** (or use \`INPUT_PULLUP\` mode — no resistor needed)\n- Required: I2C (SDA/SCL), DHT22 data, buttons`},
  {keys:['pull down','pulldown'],        answer:`**Pull-down Resistor** — holds signal LOW by default:\n- Between signal pin and GND\n- Value: **10kΩ**\n- Use when button pressed = HIGH logic`},
  {keys:['voltage divider','divider'],   answer:`**Voltage Divider** — reduces voltage:\n\`Vout = Vin × R2/(R1+R2)\`\n\n**5V → 3.3V:** R1=1kΩ, R2=2kΩ\nVout = 5×2000/3000 = **3.33V ✅**\n\nUse to protect 3.3V ESP32 pins from 5V sensors.`},
  {keys:['common ground','gnd','ground'],answer:`**Common Ground Rule** — most important in electronics!\n\nAll components MUST share GND:\n- MCU GND ↔ Motor driver GND ↔ Battery (−) ↔ All sensor GNDs\n\nWithout it: nothing works, random readings, damage.`},
  {keys:['i2c','sda scl'],              answer:`**I2C Protocol** — 2-wire bus:\n\n| Board | SDA | SCL |\n|---|---|---|\n| Arduino Uno/Nano | A4 | A5 |\n| Arduino Mega | Pin 20 | Pin 21 |\n| ESP32 | GPIO21 | GPIO22 |\n| Raspberry Pi Pico | GP4 | GP5 |\n\n- Add **4.7kΩ pull-up** on SDA and SCL to VCC\n- Multiple devices share same SDA/SCL wires\n- Each device has unique I2C address`},
  {keys:['spi'],                        answer:`**SPI Protocol** — 4-wire fast bus:\n- MOSI (data out), MISO (data in), SCK (clock), CS/SS (select)\n- Arduino Uno: MOSI=D11, MISO=D12, SCK=D13, SS=D10\n- ESP32: MOSI=GPIO23, MISO=GPIO19, SCK=GPIO18, SS=GPIO5`},
  {keys:['uart','serial','baud'],       answer:`**UART (Serial)** — cross-connect TX/RX:\n- Device A **TX** → Device B **RX**\n- Device A **RX** → Device B **TX**\n\n⚠️ 5V TX → 3.3V RX needs voltage divider!\nCommon baud rates: 9600, 115200`},
  {keys:['pwm'],                        answer:`**PWM** — simulates analog output:\n- Arduino Uno pins: **D3, D5, D6, D9, D10, D11**\n- ESP32: most GPIOs support PWM\n- \`analogWrite(pin, 0-255)\`\n- Used for: LED brightness, motor speed, servo angle`},
  {keys:['resistor','colour code','color code'],answer:`**Common Resistor Values:**\n| Value | Colour Code |\n|---|---|\n| 100Ω | Brown-Black-Brown |\n| 220Ω | Red-Red-Brown |\n| 330Ω | Orange-Orange-Brown |\n| 1kΩ | Brown-Black-Red |\n| 4.7kΩ | Yellow-Violet-Red |\n| 10kΩ | Brown-Black-Orange |`},
  {keys:['flyback','back emf','back-emf'],answer:`**Flyback Diode** — protects MCU from motor/relay voltage spikes:\n- 1N4007 diode connected across motor terminals\n- Cathode (striped end) → Motor (+)\n- Anode → Motor (−)\n- Without it: voltage spike can damage Arduino`},
  {keys:['capacitor','decoupling'],     answer:`**Decoupling Capacitor** — filters power noise:\n- **100nF ceramic** — near IC power pins (VCC to GND)\n- **1000µF electrolytic** — near motor/NeoPixel power input\n⚠️ Electrolytic caps are polarized — long leg to (+)`},
  {keys:['difference between','vs','compare'],answer:`Ask me more specifically:\n- *"Arduino vs ESP32"* — I'll compare them\n- *"L298N vs L293D"* — motor driver comparison\n- *"DHT11 vs DHT22"* — sensor comparison`},
  {keys:['what is esp32','about esp32'],answer:`**ESP32** — WiFi+Bluetooth microcontroller:\n- CPU: Dual-core 240MHz\n- RAM: 520KB SRAM\n- Built-in **WiFi 802.11 b/g/n** and **Bluetooth 4.2**\n- GPIO voltage: **3.3V** (5V tolerant on some pins)\n- I2C: GPIO21/22 · SPI: GPIO23/19/18\n- PWM: most GPIO pins`},
  {keys:['what is arduino','about arduino'],answer:`**Arduino Uno** — beginner microcontroller:\n- CPU: ATmega328P @ 16MHz\n- 14 digital pins, 6 analog pins (A0–A5)\n- PWM: D3, D5, D6, D9, D10, D11\n- I2C: A4 (SDA), A5 (SCL)\n- Operating voltage: **5V**`},
  {keys:['what is a relay','relay switch'],answer:`**Relay** — an electromechanical switch:\n- Uses a small electromagnet (MCU 5V signal) to close a physical switch.\n- Used to control **High Voltage/High Current** (like 120V AC lamps, 12V motors) using a 5V MCU.\n- Always use a relay module with a built-in transistor and flyback diode to protect the MCU.`},
  {keys:['adc','analog to digital'],answer:`**ADC (Analog-to-Digital Converter)**:\n- Converts a continuous voltage (0–5V) into a digital number (e.g., 0–1023 on Arduino).\n- Used for reading sensors like potentiometers, light sensors (LDR), and soil moisture.\n- External ADCs like **ADS1115** offer 16-bit precision over I2C.`},
  {keys:['dac','digital to analog'],answer:`**DAC (Digital-to-Analog Converter)**:\n- Converts digital numbers into continuous physical voltage levels.\n- True analog output, unlike PWM which just turns on/off fast.\n- ESP32 has 2 built-in DACs (GPIO25, GPIO26). Arduino Uno has NO DACs (must use I2C MCP4725 module).`},
  {keys:['shift register','74hc595'],answer:`**Shift Register (74HC595)**:\n- Takes serial data (1 bit at a time) and turns it into parallel output (8 pins).\n- Expands MCU pins: Control 8 LEDs using only **3 MCU pins** (Data, Clock, Latch).\n- Can be daisy-chained! Two 74HC595s can control 16 LEDs with those same 3 MCU pins.`},
  {keys:['arduino vs esp32'],answer:`**Arduino vs ESP32:**\n- **Arduino (Uno)**: 16MHz, 5V logic, no wireless, very beginner friendly, robust.\n- **ESP32**: 240MHz (15x faster), 3.3V logic, built-in WiFi + Bluetooth, tons of memory, best for IoT/Smart Home projects.`},
  {keys:['l298n vs l293d'],answer:`**L298N vs L293D (Motor Drivers):**\n- **L298N**: Larger module with a huge heatsink. Can handle up to **2A per motor**. Best for robot cars.\n- **L293D**: Smaller IC chip. Can only handle **600mA per motor**. Best for tiny toy motors.`},
  {keys:['dht11 vs dht22'],answer:`**DHT11 vs DHT22 (Temp/Humidity):**\n- **DHT11**: Blue color, cheaper, 0-50°C range, ±2°C accuracy. Good for basics.\n- **DHT22**: White color, slightly pricier, -40 to 80°C range, ±0.5°C accuracy. Much better for real projects.`},
  {keys:['stepper vs servo vs dc','motor differences'],answer:`**Motor Differences:**\n- **DC Motor**: Spins continuously when powered. Speed controlled via PWM.\n- **Servo Motor**: Rotates to a specific angle (e.g., 0° to 180°). Used for robot arms, steering.\n- **Stepper Motor**: Rotates in exact tiny steps. Perfect for 3D printers and CNC machines where precision is needed.`},
  {keys:['calculate led resistor','resistor calculator'],answer:`**LED Resistor Calculation:**\n\`R = (V_supply - V_led) / I_led\`\n\nExample for Red LED (2V, 20mA) on Arduino (5V):\n\`R = (5V - 2V) / 0.020A = 150Ω\`\n\nA **220Ω** or **330Ω** resistor is the standard safe choice.`},
];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN AI CLASS
// ═══════════════════════════════════════════════════════════════════════════════
export class CircuitChatAI {
  constructor() { this.history = []; }

  _getPlaced() {
    try {
      if (typeof document === 'undefined') return [];
      const r = [];
      document.querySelectorAll('.placed-component').forEach(el => { if (el.dataset?.componentId) r.push(el.dataset.componentId); });
      return [...new Set(r)];
    } catch(e) { return []; }
  }

  _findComps(msg) {
    const low = msg.toLowerCase(), found = [];
    for (const a of ALIASES) {
      let added = false;
      for (const n of a.names) {
        // Look for number words or digits before the component name (e.g., "3 led", "two servos")
        const safeName = n.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`(?:(\\d+)|(two|three|four|five|six|seven|eight|nine|ten))\\s+${safeName}`, 'i');
        const match = low.match(regex);
        if (match) {
          let count = parseInt(match[1]);
          if (isNaN(count)) {
            const wordMap = {two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10};
            count = wordMap[match[2].toLowerCase()];
          }
          count = Math.min(10, count); // max 10 of same component
          for (let i = 0; i < count; i++) found.push(a.id);
          added = true;
          break;
        }
      }
      if (!added && a.names.some(n => low.includes(n))) {
        found.push(a.id);
      }
    }
    return found;
  }

  _isMCU(id) { return ['arduino','esp32','esp8266','pico','stm32','attiny','teensy','microbit'].some(k => id.includes(k)); }

  _getMCU(comps, placed = []) {
    const all = [...comps, ...placed];
    for (const k of ['esp32','pico','mega','nano','leonardo','due','stm32','attiny','teensy','microbit','arduino']) {
      const f = all.find(id => id.includes(k));
      if (f) return f;
    }
    return 'arduino-uno';
  }

  _buildTable(compId, mcuId) {
    let key = WIRING[compId] ? compId : null;
    if (!key) key = Object.keys(WIRING).find(k => compId.includes(k.split('-')[0]) || k === compId.replace(/-\d+.*$/,'') || compId.startsWith(k));
    if (!key) return null;
    const def = WIRING[key](mcuId);
    if (!def) return null;
    const mcuName = mcuLabel(mcuId);
    let out = `### 🔌 ${def.title}\n*Controller: **${mcuName}***\n\n`;
    out += `| Component Pin | ${mcuName} Pin |\n|---|---|\n`;
    def.rows.forEach(r => { out += `| ${r[0]} | ${r[1]} |\n`; });
    if (def.note) out += `\n${def.note}`;
    if (def.code && def.code.trim()) out += `\n\n**Sample Code:**\n\`\`\`cpp\n${def.code}\n\`\`\``;
    return out;
  }

  _buildPlan(comps, mcuId) {
    const mcuName = mcuLabel(mcuId);
    const sensors = comps.filter(id => !this._isMCU(id));
    if (!sensors.length) return null;
    let out = `## 🛠️ Full Wiring Plan — ${mcuName}\n*(${sensors.length} component${sensors.length>1?'s':''})*\n\n`;
    const found = [], notFound = [];
    
    // Enable dynamic pin allocation
    pinAllocator = new Set();
    
    sensors.forEach((id, idx) => {
      let key = WIRING[id] ? id : null;
      if (!key) key = Object.keys(WIRING).find(k => id.includes(k.split('-')[0])||id.startsWith(k));
      if (!key) { notFound.push(id); return; }
      
      const def = WIRING[key](mcuId);
      if (!def) { notFound.push(id); return; }
      found.push(id);
      
      const totalCount = sensors.filter(s => s === id).length;
      let title = def.title;
      if (totalCount > 1) {
        const occurrence = sensors.slice(0, idx).filter(s => s === id).length + 1;
        title += ` (#${occurrence})`;
      }
      
      out += `---\n### ${title}\n| Pin | Connect To |\n|---|---|\n`;
      def.rows.forEach(r => { out += `| **${r[0]}** | ${r[1]} |\n`; });
      if (def.note) out += `\n${def.note}\n\n`;
    });
    
    // Cleanup dynamic allocator
    pinAllocator = null;
    
    out += `---\n### ⚡ Power Summary\n- All **GND** → ${mcuName} GND (common ground rail)\n- **5V** devices → ${mcuName} 5V\n- **3.3V** devices (OLED, BMP280, MPU6050, nRF24) → ${mcuName} 3.3V\n- **I2C** devices share same SDA + SCL wires\n`;
    if (notFound.length) out += `\n⚠️ No wiring data yet for: ${notFound.join(', ')}`;
    return out;
  }

  respond(msg) {
    if (!msg?.trim()) return 'Ask me anything about your circuit! 😊';
    const low = msg.toLowerCase();
    const placed = this._getPlaced();
    const comps  = this._findComps(msg);
    const mcuId  = this._getMCU(comps, placed);
    this.history.push({role:'user',text:msg});
    let res = '';

    // 1. Greeting
    if (/^(hi|hello|hey|sup|yo|howdy|what'?s up|good\s*(morning|afternoon|evening))/i.test(msg)) {
      res = `Hey! 👋 I'm **TinkerAI** — your built-in circuit expert.\n\nI know wiring for **184 components** — every sensor, display, motor, wireless module, and IC in TinkerAI!\n\nTry:\n🔌 *"Connect ESP32 to LCD and DHT22"*\n🚗 *"Make a robot car"*\n📋 *"Connect nRF24L01 to Arduino"*\n🔧 *"My motor is not working"*\n📚 *"What is I2C?"*\n\n${placed.length>0?`I see **${placed.length} component(s)** on your canvas!`:'Drag components onto the canvas, then ask me to wire them!'}`;
    }

    // 2. Canvas query
    else if (/canvas|placed|what.?s on|my circuit|what do i have/i.test(low)) {
      if (!placed.length) { res = `Your canvas is empty. Drag some components from the right panel!`; }
      else {
        res = `**On your canvas (${placed.length} components):**\n`;
        placed.forEach((id,i)=>{ const a=ALIASES.find(e=>e.id===id||id.includes(e.id.split('-')[0])); res+=`${i+1}. ${a?a.names[0]:id}\n`; });
        res += `\nTry: *"Connect all of these"* or *"Wire everything"*`;
      }
    }

    // 3. System design
    else if (/make|build|create|design|project|system/i.test(low)) {
      let sys = null;
      for (const s of Object.values(SYSTEMS)) { if (s.keywords.some(k=>low.includes(k))) { sys=s; break; } }
      if (sys) {
        res = `## ${sys.title}\n\n### 📦 Components:\n`;
        sys.components.forEach((c,i)=>{ res+=`${i+1}. ${c}\n`; });
        res += `\n### 🔌 Wiring:\n`;
        sys.wiringLines.forEach(l=>{ res+=`- ${l}\n`; });
        if (sys.tips?.length) { res+=`\n### 💡 Tips:\n`; sys.tips.forEach(t=>{ res+=`- ${t}\n`; }); }
        if (sys.code) res += `\n### 📝 Code:\n\`\`\`cpp\n${sys.code}\n\`\`\``;
      } else if (comps.length) {
        res = this._buildPlan(comps, mcuId) || `What would you like to make? Try: "Make a robot car", "Make a weather station", "Make an alarm system".`;
      } else {
        res = `I can design:\n🚗 *"Make a robot car"*\n🌤️ *"Make a weather station"*\n🚨 *"Make an alarm system"*\n🌱 *"Make a plant watering system"*\n🏠 *"Make a smart home controller"*\n📏 *"Make a line follower robot"*`;
      }
    }

    // 4. Wire all canvas components
    else if (/wire all|connect all|connect everything|connect them|connect these/i.test(low)) {
      if (placed.length) res = this._buildPlan(placed, mcuId) || `Add a microcontroller and sensors to your canvas first!`;
      else res = `Your canvas is empty — drag some components first!`;
    }

    // 5. Multi-component (3+)
    else if (comps.length>=3 && /connect|wire|wiring|how|attach|pin/i.test(low)) {
      res = this._buildPlan(comps, mcuId) || `Couldn't find wiring for all those — try one at a time.`;
    }

    // 6. Two-component
    else if (comps.length===2 && /connect|wire|attach|hook|how|pin/i.test(low)) {
      const sensor = this._isMCU(comps[0]) ? comps[1] : comps[0];
      const mcu    = this._isMCU(comps[0]) ? comps[0] : comps[1];
      res = this._buildTable(sensor, mcu) || this._buildPlan([sensor,mcu], mcu) || `No wiring data found for that combination.`;
    }

    // 7. Single component
    else if (comps.length===1 && /connect|wire|pin|how|attach|use|wiring/i.test(low)) {
      const note = placed.length>0 ? `*(Canvas: **${mcuLabel(mcuId)}** detected)*\n\n` : '';
      res = note + (this._buildTable(comps[0], mcuId) || `No specific wiring data for **${comps[0]}** yet.`);
    }

    // 8. Component mentioned without action
    else if (comps.length===1) {
      res = this._buildTable(comps[0], mcuId) || `Ask: *"How do I connect ${comps[0]} to Arduino?"*`;
    }

    // 9. FAQ / concepts
    else {
      for (const f of FAQ) { if (f.keys.some(k=>low.includes(k))) { res=f.answer; break; } }

      // System keyword without make
      if (!res) for (const s of Object.values(SYSTEMS)) { if (s.keywords.some(k=>low.includes(k))) { res=`## ${s.title}\n\n${s.wiringLines.map(l=>'- '+l).join('\n')}\n\n**Code:**\n\`\`\`cpp\n${s.code}\n\`\`\``; break; } }

      // Troubleshoot
      if (!res && /not work|doesn.?t|wrong|broken|problem|issue|error|fix|why|fail|help/i.test(low)) {
        if (/motor|l298|car|wheel/i.test(low))          res=`**Motor/L298N Fix:**\n1. ✅ Battery on **VIN** (not 5V out)?\n2. ✅ **Common GND** between MCU and L298N?\n3. ✅ ENA+ENB HIGH or jumpers on?\n4. ✅ IN1/IN2 not both HIGH at once?\n5. ✅ Pin numbers match code?`;
        else if (/led|light/i.test(low))                res=`**LED Fix:**\n1. ✅ **Resistor** present? (220Ω min)\n2. ✅ Polarity? Long leg = (+)\n3. ✅ Pin is OUTPUT?\n4. ✅ Common GND?\n5. ✅ Try pin 13 (built-in LED) first`;
        else if (/sensor|dht|reading|nan|value/i.test(low)) res=`**Sensor Fix:**\n1. ✅ Correct voltage (3.3V vs 5V)?\n2. ✅ Pull-up resistor on data pin?\n3. ✅ Library installed?\n4. ✅ Correct pin in code?\n5. ✅ Some need warm-up (PIR=30s, MQ=30s)`;
        else if (/bluetooth|hc.?05/i.test(low))         res=`**Bluetooth Fix:**\n1. ✅ TX/RX cross-connected (A TX→B RX)?\n2. ✅ Voltage divider on RX (5V→3.3V)?\n3. ✅ Baud rate matches (9600)?\n4. ✅ LED blinks = not paired, blinks fast = ready`;
        else if (/wifi|esp32|connect/i.test(low))       res=`**WiFi Fix:**\n1. ✅ Correct SSID+password?\n2. ✅ 2.4GHz network (not 5GHz)?\n3. ✅ Power supply ≥500mA?\n4. ✅ Check Serial Monitor output`;
        else if (/display|lcd|oled|screen/i.test(low))  res=`**Display Fix:**\n1. ✅ Correct I2C address? (0x27/0x3F for LCD, 0x3C for OLED)\n2. ✅ SDA/SCL to correct pins?\n3. ✅ Library installed?\n4. ✅ LCD: adjust contrast potentiometer on I2C backpack\n5. ✅ Run I2C scanner sketch to find address`;
        else                                             res=`**General Fix:**\n1. ✅ All components share **GND**?\n2. ✅ Correct voltage on VCC?\n3. ✅ Pin numbers match code?\n4. ✅ 3.3V vs 5V levels correct?\n5. ✅ Add \`Serial.println()\` to debug`;
      }

      // 10. Chit-chat & Conversational Intents
      if (!res) {
        if (/\b(thanks|thank you|awesome|perfect|good|great|got it|ok|okay|yes|cool|nice)\b/i.test(low)) {
          res = `You're very welcome! Let me know if you want to wire anything else or need help troubleshooting. 🚀`;
        } else if (/\b(wrong|not this|misunderstood|no|bad|incorrect|stupid|fail)\b/i.test(low)) {
          res = `I apologize if I misunderstood! Please try specifying the exact component name (like "red led" or "L298N motor driver"), and I'll pull the right wiring plan for you.`;
        } else if (/\b(who are you|what are you|are you ai|your name)\b/i.test(low)) {
          res = `I am **TinkerAI**, your fully offline, self-contained AI assistant! I don't use any external APIs. Instead, my brain contains the exact physical wiring logic, physics, and pinouts for 184 different electronics components.`;
        } else if (/\b(what can you do|how to use|help|what do you do)\b/i.test(low)) {
          res = `**Here is what I can do for you:**\n1. **Wire Components:** Ask me to connect any of the 184 components.\n2. **Design Systems:** Ask me to *"Make a smart car"* or *"Make a weather station"*.\n3. **Troubleshoot:** Tell me *"My motor isn't working"* and I'll help you fix it.\n4. **Explain:** Ask me *"What is I2C?"* or *"What does a pull-up resistor do?"*`;
        } else if (/\b(code|program|script|c\+\+|python|arduino ide)\b/i.test(low)) {
          res = `Whenever you ask me to wire a specific component, I will automatically generate the **C++ Sample Code** for it below the wiring table!`;
        } else if (/\b(you are|you're)\b/i.test(low)) {
          res = `I try my best! 😊 As a local AI, my focus is purely on getting your physical circuits wired correctly.`;
        } else if (/\b(can you)\b/i.test(low)) {
          res = `If it involves wiring microcontrollers, sensors, displays, or motors — yes, I absolutely can! Just name the components.`;
        } else if (/\b(why|how come|explain)\b/i.test(low)) {
          res = `In electronics, things usually follow strict rules for power (Voltage/Current) and data (I2C, SPI, UART, Analog, Digital). If something is confusing, try asking me about the specific concept, like *"What is PWM?"*`;
        } else if (/\b(fuck|shit|damn|crap)\b/i.test(low)) {
          res = `Electronics can be frustrating, I know! 😅 Take a deep breath. Check your ground wires, check your power supply, and let me know exactly which component isn't working.`;
        }
      }

      // 11. Component intent fallback - if components mentioned but no verb used
      if (!res && comps.length >= 2) {
        res = this._buildPlan(comps, mcuId) || `No wiring data found for that combination.`;
      }

      if (!res) {
        if (placed.length) {
          const names = placed.slice(0,3).map(id=>{const a=ALIASES.find(e=>e.id===id);return a?a.names[0]:id;});
          res = `I see **${names.join(', ')}** on your canvas.\n\nTry:\n- *"Connect all components"*\n- *"Connect ${placed[0]} to ${placed[1]||'Arduino'}"*\n- *"What is I2C?"*`;
        } else {
          res = `I'm not quite sure I understand! 😅\n\nI'm **TinkerAI** — I know wiring for all 184 components!\n\nTry:\n- 🔌 *"Connect ESP32 to OLED and DHT22"*\n- 🚗 *"Make a robot car"*\n- ❓ *"What is SPI?"*\n- 🔧 *"My sensor is not working"*`;
        }
      }
    }

    this.history.push({role:'ai',text:res});
    return res;
  }
}

export const circuitChatAI = new CircuitChatAI();
