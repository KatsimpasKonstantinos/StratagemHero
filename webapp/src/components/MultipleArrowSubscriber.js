import { computed } from "@preact/signals-react";
import "./MultipleArrowSubscriber.css";

function MultipleArrowSubscriber(props) {
    console.log("Rendering MultipleArrowSubscriber");
    let mac = props.mac;
    let self = props.self;

    let renderArrows = computed(() => {
        let arrows = [];
        for (let i = 0; i < mac.arrowData[self].code.length; i++) {
            let color = "MultipleArrowSubscriberGray";
            if (mac.arrowData[self].show.value) {
                color = "MultipleArrowSubscriberGray";
            } else {
                color = "MultipleArrowSubscriberDarkGray";
            }
            if (i < mac.currentArrowIndex.value && mac.arrowData[self].show.value) {
                color = "MultipleArrowSubscriberYellow";
            }
            let className = "MultipleArrowSubscriberArrow " + color;
            arrows.push(
                <div className="MultipleArrowSubscriberDiv" key={i}>
                    <img className={className} src={process.env.PUBLIC_URL + "/media/arrows/arrow" + mac.arrowData[self].code[i] + ".svg"} alt={mac.arrowData[self].code[i]} />
                </div>
            );
        }
        return arrows;
    });


    return (
        <div className="MultipleArrowSubscriber">
            {renderArrows}
        </div>
    )
}

export default MultipleArrowSubscriber;