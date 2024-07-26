import { computed, signal } from '@preact/signals-react';
import './App.css';
import GameView from "./views/GameView.js";
import StartView from './views/StartView.js';
import InvalidScreen from './components/InvalidScreen.js';
import { useEffect } from 'react';
import SettingsView from './views/SettingsView.js';
import GamePad from './components/GamePad.js';

import { soundMaster, soundKeyboard } from './components/settings/Sound.js';

import { keyMap } from './components/settings/Controls.js';

let stratagemsData = [];
import("./media/stratagemsData.js").then((module) => {
  stratagemsData = module.default;
  // Preload stratagem images
  for (let stratagem of stratagemsData) {
    let url = process.env.PUBLIC_URL + "/media/stratagems/" + stratagem.name + ".svg"
    let img = new Image();
    img.src = url;
  }
}).catch((error) => {
  console.error("Error loading stratagemsData.js: " + error);
});

export const keyPressedUnfiltered = signal("");

function App(props) {
  console.log("Rendering App");
  const mainScreenString = signal("start");
  let keyPressed = signal("");

  let keyBlockedUp = signal(false);
  let keyBlockedDown = signal(false);
  let keyBlockedRight = signal(false);
  let keyBlockedLeft = signal(false);

  function playKeySound() {
    let audio = new Audio(process.env.PUBLIC_URL + "/media/sounds/keyInput.ogg");
    setTimeout(() => { audio.volume = (soundMaster.value / 10) * (soundKeyboard / 10) }, 0); // Delay to make sure the volume is set (hacky js fix)
    audio.play();
  }

  window.addEventListener('keydown', function (event) {
    keyPressedUnfiltered.value = event.key;

    switch (event.key) {
      case "ArrowUp":
        if (keyBlockedUp.value) return;
        keyPressed.value = "up";
        keyBlockedUp.value = true;
        playKeySound();
        return;
      case "ArrowDown":
        if (keyBlockedDown.value) return;
        keyPressed.value = "down";
        keyBlockedDown.value = true;
        playKeySound();
        return;
      case "ArrowRight":
        if (keyBlockedRight.value) return;
        keyPressed.value = "right";
        keyBlockedRight.value = true;
        playKeySound();
        return;
      case "ArrowLeft":
        if (keyBlockedLeft.value) return;
        keyPressed.value = "left";
        keyBlockedLeft.value = true;
        playKeySound();
        return;
      default:
        break;
    }

    let entries = Object.entries(keyMap);
    for (let i = 0; i < entries.length; i++) {
      if (entries[i][1].value === event.key) {
        switch (entries[i][0]) {
          case "up":
            if (keyBlockedUp.value) return;
            keyPressed.value = "up";
            keyBlockedUp.value = true;
            break;
          case "down":
            if (keyBlockedDown.value) return;
            keyPressed.value = "down";
            keyBlockedDown.value = true;
            break;
          case "right":
            if (keyBlockedRight.value) return;
            keyPressed.value = "right";
            keyBlockedRight.value = true;
            break;
          case "left":
            if (keyBlockedLeft.value) return;
            keyPressed.value = "left";
            keyBlockedLeft.value = true;
            break;
          default:
            return;
        }
        playKeySound();
        return;
      }
    }
  });

  window.addEventListener('keyup', function (event) {

    switch (event.key) {
      case "ArrowUp":
        keyBlockedUp.value = false;
        return;
      case "ArrowDown":
        keyBlockedDown.value = false;
        return;
      case "ArrowRight":
        keyBlockedRight.value = false;
        return;
      case "ArrowLeft":
        keyBlockedLeft.value = false;
        return;
      default:
        break;
    }

    let entries = Object.entries(keyMap);
    for (let i = 0; i < entries.length; i++) {
      if (entries[i][1].value === event.key) {
        keyPressed.value = "";
        switch (entries[i][0]) {
          case "up":
            keyBlockedUp.value = false;
            break;
          case "down":
            keyBlockedDown.value = false;
            break;
          case "right":
            keyBlockedRight.value = false;
            break;
          case "left":
            keyBlockedLeft.value = false;
            break;
          default:
            return;
        }
        return;
      }
    }
  });


  let screen = computed(() => {
    switch (mainScreenString.value.split(" ")[0]) {
      case "start":
        return <StartView mainScreenString={mainScreenString} keyPressed={keyPressed} />;
      case "game":
        return <GameView mainScreenString={mainScreenString} keyPressed={keyPressed} stratagemsData={stratagemsData} />;
      case "settings":
        return <SettingsView mainScreenString={mainScreenString} keyPressed={keyPressed} />;
      default:
        return <InvalidScreen />;
    }
  });

  useEffect(() => {
    return () => {
      console.log("Unmounting App");
    }
  }, []);

  return (
    <div className="App">
      <GamePad keyPressed={keyPressed} keyPressedUnfiltered={keyPressedUnfiltered} keyBlockedDown={keyBlockedDown} keyBlockedLeft={keyBlockedLeft} keyBlockedRight={keyBlockedRight} keyBlockedUp={keyBlockedUp} />
      <div className="BackgroundImage" />

      <div className="whiteLine top"></div>
      {screen}
      <div className="whiteLine bottom"></div>
      <div className='crt'></div>


    </div>
  );
}

export default App;
