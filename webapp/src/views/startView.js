import ArrowContainer from '../components/ArrowContainer';
import './StartView.css';

function StartView(props) {
    console.log("Rendering StartView");
    let mainScreenString = props.mainScreenString;
    let keyPressed = props.keyPressed;


    console.log("Rendering StartView");

    return (
        <div className="StartView">
            <p className='StartViewTitle'>STRATAGEM HERO</p>
            <div className="StartViewArrowContainer">
                <ArrowContainer someSignal={mainScreenString} successValue={"game"} code={['up', 'down', 'right', 'left', 'up']} keyPressed={keyPressed} muted={false} />
            </div>
            <p className='StartViewInfo'>Enter Stratagem Combination to Start</p>

        </div>
    );
}

export default StartView;
