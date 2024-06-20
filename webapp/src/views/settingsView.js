import { computed, effect, signal } from "@preact/signals-react";
import "./SettingsView.css"
import { useEffect } from "react";
import About from "../components/settings/About";
import InvalidScreen from "../components/InvalidScreen";
import MultipleArrowContainer from "../components/MultipleArrowContainer";
import MultipleArrowSubscriber from "../components/MultipleArrowSubscriber";
import Difficulty from "../components/settings/Difficulty";
import Controls from "../components/settings/Controls";
import Bloom from "../components/settings/Bloom";
import Data from "../components/settings/Data";

function SettingsView(props) {
  console.log("Rendering SettingsView");
  let keyPressed = props.keyPressed;
  let mainScreenString = props.mainScreenString;
  let settingsScreenString = signal("ABOUT");
  let blockNavigation = signal(false);

  let arrowData = [
    {
      "success": "BACK",
      "code": ["up", "down", "right", "left", "up"],
      "show": signal(true),
      "img": process.env.PUBLIC_URL + "/media/stratagems/Reinforce.svg",
      "color": "SettingsViewNavbarYellow"
    }, {
      "success": "DIFFICULTY",
      "code": ['down', 'up', 'left', 'down', 'up', 'right', 'down', 'up'],
      "show": signal(true),
      "img": process.env.PUBLIC_URL + "/media/stratagems/Hellbomb.svg",
      "color": "SettingsViewNavbarYellow"
    }, {
      "success": "CONTROLS",
      "code": ['down', 'up', 'up', 'down', 'up'],
      "show": signal(true),
      "img": process.env.PUBLIC_URL + "/media/stratagems/Jump Pack.svg",
      "color": "SettingsViewNavbarBlue"
    }, {
      "success": "BLOOM",
      "code": ['right', 'down', 'left', 'up', 'up'],
      "show": signal(true),
      "img": process.env.PUBLIC_URL + "/media/stratagems/Orbital Laser.svg",
      "color": "SettingsViewNavbarRed"
    }, {
      "success": "DATA",
      "code": ['up', 'right', 'down', 'down', 'down'],
      "show": signal(true),
      "img": process.env.PUBLIC_URL + "/media/stratagems/Eagle 500KG Bomb.svg",
      "color": "SettingsViewNavbarRed"
    }, {
      "success": "ABOUT",
      "code": ['up', 'down', 'right', 'up'],
      "show": signal(true),
      "img": process.env.PUBLIC_URL + "/media/stratagems/SOS Beacon.svg",
      "color": "SettingsViewNavbarYellow"
    }
  ];

  let mac = new MultipleArrowContainer(arrowData, settingsScreenString);

  let dispose = effect(() => {
    if (keyPressed.value != "") {
      if (!blockNavigation.peek()) {
        mac.handleKeyPressed(keyPressed.value);
        keyPressed.value = "";
      }
    }
  });

  let dispose2 = effect(() => {
    if (!blockNavigation.value) {
      mac.reset(true);
    }
  });


  let renderSettingsNavBar = computed(() => {
    let stratagemsSettings = [];
    for (let i = 0; i < arrowData.length; i++) {
      stratagemsSettings.push(
        <div className="SettingsViewNavbarStratagem" key={i}>
          <img className={"SettingsViewNavbarImage " + arrowData[i].color} src={arrowData[i].img} alt={arrowData[i].success} />
          <div className="SettingsViewNavbarContent">
            <p className="SettingsViewNavbarTitle"> {arrowData[i].success}</p>
            <div className="SettingsViewNavbarArrows">
              <MultipleArrowSubscriber mac={mac} self={i} />
            </div>
          </div>
        </div>
      )
    }
    return stratagemsSettings;
  });

  let renderSettingsScreen = computed(() => {
    switch (settingsScreenString.value.split(" ")[0]) {
      case "BACK":
        mainScreenString.value = "start";
        break;
      case "DIFFICULTY":
        return <Difficulty />;
      case "CONTROLS":
        return <Controls />;
      case "BLOOM":
        blockNavigation.value = true;
        return <Bloom keyPressed={keyPressed} blockNavigation={blockNavigation} key={settingsScreenString.value} />;
      case "DATA":
        return <Data />;
      case "ABOUT":
        mac.reset(true);
        return <About />;
      default:
        return <InvalidScreen />;
    }
  });


  let renderWholeSettings = computed(() => {
    return (
      <div>
        <div className={"SettingsViewNavbar" + (blockNavigation.value ? " SettingsViewhidden" : "")}>
          {renderSettingsNavBar}
        </div>
        {renderSettingsScreen}
      </div>
    );
  });

  useEffect(() => {
    return () => {
      console.log("Unmounting SettingsView");
      dispose();
      dispose2();
    }
  }, []);


  return (
    <>
      {renderWholeSettings}
    </>
  );
}

export default SettingsView;