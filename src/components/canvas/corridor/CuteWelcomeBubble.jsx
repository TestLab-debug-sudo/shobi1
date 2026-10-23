import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useAudio } from '../../../context/AudioManager';

const CABIN_SKETCH_BOLD = '/fonts/CabinSketch-Bold.ttf';
const CABIN_SKETCH_REGULAR = '/fonts/CabinSketch-Regular.ttf';

/**
 * Creates a rounded rectangular speech bubble shape with a pointer tail
 */
function createSpeechBubbleShape(width, height, radius) {
    const shape = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;
    const w = width;
    const h = height;
    const r = radius;

    // Rounded rectangle
    shape.moveTo(x + r, y);
    shape.lineTo(x + w - r, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + r);
    shape.lineTo(x + w, y + h - r);
    shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    shape.lineTo(x + r, y + h);
    shape.quadraticCurveTo(x, y + h, x, y + h - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);

    return shape;
}

const CUTE_MESSAGES = [
    {
        title: "Hi! I'm Subbulakshmi ✨",
        subtitle: "Welcome to my 3D World! 💫"
    },
    {
        title: "1. About 2. Gallery 3. Studio 🚪",
        subtitle: "Scroll forward to explore them all! 🚀"
    },
    {
        title: "Need my full Resume? 📄",
        subtitle: "Click the Resume icon at the top right! ⬇️"
    },
    {
        title: "Check out my projects! 💻",
        subtitle: "AI, ML, React & Full Stack apps 🌟"
    },
    {
        title: "Let's connect & build! 💌",
        subtitle: "Click Contact room to say hello ✨"
    }
];

export const CuteWelcomeBubble = ({ position = [0.82, 0.42, -0.05] }) => {
    const groupRef = useRef();
    const bubbleRef = useRef();
    const [msgIndex, setMsgIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const { play, enableAudio } = useAudio();

    // Bubble geometry - sleek, perfectly proportioned
    const bubbleWidth = 1.25;
    const bubbleHeight = 0.46;
    const bubbleRadius = 0.10;

    const shape = useMemo(() => createSpeechBubbleShape(bubbleWidth, bubbleHeight, bubbleRadius), []);

    // Entrance pop-in animation
    useEffect(() => {
        if (groupRef.current) {
            groupRef.current.scale.set(0, 0, 0);
            gsap.to(groupRef.current.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 1.1,
                delay: 0.8,
                ease: 'elastic.out(1.1, 0.45)'
            });
        }
    }, []);

    // Floating and wobble micro-animation
    useFrame((state) => {
        if (!groupRef.current) return;
        const time = state.clock.elapsedTime;

        // Gentle floating
        const floatY = Math.sin(time * 1.5) * 0.015;
        const wobbleZ = Math.sin(time * 1.0) * 0.012;

        groupRef.current.position.y = position[1] + floatY;
        groupRef.current.rotation.z = wobbleZ;

        // Subtle hover scale
        const targetScale = isHovered ? 1.04 : 1.0;
        groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), 0.1);
    });

    const handleClick = (e) => {
        e.stopPropagation();
        enableAudio();
        try {
            play('baloonpoop', { volume: 0.65 });
        } catch (err) { }

        // Playful bounce on click
        if (groupRef.current) {
            gsap.fromTo(
                groupRef.current.scale,
                { x: 1.15, y: 0.90, z: 1 },
                { x: 1.04, y: 1.04, z: 1, duration: 0.4, ease: 'elastic.out(1.3, 0.35)' }
            );
        }
        setMsgIndex((prev) => (prev + 1) % CUTE_MESSAGES.length);
    };

    const currentMsg = CUTE_MESSAGES[msgIndex];

    return (
        <group ref={groupRef} position={position}>
            {/* === MAIN SPEECH BUBBLE BODY === */}
            <group
                ref={bubbleRef}
                onClick={handleClick}
                onPointerOver={() => { setIsHovered(true); document.body.style.cursor = 'pointer'; }}
                onPointerOut={() => { setIsHovered(false); document.body.style.cursor = 'auto'; }}
            >
                {/* Outer sketch outline border (slightly larger behind) */}
                <mesh position={[0, 0, -0.005]} scale={[1.02, 1.04, 1]}>
                    <shapeGeometry args={[shape]} />
                    <meshBasicMaterial color="#1a1a1a" side={THREE.DoubleSide} />
                </mesh>

                {/* Inner white fill */}
                <mesh position={[0, 0, 0]}>
                    <shapeGeometry args={[shape]} />
                    <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
                </mesh>

                {/* Speech tail pointer pointing towards Subbulakshmi */}
                <group position={[-0.35, -0.21, 0]}>
                    {/* Tail bubble 1 */}
                    <mesh position={[-0.06, -0.06, -0.004]}>
                        <circleGeometry args={[0.065, 16]} />
                        <meshBasicMaterial color="#1a1a1a" />
                    </mesh>
                    <mesh position={[-0.06, -0.06, 0]}>
                        <circleGeometry args={[0.055, 16]} />
                        <meshBasicMaterial color="#ffffff" />
                    </mesh>

                    {/* Tail bubble 2 (smaller, closer to avatar) */}
                    <mesh position={[-0.15, -0.13, -0.004]}>
                        <circleGeometry args={[0.040, 16]} />
                        <meshBasicMaterial color="#1a1a1a" />
                    </mesh>
                    <mesh position={[-0.15, -0.13, 0]}>
                        <circleGeometry args={[0.032, 16]} />
                        <meshBasicMaterial color="#ffffff" />
                    </mesh>
                </group>

                {/* === CUTE TEXT CONTENT === */}
                {/* Greeting Title */}
                <Text
                    position={[0, 0.065, 0.02]}
                    fontSize={0.090}
                    font={CABIN_SKETCH_BOLD}
                    color="#0d0d0d"
                    anchorX="center"
                    anchorY="middle"
                    letterSpacing={0.015}
                >
                    {currentMsg.title}
                </Text>

                {/* Subtitle / Invitation */}
                <Text
                    position={[0, -0.065, 0.02]}
                    fontSize={0.068}
                    font={CABIN_SKETCH_REGULAR}
                    color="#444444"
                    anchorX="center"
                    anchorY="middle"
                    letterSpacing={0.012}
                >
                    {currentMsg.subtitle}
                </Text>

                {/* Cute little "tap! 💕" hint inside upper corner */}
                <Text
                    position={[0.45, 0.15, 0.02]}
                    fontSize={0.042}
                    font={CABIN_SKETCH_BOLD}
                    color="#e91e63"
                    anchorX="center"
                    anchorY="middle"
                >
                    tap! 💕
                </Text>
            </group>
        </group>
    );
};

export default CuteWelcomeBubble;
