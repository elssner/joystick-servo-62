function fServo (pJoy: number) {
    if (i2c.between(pJoy, 496, 512)) {
        qwiicjoystick.comment("Ruhestellung soll 512 ist 498 auf 512 = 90° anpassen")
        return 90
    } else if (pJoy < 32) {
        qwiicjoystick.comment("Werte < 32 wie 0 behandeln (max links)")
        return 45
    } else if (pJoy > 991) {
        qwiicjoystick.comment("Werte > 991 wie 1023 behandeln (max rechts)")
        return 135
    } else {
        qwiicjoystick.comment("Werte von 32 bis 991 auf 46° bis 134° verteilen")
        return Math.round(Math.map(pJoy, 32, 991, 46, 134))
    }
}
function Konfiguration () {
    qwiicjoystick.comment("elssner/joystick-servo-62")
    qwiicjoystick.comment("calliope-net/i2c")
    qwiicjoystick.comment("calliope-net/lcd-16x2")
    qwiicjoystick.comment("calliope-net/joystick")
    qwiicjoystick.comment("Servo an C16")
}
let winkel = 0
let y = 0
let x = 0
let aJoy: number[] = []
lcd16x2rgb.initLCD(lcd16x2rgb.lcd16x2_eADDR(lcd16x2rgb.eADDR_LCD.LCD_16x2_x3E))
qwiicjoystick.beimStart(qwiicjoystick.qwiicjoystick_eADDR(qwiicjoystick.eADDR.Joystick_x20))
let xmin = 512
let xmax = 512
loops.everyInterval(100, function () {
    aJoy = qwiicjoystick.readArray(qwiicjoystick.qwiicjoystick_eADDR(qwiicjoystick.eADDR.Joystick_x20), qwiicjoystick.eBereich.A_0_1023)
    x = aJoy[1]
    lcd16x2rgb.writeText(lcd16x2rgb.lcd16x2_eADDR(lcd16x2rgb.eADDR_LCD.LCD_16x2_x3E), 0, 0, 3, x, lcd16x2rgb.eAlign.right)
    if (x > 0 && x < xmin) {
        xmin = x
        lcd16x2rgb.writeText(lcd16x2rgb.lcd16x2_eADDR(lcd16x2rgb.eADDR_LCD.LCD_16x2_x3E), 0, 4, 7, xmin, lcd16x2rgb.eAlign.right)
    } else if (x < 1023 && x > xmax) {
        xmax = x
        lcd16x2rgb.writeText(lcd16x2rgb.lcd16x2_eADDR(lcd16x2rgb.eADDR_LCD.LCD_16x2_x3E), 0, 9, 12, xmax, lcd16x2rgb.eAlign.right)
    }
    y = fServo(x)
    lcd16x2rgb.writeText(lcd16x2rgb.lcd16x2_eADDR(lcd16x2rgb.eADDR_LCD.LCD_16x2_x3E), 1, 0, 3, y, lcd16x2rgb.eAlign.right)
    if (y != winkel) {
        qwiicjoystick.comment("nur schreiben wenn Wert geändert")
        winkel = y
        pins.servoWritePin(AnalogPin.C16, winkel)
    }
})
