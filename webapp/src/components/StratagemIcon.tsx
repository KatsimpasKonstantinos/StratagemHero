import { useState } from "react";

interface StratagemIconProps {
    name: string;
    className: string;
}

/** Stratagem image that keeps its square size and shows the initials if the svg is missing. */
function StratagemIcon({ name, className }: StratagemIconProps) {
    const [missing, setMissing] = useState(false);

    if (missing) {
        const initials = name
            .split(/[\s-]+/)
            .map((word) => word[0])
            .join("")
            .slice(0, 3)
            .toUpperCase();
        return (
            <span className={`${className} StratagemFallback`} role="img" aria-label={name}>
                {initials}
            </span>
        );
    }

    return (
        <img className={className} src={`/media/stratagems/${name}.svg`} alt={name} onError={() => setMissing(true)} />
    );
}

export default StratagemIcon;
