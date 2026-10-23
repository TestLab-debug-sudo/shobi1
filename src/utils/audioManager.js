/**
 * Global Audio Manager for background music and ambient audio
 */

let bgMusicAudio = null;
let isMuted = false;
let bgMusicStarted = false;

// Initialize background music
export const initAudio = () => {
    if (typeof window === 'undefined') return;

    const savedMuted = localStorage.getItem('audio_muted');
    isMuted = savedMuted === 'true';

    const savedVolume = localStorage.getItem('audio_volume');
    const defaultVol = savedVolume !== null ? parseFloat(savedVolume) : 0.6;

    if (!bgMusicAudio) {
        bgMusicAudio = new Audio('/sounds/cfl_turningpages-belem-breeze-487596.ogg');
        bgMusicAudio.preload = 'auto';
        bgMusicAudio.loop = true;
        bgMusicAudio.volume = defaultVol;
        bgMusicAudio.muted = isMuted;

        bgMusicAudio.load();
    }
};

export const playBackgroundMusic = () => {
    initAudio();
    bgMusicStarted = true;
    if (bgMusicAudio) {
        // If user initiates, make sure it's unmuted if volume > 0
        if (bgMusicAudio.volume > 0 && bgMusicAudio.muted) {
            bgMusicAudio.muted = false;
            isMuted = false;
            localStorage.setItem('audio_muted', 'false');
        }

        if (bgMusicAudio.paused) {
            const playPromise = bgMusicAudio.play();
            if (playPromise !== undefined) {
                playPromise.catch((err) => {
                    console.warn('Audio play waiting for direct user gesture:', err.message);
                });
            }
        }
    }
};

export const pauseBackgroundMusic = () => {
    if (bgMusicAudio && !bgMusicAudio.paused) {
        bgMusicAudio.pause();
    }
};

export const toggleMute = () => {
    isMuted = !isMuted;
    localStorage.setItem('audio_muted', isMuted ? 'true' : 'false');
    if (bgMusicAudio) {
        bgMusicAudio.muted = isMuted;
        if (!isMuted && bgMusicAudio.paused) {
            bgMusicAudio.play().catch(e => console.warn(e));
        }
    }
    return isMuted;
};

export const getIsMuted = () => isMuted;

export const setMusicVolume = (vol) => {
    initAudio();
    const safeVol = Math.max(0, Math.min(1, vol));
    if (bgMusicAudio) {
        bgMusicAudio.volume = safeVol;
        if (safeVol > 0 && isMuted) {
            isMuted = false;
            bgMusicAudio.muted = false;
            localStorage.setItem('audio_muted', 'false');
        }
        if (safeVol > 0 && bgMusicAudio.paused && bgMusicStarted) {
            bgMusicAudio.play().catch(e => console.warn(e));
        }
    }
    localStorage.setItem('audio_volume', safeVol.toString());
    window.dispatchEvent(new CustomEvent('musicVolumeChanged', { detail: safeVol }));
};

export const getMusicVolume = () => {
    return bgMusicAudio ? bgMusicAudio.volume : 0.6;
};
