export function autoWire(projectName){

    const project =
    projectName.toLowerCase()

    if(project.includes("blink")){

        return {

            components:[

                "Arduino",
                "LED",
                "Resistor"

            ],

            connections:[

                {
                    from:"Arduino.D13",
                    to:"Resistor.pin1"
                },

                {
                    from:"Resistor.pin2",
                    to:"LED.anode"
                },

                {
                    from:"LED.cathode",
                    to:"Arduino.GND"
                }

            ]

        }
    }

    if(project.includes("ultrasonic")){

        return {

            components:[

                "Arduino",
                "HC-SR04",
                "Buzzer"
            ],

            connections:[

                {
                    from:"Arduino.D9",
                    to:"HC-SR04.TRIG"
                },

                {
                    from:"Arduino.D10",
                    to:"HC-SR04.ECHO"
                }

            ]

        }
    }

    return null
}