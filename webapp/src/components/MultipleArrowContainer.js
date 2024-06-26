import { effect, signal } from "@preact/signals-react";
import { useEffect } from "react";



class MultipleArrowContainer {
    arrowData;
    currentArrowIndex = signal(0);
    someSignal;
    blockNavigation;
    constructor(arrowData, someSignal) {
        this.arrowData = arrowData;
        this.someSignal = someSignal;
    }

    reset(show) {
        this.currentArrowIndex.value = 0;
        for (let arrow of this.arrowData) {
            arrow.show.value = show;
        }
    }

    handleKeyPressed(key) {
        let match = false;
        for (let i = 0; i < this.arrowData.length; i++) {
            let arrow = this.arrowData[i];
            if (this.arrowData[i].show.value === false) continue;
            if (arrow.code[this.currentArrowIndex.value] === key) {
                match = true;
                this.arrowData[i].show.value = true;
                if (this.currentArrowIndex.value === arrow.code.length - 1) {
                    console.log("Success: " + arrow.success);
                    this.reset(false);
                    this.someSignal.value = arrow.success + " " + Math.random();
                    return;
                }
            } else {
                this.arrowData[i].show.value = false;
            }
        }
        if (match) {
            this.currentArrowIndex.value++;
        } else {
            this.reset(true);
        }
    }
}

export default MultipleArrowContainer;