

function GamePad(props) {
    console.log("Rendering GamePad");
    let keyPressed = props.keyPressed;
    let keyPressedUnfiltered = props.keyPressedUnfiltered;
    let keyBlockedUp = props.keyBlockedUp;
    let keyBlockedDown = props.keyBlockedDown;
    let keyBlockedRight = props.keyBlockedRight;
    let keyBlockedLeft = props.keyBlockedLeft;

    const keyMap = {
        "up": [12, keyBlockedUp],
        "down": [13, keyBlockedDown],
        "left": [14, keyBlockedLeft],
        "right": [15, keyBlockedRight]
    }

    let gamepadIndex;

    if (navigator.getGamepads) {
        console.log("Game API supported");
    } else {
        console.log("Game API not supported");
        return null;
    }

    window.addEventListener("gamepadconnected", function (event) {
        gamepadIndex = event.gamepad.index;
        console.log("Gamepad connected at index: " + gamepadIndex);
        gameLoop();
    });

    window.addEventListener("gamepaddisconnected", function (event) {
        console.log("Gamepad disconnected from index: " + event.gamepad.index);
        gamepadIndex = undefined;
    });

    function gameLoop() {
        if (gamepadIndex !== undefined) {
            const gamepad = navigator.getGamepads()[gamepadIndex];

            for (let i = 0; i < Object.keys(keyMap).length; i++) {
                console.log(gamepad.buttons[12]);
                console.log(keyMap[Object.keys(keyMap)[i]][0]);
                console.log(gamepad.buttons[keyMap[Object.keys(keyMap)[i]][0]].pressed);
                if (gamepad.buttons[keyMap[Object.keys(keyMap)[i]][0]].pressed) {
                    if (!keyMap[Object.keys(keyMap)[i]][1].value) {
                        keyPressed.value = Object.keys(keyMap)[i];
                        keyMap[Object.keys(keyMap)[i]][1].value = true;
                        console.log("Pressed " + Object.keys(keyMap)[i]);
                    };
                } else {
                    keyMap[Object.keys(keyMap)[i]][1].value = false;
                }
            }

            // Example: Log the state of the left stick (axes 0 and 1)
            //const leftStickX = gamepad.axes[0];
            //const leftStickY = gamepad.axes[1];
            //console.log("Left Stick X: " + leftStickX + ", Y: " + leftStickY);

            // Repeat the game loop
            requestAnimationFrame(gameLoop);
        }
    }



    return null;
}

export default GamePad;


