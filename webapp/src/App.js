import { computed, effect, signal } from '@preact/signals-react';
import './App.css';
import GameView from "./views/GameView.js";
import StartView from './views/StartView.js';
import InvalidScreen from './components/InvalidScreen.js';
import { useEffect } from 'react';
import SettingsView from './views/SettingsView.js';

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

let stratagemsData = [];
import("./media/stratagemsData.js").then((module) => {
  stratagemsData = module.default;
  // Preload stratagem images
  for (let stratagem of stratagemsData) {
    let url = process.env.PUBLIC_URL + "/media/stratagems/" + stratagem.name + ".svg"
    let img = new Image();
    img.src = url;
  }
});

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
    audio.play();
  }

  window.addEventListener('keydown', function (event) {
    switch (keyMap[event.key]) {
      case "up":
        if (keyBlockedUp) return;
        keyPressed.value = "up";
        keyBlockedUp = true;
        playKeySound();
        break;
      case "down":
        if (keyBlockedDown) return;
        keyPressed.value = "down";
        keyBlockedDown = true;
        playKeySound();
        break;
      case "right":
        if (keyBlockedRight) return;
        keyPressed.value = "right";
        keyBlockedRight = true;
        playKeySound();
        break;
      case "left":
        if (keyBlockedLeft) return;
        keyPressed.value = "left";
        keyBlockedLeft = true;
        playKeySound();
        break;
    }
  });

  window.addEventListener('keyup', function (event) {
    switch (keyMap[event.key]) {
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
  });

  navigator.sayswho = (function () {
    var ua = navigator.userAgent;
    var tem;
    var M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(' ');
  })();

  console.log(navigator.sayswho); // outputs: `Chrome 62`


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
      <div className="BackgroundImage" />
      <div className="whiteLine top"></div>
      {screen}
      <div className="whiteLine bottom"></div>

    </div>
  );
}

export default App;
