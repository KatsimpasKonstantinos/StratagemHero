import { computed, effect, signal } from '@preact/signals-react';
import './App.css';
import GameView from "./views/GameView.js";
import StartView from './views/StartView.js';
import InvalidScreen from './components/InvalidScreen.js';
import { useEffect } from 'react';

const keyMap = {
  "ArrowUp": "up",
  "ArrowDown": "down",
  "ArrowRight": "right",
  "ArrowLeft": "left",
  "w": "up",
  "s": "down",
  "d": "right",
  "a": "left"
}

function App(props) {
  console.log("Rendering App");
  const mainScreenString = signal("start");
  let keyPressed = signal("");
  let keyBlocked = false;


  window.addEventListener('keydown', function (event) {
    if (!keyBlocked) {
      if (keyMap[event.key]) {
        keyBlocked = true;
        keyPressed.value = keyMap[event.key];
        let audio = new Audio(process.env.PUBLIC_URL + "/media/sounds/keyInput.ogg");
        audio.play();
      }
    }
  });

  window.addEventListener('keyup', function (event) {
    keyBlocked = false;
  });


  let screen = computed(() => {
    switch (mainScreenString.value) {
      case "start":
        return <StartView mainScreenString={mainScreenString} keyPressed={keyPressed} />;
      case "game":
        return <GameView mainScreenString={mainScreenString} keyPressed={keyPressed} />;
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
