import { signal } from "@preact/signals-react";

function gameView() {

    const round = signal(0);
    const score = signal(0);
    const time = signal(0);

    



    return (
        <div className="gameView">
        </div>
    );
}

export default gameView;
