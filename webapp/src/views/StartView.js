import { effect, signal } from '@preact/signals-react';
import ArrowContainer from '../components/ArrowContainer';
import MultipleArrowContainer from '../components/MultipleArrowContainer';
import './StartView.css';
import { useEffect } from 'react';
import MultipleArrowSubscriber from '../components/MultipleArrowSubscriber';

function StartView(props) {
    console.log("Rendering StartView");
    let mainScreenString = props.mainScreenString;
    let keyPressed = props.keyPressed;

    let arrowData = [
        {
            "success": "settings",
            "code": ['down', 'down', 'up', 'right'],
            "show": signal(true)
        }, {
            "success": "game",
            "code": ["up", "down", "right", "left", "up"],
            "show": signal(true)
        }
    ];

    let mac = new MultipleArrowContainer(arrowData, mainScreenString);

    let dispose = effect(() => {
        if (keyPressed.value != "") {
            mac.handleKeyPressed(keyPressed.value);
            keyPressed.value = "";
        }
    });

    useEffect(() => {
        return () => {
            console.log("Unmounting StartView");
            dispose();
        }
    }, []);

    return (
        <div className="StartView">
            <p className='StartViewTitle'>STRATAGEM HERO</p>
            <div className='SettingsViewNavbar'>
                <div className="SettingsViewNavbarStratagem">
                    <img className="SettingsViewNavbarImage SettingsViewNavbarYellow" src={process.env.PUBLIC_URL + "/media/stratagems/Resupply.svg"} alt={"SETTINGS"} />
                    <div className="SettingsViewNavbarContent">
                        <p className="SettingsViewNavbarTitle">SETTINGS</p>
                        <div className="SettingsViewNavbarArrows">
                            <MultipleArrowSubscriber mac={mac} self={0} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="StartViewGameArrowContainer">
                <MultipleArrowSubscriber mac={mac} self={1} />
            </div>
            <p className='StartViewInfo'>Enter Stratagem Combination to Start</p>

        </div>
    );
}

export default StartView;
