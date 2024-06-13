import ArrowContainer from '../components/ArrowContainer';
import './StartView.css';

function StartView(props) {
    console.log("Rendering StartView");
    let mainScreenString = props.mainScreenString;
    let keyPressed = props.keyPressed;


    console.log("Rendering StartView");

    return (
        <div className="StartView">
            <p class='StartViewTitle'>STRATAGEM HERO</p>
            <div class="StartViewArrowContainer">
                <ArrowContainer someSignal={mainScreenString} successValue={"game"} code={['up', 'down', 'right', 'left', 'up']} keyPressed={keyPressed} muted={false} />
            </div>
            <p class='StartViewInfo'>Enter Stratagem Combination to Start</p>

        </div>
    );
}

export default StartView;
