import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { playBackgroundMusic, setMusicVolume, toggleMute as toggleBgMute, getIsMuted } from '../utils/audioManager';

const AudioContext = createContext({
    isMuted: false,
    toggleMute: () => { },
    play: () => { },
    enableAudio: () => { },
    audioEnabled: false,
    globalVolume: 0.6,
    setGlobalVolume: () => { },
});

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
    // Persist mute preference - default to false so sounds play
    const [isMuted, setIsMuted] = useState(() => {
        const saved = localStorage.getItem('audio_muted');
        return saved === 'true';
    });

    // Persist volume preference (0.0 to 1.0) - default 0.6
    const [globalVolume, setGlobalVolume] = useState(() => {
        const saved = localStorage.getItem('audio_volume');
        return saved !== null ? parseFloat(saved) : 0.6;
    });

    const [audioEnabled, setAudioEnabled] = useState(false);

    // Track active sounds to stop or adjust them later
    const activeSounds = useRef({});

    useEffect(() => {
        localStorage.setItem('audio_muted', isMuted ? 'true' : 'false');
        localStorage.setItem('audio_volume', globalVolume.toString());

        // Sync background music volume and mute state
        setMusicVolume(globalVolume);
        if (getIsMuted() !== isMuted) {
            toggleBgMute();
        }

        // Update all active sound effects
        Object.values(activeSounds.current).forEach(audio => {
            if (audio) {
                audio.muted = isMuted;
                const base = audio._baseVolume !== undefined ? audio._baseVolume : 1.0;
                let targetVol = base * globalVolume;
                audio.volume = Math.max(0, Math.min(1, targetVol));
            }
        });

    }, [isMuted, globalVolume]);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => {
            const next = !prev;
            if (getIsMuted() !== next) {
                toggleBgMute();
            }
            if (!next) {
                // If unmuting, start background music and unlock Web Audio context
                try {
                    const ctx = THREE.AudioContext?.getContext?.();
                    if (ctx && ctx.state === 'suspended') {
                        ctx.resume();
                    }
                } catch (e) { }
                playBackgroundMusic();
            }
            return next;
        });
    }, []);

    // Enhanced setter that auto-unmutes if user manually drags slider above 0
    const enhancedSetGlobalVolume = useCallback((vol) => {
        const handleVol = (newVol) => {
            setMusicVolume(newVol);
            if (newVol > 0) {
                setIsMuted(false);
                playBackgroundMusic();
                try {
                    const ctx = THREE.AudioContext?.getContext?.();
                    if (ctx && ctx.state === 'suspended') {
                        ctx.resume();
                    }
                } catch (e) { }
            }
            return newVol;
        };

        if (typeof vol === 'function') {
            setGlobalVolume(prev => handleVol(vol(prev)));
        } else {
            setGlobalVolume(handleVol(vol));
        }
    }, []);

    // Call this on user interaction to unlock Web Audio API & background music
    const enableAudio = useCallback(() => {
        try {
            const ctx = THREE.AudioContext?.getContext?.();
            if (ctx && ctx.state === 'suspended') {
                ctx.resume();
            }
        } catch (e) {
            console.warn('[Audio] Error resuming AudioContext:', e);
        }

        playBackgroundMusic();
        setAudioEnabled(true);
    }, []);

    const play = useCallback((soundName, { loop = false, volume = 1.0 } = {}) => {
        // Complete mapping for all sound effects and aliases
        const soundPaths = {
            'szumwiatru': '/sounds/szumwiatru.mp3',       // Wind in About room
            'szummiasta': '/sounds/szummiasta.mp3',       // City ambience in Gallery
            'szummonitorow': '/sounds/szummonitorow.mp3', // Server hum in Studio
            'szummorza': '/sounds/szummorza.mp3',         // Ocean breeze in Contact
            'uchyleniedrzwi': '/sounds/uchyleniedrzwi.mp3', // Door ajar / hover
            'otwarciedrzwi': '/sounds/otwarciedrzwi.mp3',   // Door open
            'zamknieciedrzwi': '/sounds/zamknieciedrzwi.mp3', // Door close
            'papersound': '/sounds/papersound.mp3',       // Paper flip / card turn
            'baloonpoop': '/sounds/baloonpoop.mp3',       // Balloon pop / bubble tap
            'pencil': '/sounds/papersound.mp3',           // Pencil drawing sound alias
            'tear': '/sounds/papersound.mp3',             // Paper tear sound alias
            'pop': '/sounds/baloonpoop.mp3',              // Pop sound alias
        };
        const path = soundPaths[soundName] || `/sounds/${soundName}.mp3`;

        const audio = new Audio(path);
        audio.loop = loop;
        audio._baseVolume = volume;
        audio.muted = isMuted;

        let targetVol = volume * globalVolume;
        audio.volume = Math.max(0, Math.min(1, targetVol));

        if (activeSounds.current[soundName]) {
            try {
                activeSounds.current[soundName].pause();
            } catch (e) { }
        }
        activeSounds.current[soundName] = audio;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                // Silently handle autoplay prevention until user interaction
            });
        }

        return {
            stop: () => {
                try {
                    audio.pause();
                    audio.currentTime = 0;
                } catch (e) { }
                delete activeSounds.current[soundName];
            },
            fade: () => {
                try {
                    audio.pause();
                } catch (e) { }
                delete activeSounds.current[soundName];
            }
        };
    }, [isMuted, globalVolume]);

    return (
        <AudioContext.Provider value={{
            isMuted,
            toggleMute,
            globalVolume,
            setGlobalVolume: enhancedSetGlobalVolume,
            play,
            enableAudio,
            audioEnabled
        }}>
            {children}
        </AudioContext.Provider>
    );
};
