import { useState, useEffect } from 'react';
import { sanityClient, urlFor, getProxyUrl } from '../config/sanity';
import { useTexture } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

// Flaga bezpieczeństwa: Jeśli użytkownik korzysta z domyślnego projektu,
// ładujemy lokalne dane Subbulakshmi K
export const isSanityConfigured = sanityClient.config().projectId !== 'subbulakshmi-dev';

// Globalny cache dla danych z Sanity
const cache = {
    projects: null,
    content: null,
    awards: null,
    loading: false,
    loaded: false,
    error: null,
};

let fetchPromise = null;
const listeners = new Set();

function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function notifyUpdate() {
    listeners.forEach(l => l());
}

// Pomocniczy preloader dla zwykłych obrazków HTML (np. certyfikatów)
const preloadBrowserImage = (path) => {
    if (typeof window === 'undefined' || !path) return;
    const img = new Image();
    img.src = path;
};

// Sprawdzenie, czy urządzenie obsługuje hover (kursory, komputery)
const supportsHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

const SUBBU_PROJECTS = [
    {
        id: 'engenix',
        title: 'ENGENIX STORE',
        front: '/textures/gallery/monetuneprzod.webp',
        painted: '/textures/gallery/monetuneprzod_painted.webp',
        url: 'https://engenix01.netlify.app/',
        description: 'Engenix E-Commerce Website: Developed a responsive, high-performance e-commerce web application featuring real-time search, cart management, product filtering, and user accounts. Built with React.js and deployed live on Netlify.',
        techStack: ['/textures/gallery/reactlogo.webp', '/textures/gallery/tailwindlogo.webp', '/textures/gallery/netlifylogo.webp', '/textures/gallery/jslogo.webp']
    },
    {
        id: 'anemia',
        title: 'ANEMIA AI DETECTION',
        front: '/textures/gallery/timberkittyprzod.webp',
        painted: '/textures/gallery/timberkittyprzod_painted.webp',
        url: 'https://github.com/subbulakshmi0K27',
        description: 'Anemia Prediction Using Eye Conjunctiva Image Analysis & Lifestyle Factors: Developed a non-invasive medical diagnostic system combining computer vision and patient lifestyle data. Trained Decision Tree, SVM, and Random Forest models achieving 95.10% early screening accuracy.',
        techStack: ['/textures/gallery/jslogo.webp', '/textures/gallery/reactlogo.webp', '/textures/gallery/htmllogo.webp', '/textures/gallery/csslogo.webp']
    },
    {
        id: 'slaas',
        title: 'SLAAS CLOUD LOGGING',
        front: '/textures/gallery/youngmultiprzod.webp',
        painted: '/textures/gallery/youngmultiprzod_painted.webp',
        url: 'https://github.com/subbulakshmi0K27',
        description: 'Secure Logging as a Service (SLAAS): Developed a cloud-based secure logging system engineered for centralized log ingestion, audit trails, and automated vulnerability analysis with Java and MySQL database optimization.',
        techStack: ['/textures/gallery/jslogo.webp', '/textures/gallery/firebaselogo.webp', '/textures/gallery/htmllogo.webp', '/textures/gallery/csslogo.webp']
    },
    {
        id: 'cybersec',
        title: 'CYBER BREACH DETECTION',
        front: '/textures/gallery/bioprzod.webp',
        painted: '/textures/gallery/bioprzod_painted.webp',
        url: 'https://github.com/subbulakshmi0K27',
        description: 'Cyber Hacking Breaches Prediction & Detection: Engineered an applied machine learning intrusion defense system analyzing historical cyber attack datasets to predict upcoming vulnerabilities and accelerate automated incident mitigation.',
        techStack: ['/textures/gallery/reactlogo.webp', '/textures/gallery/htmllogo.webp', '/textures/gallery/csslogo.webp', '/textures/gallery/netlifylogo.webp']
    },
];

