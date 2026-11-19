import { getSettings, MAX_VOLUME, type VolumeChannel } from "./settings.ts";

export const SOUNDS = {
    keyInput: "/media/sounds/keyInput.ogg",
    wrongInput: "/media/sounds/wrongInput.ogg",
    stratagemComplete: "/media/sounds/stratagemComplete.ogg",
    prepareNextRound: "/media/sounds/prepareNextRound.ogg",
    backgroundMusic: "/media/sounds/backgroundMusic.ogg",
    gameOver: "/media/sounds/gameOver.ogg",
    charge: "/media/sounds/charge.ogg",
    delete: "/media/sounds/delete.ogg",
    roundComplete: [1, 2, 3, 4].map((n) => `/media/sounds/roundComplete${n}.mp3`),
} as const;

export type SoundChannel = Exclude<VolumeChannel, "master">;

export function channelVolume(channel: SoundChannel): number {
    const { volume } = getSettings();
    return (volume.master / MAX_VOLUME) * (volume[channel] / MAX_VOLUME);
}

interface PlayOptions {
    loop?: boolean;
    startAt?: number;
}

/** Play a sound on a volume channel. Autoplay rejections are ignored. */
export function playSound(
    src: string,
    channel: SoundChannel,
    { loop = false, startAt = 0 }: PlayOptions = {},
): HTMLAudioElement {
    const audio = new Audio(src);
    audio.volume = channelVolume(channel);
    audio.loop = loop;
    if (startAt > 0) audio.currentTime = startAt;
    audio.play().catch(() => {});
    return audio;
}

/** Re-apply the current settings to a sound that is already playing. */
export function setVolume(audio: HTMLAudioElement, channel: SoundChannel): void {
    audio.volume = channelVolume(channel);
}

export function stopSound(audio: HTMLAudioElement | null | undefined): void {
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
}
