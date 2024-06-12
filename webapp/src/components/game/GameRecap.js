function GameRecap(props) {
    let gameScreenString = props.gameScreenString;

    setTimeout(() => {
        gameScreenString.value = "prepare";
    }, 3000);

    return (
        <div>
            <h1>Game Recap</h1>
        </div>
    );
}

export default GameRecap;