const SUBBU_AWARDS = {
    featured: {
        id: 'award-featured',
        layout: 'certificate_grid',
        title: 'Education & Certifications',
        items: [
            { label: 'MCA (CGPA: 8.91) - Mepco Schlenk Engineering College', date: '2024 - 2026', image: '/images/subbulakshmi_resume.jpg', url: 'https://protfoliomee.netlify.app/' },
            { label: 'BSc Computer Science (CGPA: 7.70) - Madurai Kamaraj University', date: '2021 - 2024', image: '/images/subbulakshmi_resume.jpg', url: 'https://protfoliomee.netlify.app/' },
            { label: 'Game Developer Intern Certificate - Foxzoid Game Studio LLP', date: '2026', image: '/images/subbulakshmi_resume.jpg', url: 'https://protfoliomee.netlify.app/' },
            { label: 'AI Conclave Certificate - Empowering Future Engineers with AI', date: '2025', image: '/images/subbulakshmi_resume.jpg', url: 'https://protfoliomee.netlify.app/' },
        ],
        platformConfig: { label: 'CREDENTIALS', color: '#1a1a1a', icon: '🎓' }
    },
    sotd: {
        id: 'award-sotd',
        layout: 'certificate_grid',
        title: 'Hackathons & Honors',
        items: [
            { label: 'Winner – Logic Architect Award (2nd Prize), CodeFest\'25', date: 'CodeFest 2025', image: '/images/subbulakshmi_resume.jpg', url: 'https://protfoliomee.netlify.app/' },
            { label: 'AI Conclave: Empowering Future Engineers with AI Technologies', date: '2025', image: '/images/subbulakshmi_resume.jpg', url: 'https://protfoliomee.netlify.app/' },
            { label: 'Foxzoid Game Studio – Certificate of Completion with Strong Performance', date: '2026', image: '/images/subbulakshmi_resume.jpg', url: 'https://protfoliomee.netlify.app/' },
            { label: 'Academic Distinction – MCA Current CGPA: 8.91', date: 'VI Semester (2024-2026)', image: '/images/subbulakshmi_resume.jpg', url: 'https://protfoliomee.netlify.app/' }
        ],
        platformConfig: { label: 'HONORS', color: '#1a1a1a', icon: '🏆' }
    },
    sotm: {
        id: 'award-sotm',
        layout: 'certificate_grid',
        title: 'Professional Internships',
        items: [
            { label: 'Full Stack Developer Intern – Gates Cloud Technologies Pvt Ltd', date: '2025 - 2026', image: '/images/subbulakshmi_resume.jpg', url: 'https://github.com/subbulakshmi0K27' },
            { label: 'React.js Intern – CloudsBySunil x TecGrad Learning', date: '2025', image: '/images/subbulakshmi_resume.jpg', url: 'https://github.com/subbulakshmi0K27' },
            { label: 'Game Developer Intern – Foxzoid Game Studio LLP', date: '2026', image: '/images/subbulakshmi_resume.jpg', url: 'https://github.com/subbulakshmi0K27' },
        ],
        platformConfig: { label: 'EXPERIENCE', color: '#1a1a1a', icon: '💼' }
    },
    other: {
        id: 'award-other',
        layout: 'certificate_grid',
        title: 'Technical Core Skills',
        items: [
            { label: 'Full Stack: React.js, Node.js, Django, Python, Java, JavaScript, PostgreSQL, MySQL', date: 'Core Stack', image: '/images/subbulakshmi_resume.jpg', url: 'https://protfoliomee.netlify.app/' },
            { label: 'AI & Prompt Engineering: Google Gemini, Claude, ChatGPT, Decision Tree, SVM, Random Forest', date: 'AI & ML', image: '/images/subbulakshmi_resume.jpg', url: 'https://protfoliomee.netlify.app/' },
            { label: 'Live Projects: Engenix E-Commerce & Secure Logging as a Service', date: 'Live Demos', image: '/images/subbulakshmi_resume.jpg', url: 'https://engenix01.netlify.app/' }
        ],
        platformConfig: { label: 'SKILLS', color: '#1a1a1a', icon: '⚡' }
    }
};

