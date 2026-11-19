import { useState } from "react";
import { loadLastName } from "../lib/highscores.ts";
import { useDirectionInput } from "../lib/input.ts";
import "./NameEntry.css";

const A = "A".charCodeAt(0);

function shiftLetter(letter: string, by: number): string {
    return String.fromCharCode(A + ((letter.charCodeAt(0) - A + by + 26) % 26));
}

/** Arcade style 3-letter name entry: up/down change the letter, left/right move, right on the last letter submits. */
function NameEntry({ onSubmit }: { onSubmit: (name: string) => void }) {
    const [letters, setLetters] = useState(loadLastName);
    const [index, setIndex] = useState(0);
    const done = index >= letters.length;

    useDirectionInput((direction) => {
        if (direction === "right") {
            setIndex(index + 1);
            if (index + 1 === letters.length) onSubmit(letters.join(""));
        } else if (direction === "left") {
            setIndex(Math.max(0, index - 1));
        } else {
            const next = [...letters];
            next[index] = shiftLetter(letters[index], direction === "up" ? -1 : 1);
            setLetters(next);
        }
    }, !done);

    return (
        <p className="NameEntry">
            {letters.map((letter, i) => (
                <span key={i} className={i === index ? "selected" : i < index ? "submitted" : ""}>
                    {letter}
                </span>
            ))}
        </p>
    );
}

export default NameEntry;
