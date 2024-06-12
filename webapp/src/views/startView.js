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
            <p class='StartViewInfo'>To Start Enter:</p>
            <div class="StartViewArrowContainer">
                <ArrowContainer someSignal={mainScreenString} successValue={"game"} code={['up', 'down', 'right', 'left', 'up']} keyPressed={keyPressed} />
            </div>
        </div>
    );
}

export default StartView;