export function loadSanityData() {
    if (!isSanityConfigured) {
        cache.projects = SUBBU_PROJECTS;
        cache.awards = SUBBU_AWARDS;
        cache.loaded = true;
        return Promise.resolve(cache);
    }

    if (fetchPromise) {
        return fetchPromise;
    }

    cache.loading = true;

    fetchPromise = (async () => {
        try {
            const [projectsData, contentData, awardsData] = await Promise.all([
                // 1. Projects (Galeria)
                sanityClient.fetch(`
                    *[_type == "galleryProject"] {
                        title,
                        "id": slug.current,
                        url,
                        description,
                        frontImage,
                        paintedImage,
                        techStack
                    }
                `),
                // 2. Studio Content
                sanityClient.fetch(`
                    *[_type == "studioItem"] {
                        title,
                        platform,
                        description,
                        url,
                        frontTexture,
                        paintedFrontTexture,
                        date,
                        views,
                        likes,
                        duration,
                        readTime
                    } | order(date desc)
                `),
                // 3. Awards (Certyfikaty w About)
                sanityClient.fetch(`
                    *[_type == "awardCertificate"] {
                        title,
                        category,
                        certificateImage,
                        date,
                        url
                    } | order(date desc)
                `)
            ]);

            // Mapowanie danych galerii i techStack na ścieżki lokalne oraz optymalizacja obrazków z Sanity
            if (projectsData && projectsData.length > 0) {
                cache.projects = projectsData.map(p => {
                    const frontUrl = p.frontImage ? getProxyUrl(urlFor(p.frontImage).width(1024).quality(80).auto('format')) : null;
                    const paintedUrl = p.paintedImage ? getProxyUrl(urlFor(p.paintedImage).width(1024).quality(80).auto('format')) : null;
                    return {
                        ...p,
                        front: frontUrl,
                        painted: paintedUrl,
                        techStack: p.techStack ? p.techStack.map(t => '/textures/gallery/' + t) : []
                    };
                });
            }

            // Mapowanie danych studio, przypisanie id oraz optymalizacja obrazków z Sanity
            if (contentData && contentData.length > 0) {
                cache.content = contentData.map((item, index) => {
                    const frontTextureUrl = item.frontTexture ? getProxyUrl(urlFor(item.frontTexture).width(1024).quality(80).auto('format')) : null;
                    const paintedFrontTextureUrl = item.paintedFrontTexture ? getProxyUrl(urlFor(item.paintedFrontTexture).width(1024).quality(80).auto('format')) : null;
                    return {
                        ...item,
                        id: item.platform + '-' + index,
                        frontTexture: frontTextureUrl,
                        paintedFrontTexture: paintedFrontTextureUrl
                    };
                });
            }

            // Mapowanie nagród do struktury oczekiwanej przez overlay oraz optymalizacja certyfikatów z Sanity
            if (awardsData && awardsData.length > 0) {
                const mapItems = (items) => items.map(a => {
                    const imageUrl = a.certificateImage ? getProxyUrl(urlFor(a.certificateImage).width(800).quality(80).auto('format')) : null;
                    return {
                        label: a.title,
                        date: new Date(a.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                        image: imageUrl,
                        url: a.url || null
                    };
                });

                cache.awards = {
                    sotd: {
                        id: 'award-sotd',
                        layout: 'certificate_grid',
                        title: 'Site of the Day Awards',
                        items: mapItems(awardsData.filter(a => a.category === 'sotd')),
                        platformConfig: { label: 'ACHIEVEMENT', color: '#1a1a1a', icon: '🏆' }
                    },
                    sotm: {
                        id: 'award-sotm',
                        layout: 'certificate_grid',
                        title: 'Site of the Month Awards',
                        items: mapItems(awardsData.filter(a => a.category === 'sotm')),
                        platformConfig: { label: 'AWARD', color: '#1a1a1a', icon: '📅' }
                    },
                    other: {
                        id: 'award-other',
                        layout: 'certificate_grid',
                        title: 'Other Awards',
                        items: mapItems(awardsData.filter(a => a.category === 'other')),
                        platformConfig: { label: 'PRESTIGE', color: '#1a1a1a', icon: '👑' }
                    }
                };
            }

            // PRELOADING ZDJĘĆ/TEKSTUR Z SANITY
            
            // 1. Projekty galerii
            if (cache.projects) {
                cache.projects.forEach(p => {
                    if (p.front) {
                        useTexture.preload(p.front);
                        preloadBrowserImage(p.front);
                    }
                    // Optymalizacja mobilna: Ładujemy malowane wersje TYLKO jeśli urządzenie wspiera hover (komputery)
                    if (p.painted && supportsHover) {
                        useTexture.preload(p.painted);
                        preloadBrowserImage(p.painted);
                    }
                });
            }

            // 2. Studio
            if (cache.content) {
                cache.content.forEach(c => {
                    if (c.frontTexture) {
                        useLoader.preload(TextureLoader, c.frontTexture);
                        preloadBrowserImage(c.frontTexture);
                    }
                    // Optymalizacja mobilna: Ładujemy malowane wersje TYLKO dla komputerów (z myszką/hover)
                    if (c.paintedFrontTexture && supportsHover) {
                        useLoader.preload(TextureLoader, c.paintedFrontTexture);
                        preloadBrowserImage(c.paintedFrontTexture);
                    }
                });
            }

            // 3. Nagrody (certyfikaty w oknach 2D) - preload w przeglądarce
            if (cache.awards) {
                ['sotd', 'sotm', 'other'].forEach(category => {
                    cache.awards[category].items.forEach(item => {
                        if (item.image) {
                            preloadBrowserImage(item.image);
                        }
                    });
                });
            }

            cache.loaded = true;
            cache.loading = false;
        } catch (error) {
            console.error("Error preloading Sanity data:", error);
            cache.error = error;
            cache.loading = false;
            // Oznaczamy jako załadowane w razie błędu, żeby aplikacja nie wisiała w nieskończoność na preloaderze
            cache.loaded = true;
        }

        notifyUpdate();
        return cache;
    })();

    return fetchPromise;
}

export function isSanityDataLoaded() {
    if (!isSanityConfigured) return true;
    return cache.loaded;
}

export function useGalleryProjects() {
    const [projects, setProjects] = useState(cache.projects);

    useEffect(() => {
        loadSanityData();

        if (cache.loaded) {
            setProjects(cache.projects);
            return;
        }

        const handleUpdate = () => {
            setProjects(cache.projects);
        };

        return subscribe(handleUpdate);
    }, []);

    return projects;
}

export function useStudioContent() {
    const [content, setContent] = useState(cache.content);

    useEffect(() => {
        loadSanityData();

        if (cache.loaded) {
            setContent(cache.content);
            return;
        }

        const handleUpdate = () => {
            setContent(cache.content);
        };

        return subscribe(handleUpdate);
    }, []);

    return content;
}

export function useAwards() {
    const [awardsData, setAwardsData] = useState(cache.awards);

    useEffect(() => {
        loadSanityData();

        if (cache.loaded) {
            setAwardsData(cache.awards);
            return;
        }

        const handleUpdate = () => {
            setAwardsData(cache.awards);
        };

        return subscribe(handleUpdate);
    }, []);

    return awardsData;
}

// Automatyczne odpalenie pobierania przy załadowaniu modułu JS
loadSanityData();
