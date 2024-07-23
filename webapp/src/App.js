import { computed, effect, signal } from '@preact/signals-react';
import './App.css';
import GameView from "./views/GameView.js";
import StartView from './views/StartView.js';
import InvalidScreen from './components/InvalidScreen.js';
import { useEffect } from 'react';
import SettingsView from './views/SettingsView.js';
import BrowserVersion from './components/BrowserVersion.js';

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

  let keyBlockedUp = false;
  let keyBlockedDown = false;
  let keyBlockedRight = false;
  let keyBlockedLeft = false;

  function playKeySound() {
    let audio = new Audio(process.env.PUBLIC_URL + "/media/sounds/keyInput.ogg");
    setTimeout(() => { audio.volume = (soundMaster.value / 10) * (soundKeyboard / 10) }, 0); // Delay to make sure the volume is set (hacky js fix)
    audio.play();
  }

  window.addEventListener('keydown', function (event) {
    keyPressedUnfiltered.value = event.key;

    switch (event.key) {
      case "ArrowUp":
        if (keyBlockedUp) return;
        keyPressed.value = "up";
        keyBlockedUp = true;
        playKeySound();
        return;
      case "ArrowDown":
        if (keyBlockedDown) return;
        keyPressed.value = "down";
        keyBlockedDown = true;
        playKeySound();
        return;
      case "ArrowRight":
        if (keyBlockedRight) return;
        keyPressed.value = "right";
        keyBlockedRight = true;
        playKeySound();
        return;
      case "ArrowLeft":
        if (keyBlockedLeft) return;
        keyPressed.value = "left";
        keyBlockedLeft = true;
        playKeySound();
        return;
    }

    let entries = Object.entries(keyMap);
    for (let i = 0; i < entries.length; i++) {
      if (entries[i][1].value === event.key) {
        switch (entries[i][0]) {
          case "up":
            if (keyBlockedUp) return;
            keyPressed.value = "up";
            keyBlockedUp = true;
            break;
          case "down":
            if (keyBlockedDown) return;
            keyPressed.value = "down";
            keyBlockedDown = true;
            break;
          case "right":
            if (keyBlockedRight) return;
            keyPressed.value = "right";
            keyBlockedRight = true;
            break;
          case "left":
            if (keyBlockedLeft) return;
            keyPressed.value = "left";
            keyBlockedLeft = true;
            break;
        }
        playKeySound();
        return;
      }
    }
  });

  window.addEventListener('keyup', function (event) {

    switch (event.key) {
      case "ArrowUp":
        keyBlockedUp = false;
        return;
      case "ArrowDown":
        keyBlockedDown = false;
        return;
      case "ArrowRight":
        keyBlockedRight = false;
        return;
      case "ArrowLeft":
        keyBlockedLeft = false;
        return;
    }

    let entries = Object.entries(keyMap);
    for (let i = 0; i < entries.length; i++) {
      if (entries[i][1].value === event.key) {
        keyPressed.value = "";
        switch (entries[i][0]) {
          case "up":
            keyBlockedUp = false;
            break;
          case "down":
            keyBlockedDown = false;
            break;
          case "right":
            keyBlockedRight = false;
            break;
          case "left":
            keyBlockedLeft = false;
            break;
        }
        return;
      }
    }
  });


  let screen = computed(() => {
    switch (mainScreenString.value.split(" ")[0]) {
      case "start":
        return <StartView mainScreenString={mainScreenString} keyPressed={keyPressed} />;
      //return <BrowserVersion />;
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
      <div className="BackgroundImage" />
      <div className="whiteLine top"></div>
      {screen}
      <div className="whiteLine bottom"></div>

    </div>
  );
}

export default App;
