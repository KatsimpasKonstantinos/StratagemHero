import { useEffect, useRef } from "react";
import { playSound, setVolume, SOUNDS, stopSound } from "../../lib/audio.ts";
import { useDirectionInput } from "../../lib/input.ts";
import { MAX_VOLUME, updateSettings, useSettings, type VolumeChannel } from "../../lib/settings.ts";
import ExitArrows from "../ExitArrows.tsx";
import StateBar from "../StateBar.tsx";
import "./Sound.css";
import { useSettingsCursor, type SettingsPageProps } from "./useSettingsCursor.ts";

const CHANNELS: { channel: VolumeChannel; label: string }[] = [
    { channel: "master", label: "Master" },
    { channel: "keyboard", label: "Keyboard" },
    { channel: "music", label: "Music" },
    { channel: "effects", label: "Effects" },
];

const MUSIC_PREVIEW_MS = 2500;

function Sound({ focused, onExit }: SettingsPageProps) {
    const { volume } = useSettings();
    const { cursor, exit, move } = useSettingsCursor(CHANNELS.length, focused, onExit);
    const musicPreview = useRef<HTMLAudioElement | null>(null);
    const musicPreviewEnd = useRef<number | undefined>(undefined);

    useEffect(
        () => () => {
            clearTimeout(musicPreviewEnd.current);
            stopSound(musicPreview.current);
        },
        [],
    );

    /** Play an example so the new volume can be heard right away. */
    function preview(channel: VolumeChannel) {
        if (channel === "music") {
            // Keep one music snippet playing while the volume is being adjusted.
            if (musicPreview.current) setVolume(musicPreview.current, "music");
            else musicPreview.current = playSound(SOUNDS.backgroundMusic, "music");
            clearTimeout(musicPreviewEnd.current);
            musicPreviewEnd.current = window.setTimeout(() => {
                stopSound(musicPreview.current);
                musicPreview.current = null;
            }, MUSIC_PREVIEW_MS);
        } else if (channel !== "keyboard") {
            // keyboard: every key press already plays the key sound
            playSound(SOUNDS.stratagemComplete, "effects");
        }
    }

    useDirectionInput((direction) => {
        if (move(direction) || cursor < 0) return;
        const { channel } = CHANNELS[cursor];
        const change = direction === "right" ? 1 : -1;
        updateSettings((s) => ({
            ...s,
            volume: { ...s.volume, [channel]: Math.min(MAX_VOLUME, Math.max(0, s.volume[channel] + change)) },
        }));
        preview(channel);
    }, focused);

    function rowColor(i: number) {
        if (!focused) return " SoundDivDarkGray";
        if (cursor === i) return " SoundDivYellow";
        if (!exit.inZone) return " SoundDivWhite";
        return " SoundDivGray";
    }

    return (
        <div className="SoundContainer">
            <p className="SoundTitle">SOUND VOLUME</p>
            {CHANNELS.map(({ channel, label }, i) => (
                <div key={channel} className={"SoundElement" + rowColor(i)}>
                    <p className="SoundText">
                        {label} {volume[channel]}
                    </p>
                    <StateBar value={volume[channel]} max={MAX_VOLUME} />
                </div>
            ))}
            <ExitArrows {...exit} />
        </div>
    );
}

export default Sound;
