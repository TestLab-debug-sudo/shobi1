/**
 * Studio Content Data
 * 
 * This file contains all content items for the Studio monitor tower.
 * Each item will be displayed on a monitor in the tower.
 * 
 * Platforms: 'youtube', 'blog', 'tiktok'
 */

export const PLATFORM_CONFIG = {
    youtube: {
        color: '#FF0000',
        accentColor: '#cc0000',
        icon: '▶',
        label: 'YouTube',
        shape: 'tv', // Wide CRT style
    },
    blog: {
        color: '#4A90D9',
        accentColor: '#2d6cb5',
        icon: '📝',
        label: 'Blog',
        shape: 'monitor', // Thin desktop monitor
    },
    tiktok: {
        color: '#00F2EA',
        accentColor: '#FF0050',
        icon: '🎵',
        label: 'TikTok',
        shape: 'phone', // Vertical phone
    },
    instagram: {
        color: '#E1306C',
        accentColor: '#C13584',
        icon: '📷',
        label: 'Instagram',
        shape: 'phone',
    },
    x: {
        color: '#000000',
        accentColor: '#14171A',
        icon: '𝕏',
        label: 'X (Twitter)',
        shape: 'monitor',
    },
    linkedin: {
        color: '#0077B5',
        accentColor: '#005E93',
        icon: 'in',
        label: 'LinkedIn',
        shape: 'monitor',
    },
    codrops: {
        color: '#0099FF',
        accentColor: '#0077CC',
        icon: '💧',
        label: 'Codrops',
        shape: 'monitor',
    },
};

// Sample content data - replace with real content later
// Subbulakshmi K - Professional Content, Internships, Projects & AI Skills
const RAW_CONTENT_DATA = [
    // ============ YouTube / Deep Dive Presentations ============
    {
        id: 'yt-001',
        platform: 'youtube',
        title: 'AI-Assisted Software Development with Google Gemini & LLMs',
        description: 'How I leverage Google Gemini, ChatGPT, and Claude to accelerate full-stack engineering, write automated test suites, optimize database queries, and generate technical documentation.',
        frontTexture: '/textures/studio/tvfront_filmikedytowaniezdjec.webp',
        paintedFrontTexture: '/textures/studio/tvfront_filmikedytowaniezdjec_painted.webp',
        thumbnail: null,
        url: 'https://protfoliomee.netlify.app/',
        date: '2026-02-15',
        views: '3.4K',
        duration: '14:20',
    },
    {
        id: 'yt-002',
        platform: 'youtube',
        title: 'Anemia Prediction Using Eye Conjunctiva Analysis & Machine Learning',
        description: 'Non-invasive healthcare diagnostic tool applying computer vision to conjunctiva photos. Trained Decision Tree, SVM, and Random Forest models achieving 95.10% clinical screening accuracy.',
        frontTexture: '/textures/studio/tvfront_filmikprojektdlamultiego.webp',
        paintedFrontTexture: '/textures/studio/tvfront_filmikprojektdlamultiego_painted.webp',
        thumbnail: null,
        url: 'https://github.com/subbulakshmi0K27',
        date: '2026-01-20',
        views: '2.8K',
        duration: '18:45',
    },
    {
        id: 'yt-003',
        platform: 'youtube',
        title: 'Engenix: Modern Responsive E-Commerce Architecture in React',
        description: 'A complete walk-through of the Engenix E-Commerce platform featuring real-time product filtering, interactive cart state, and seamless user account authentication.',
        thumbnail: null,
        url: 'https://engenix01.netlify.app/',
        date: '2025-12-15',
        views: '4.1K',
        duration: '22:10',
    },
    {
        id: 'yt-004',
        platform: 'youtube',
        title: 'Secure Logging as a Service (SLAAS) System Design',
        description: 'Architecting centralized, tamper-proof cloud log management using Java and MySQL. Scalability considerations and high-throughput log ingestion.',
        thumbnail: null,
        url: 'https://github.com/subbulakshmi0K27',
        date: '2025-11-20',
        views: '1.9K',
        duration: '16:30',
    },
    {
        id: 'yt-005',
        platform: 'youtube',
        title: 'Predicting Cyber Hacking Breaches with Machine Learning',
        description: 'Utilizing historical security incident datasets and anomaly detection models to foresee intrusion vectors and trigger automated mitigations.',
        thumbnail: null,
        url: 'https://github.com/subbulakshmi0K27',
        date: '2025-10-30',
        views: '2.5K',
        duration: '19:15',
    },
    {
        id: 'yt-006',
        platform: 'youtube',
        title: 'Full Stack Development with React.js, Node.js & PostgreSQL',
        description: 'Designing end-to-end RESTful APIs, securing endpoints with JWT, and binding responsive React frontends with clean state management.',
        thumbnail: null,
        url: 'https://github.com/subbulakshmi0K27',
        date: '2025-09-18',
        views: '3.8K',
        duration: '24:00',
    },
    {
        id: 'yt-007',
        platform: 'youtube',
        title: 'Game Development Internship at Foxzoid Game Studio',
        description: 'Core game loop mechanics, problem-solving, and iterative feature development learned during my 3-month Game Developer Internship at Foxzoid Game Studio LLP.',
        thumbnail: null,
        url: 'https://github.com/subbulakshmi0K27',
        date: '2026-03-01',
        views: '2.2K',
        duration: '15:10',
    },
    {
        id: 'yt-008',
        platform: 'youtube',
        title: 'Prompt Engineering Strategies for Faster Debugging',
        description: 'Practical prompt engineering patterns for debugging edge cases, refactoring legacy code, and generating comprehensive automated unit tests.',
        thumbnail: null,
        url: 'https://protfoliomee.netlify.app/',
        date: '2025-08-10',
        views: '2.9K',
        duration: '17:40',
    },

    // ============ Blog / Experience Articles ============
    {
        id: 'blog-001',
        platform: 'blog',
        title: 'Full Stack Developer Intern at Gates Cloud Technologies',
        description: 'Hands-on experience developing responsive web applications using HTML, CSS, JavaScript, and PostgreSQL. Focused on REST API integration, bug fixing, and collaborative Git workflow.',
        frontTexture: '/textures/studio/monitorfront_postnafbdoublewinner.webp',
        paintedFrontTexture: '/textures/studio/monitorfront_postnafbdoublewinner_painted.webp',
        thumbnail: null,
        url: 'https://github.com/subbulakshmi0K27',
        date: '2026-02-01',
        readTime: '5 min',
    },
    {
        id: 'blog-002',
        platform: 'blog',
        title: 'React.js Intern at CloudsBySunil x TecGrad Learning',
        description: 'Online intensive internship completing live individual and team projects. Gained hands-on experience in component lifecycle, state management, and modern CSS frameworks.',
        thumbnail: null,
        url: 'https://github.com/subbulakshmi0K27',
        date: '2025-11-15',
        readTime: '4 min',
    },
    {
        id: 'blog-003',
        platform: 'blog',
        title: 'Winner – Logic Architect Award (2nd Prize), CodeFest\'25',
        description: 'Awarded 2nd Prize in CodeFest\'25 Hackathon for creating high-performance algorithms and resilient data architecture under strict time constraints.',
        thumbnail: null,
        url: 'https://protfoliomee.netlify.app/',
        date: '2025-10-05',
        readTime: '6 min',
    },
    {
        id: 'blog-004',
        platform: 'blog',
        title: 'Master of Computer Applications at Mepco Schlenk (CGPA: 8.91)',
        description: 'Pursuing my MCA degree with an 8.91 CGPA, building upon my BSc Computer Science foundation (7.70 CGPA) at Madurai Kamaraj University.',
        thumbnail: null,
        url: 'https://protfoliomee.netlify.app/',
        date: '2026-01-15',
        readTime: '4 min',
    },
    {
        id: 'blog-005',
        platform: 'blog',
        title: 'AI Conclave: Empowering Future Engineers with AI Technologies',
        description: 'Attended the prestigious AI Conclave at Mepco Schlenk Engineering College exploring generative AI, multimodal agents, and applied neural networks.',
        thumbnail: null,
        url: 'https://protfoliomee.netlify.app/',
        date: '2025-09-10',
        readTime: '5 min',
    },
    {
        id: 'blog-006',
        platform: 'blog',
        title: 'Comparative ML Models: Decision Tree vs SVM vs Random Forest',
        description: 'Why Random Forest and SVM achieved the top screening precision (95.10%) in non-invasive anemia healthcare classification.',
        thumbnail: null,
        url: 'https://github.com/subbulakshmi0K27',
        date: '2025-08-20',
        readTime: '7 min',
    },
    {
        id: 'blog-007',
        platform: 'blog',
        title: 'Designing Robust Relational Schemas in MySQL & PostgreSQL',
        description: 'Database normalization, indexing strategies, foreign key constraints, and query planning for high concurrency applications.',
        thumbnail: null,
        url: 'https://github.com/subbulakshmi0K27',
        date: '2025-07-15',
        readTime: '6 min',
    },
    {
        id: 'blog-008',
        platform: 'blog',
        title: 'AI-Assisted Workflow: Google Gemini in the Modern Dev Stack',
        description: 'Using Google Gemini and Claude as collaborative pair programmers to accelerate prototyping from concept to production.',
        thumbnail: null,
        url: 'https://protfoliomee.netlify.app/',
        date: '2025-06-30',
        readTime: '5 min',
    },

    // ============ Shorts / Showcase Items ============
    {
        id: 'tt-001',
        platform: 'tiktok',
        title: 'Explore My GitHub Repositories! 💻✨',
        description: 'Explore full-stack source code, machine learning pipelines, and e-commerce websites on github.com/subbulakshmi0K27',
        frontTexture: '/textures/studio/phonefront_followmeontiktok.webp',
        paintedFrontTexture: '/textures/studio/phonefront_followmeontiktok_painted.webp',
        thumbnail: null,
        url: 'https://github.com/subbulakshmi0K27',
        date: '2026-02-10',
        views: '5.2K',
        likes: '840',
    },
    {
        id: 'tt-002',
        platform: 'tiktok',
        title: '95.10% ML Anemia Model Accuracy 🩺',
        description: 'Healthcare machine learning diagnostics from conjunctiva image analysis.',
        thumbnail: null,
        url: 'https://github.com/subbulakshmi0K27',
        date: '2026-01-18',
        views: '8.5K',
        likes: '1.2K',
    },
    {
        id: 'tt-003',
        platform: 'tiktok',
        title: 'Live Demo: Engenix E-Commerce on Netlify 🛒',
        description: 'Responsive shopping cart, search, and catalog filtering in React.js.',
        thumbnail: null,
        url: 'https://engenix01.netlify.app/',
        date: '2025-12-22',
        views: '12.1K',
        likes: '1.9K',
    },
    {
        id: 'tt-004',
        platform: 'tiktok',
        title: 'MCA Student & Full Stack Developer Routine 🎓',
        description: 'Balancing master degree studies with real-world industry internships.',
        thumbnail: null,
        url: 'https://protfoliomee.netlify.app/',
        date: '2025-11-28',
        views: '7.3K',
        likes: '910',
    },
    {
        id: 'tt-005',
        platform: 'tiktok',
        title: 'Google Gemini Prompting Secrets for Developers 🤖',
        description: 'Transforming requirements into working components in minutes.',
        thumbnail: null,
        url: 'https://protfoliomee.netlify.app/',
        date: '2025-11-05',
        views: '15.4K',
        likes: '2.4K',
    },
    {
        id: 'tt-006',
        platform: 'tiktok',
        title: 'Foxzoid Game Studio Internship Certificate 🎮',
        description: 'Completed 3-month game development internship with distinction.',
        thumbnail: null,
        url: 'https://github.com/subbulakshmi0K27',
        date: '2026-01-30',
        views: '6.8K',
        likes: '820',
    },
    {
        id: 'tt-007',
        platform: 'tiktok',
        title: 'PostgreSQL vs MySQL in Production 🐘🐬',
        description: 'Choosing the right database architecture for full-stack apps.',
        thumbnail: null,
        url: 'https://github.com/subbulakshmi0K27',
        date: '2025-10-14',
        views: '9.2K',
        likes: '1.1K',
    },
    {
        id: 'tt-008',
        platform: 'tiktok',
        title: 'Logic Architect Award - CodeFest\'25 Hackathon 🏆',
        description: 'Proud 2nd Prize winner at CodeFest\'25 Hackathon!',
        thumbnail: null,
        url: 'https://protfoliomee.netlify.app/',
        date: '2025-09-25',
        views: '14.1K',
        likes: '2.3K',
    },
    {
        id: 'tt-009',
        platform: 'tiktok',
        title: 'Django REST Framework + React integration ⚡',
        description: 'Clean API endpoints and responsive frontend bindings.',
        thumbnail: null,
        url: 'https://github.com/subbulakshmi0K27',
        date: '2025-08-30',
        views: '11.6K',
        likes: '1.5K',
    },
    {
        id: 'tt-010',
        platform: 'tiktok',
        title: 'My Online Portfolio is Live! 🌐',
        description: 'Explore my work at protfoliomee.netlify.app',
        thumbnail: null,
        url: 'https://protfoliomee.netlify.app/',
        date: '2025-08-15',
        views: '18.3K',
        likes: '3.1K',
    },
    {
        id: 'tt-011',
        platform: 'tiktok',
        title: 'Why Python & Java empower Full Stack Engineers ☕🐍',
        description: 'From enterprise cloud backends to applied AI pipelines.',
        thumbnail: null,
        url: 'https://github.com/subbulakshmi0K27',
        date: '2025-07-20',
        views: '10.5K',
        likes: '1.4K',
    },
    {
        id: 'tt-012',
        platform: 'tiktok',
        title: 'Let\'s collaborate on impactful projects! 🚀',
        description: 'Subbulakshmi K — Full Stack Developer & AI enthusiast.',
        thumbnail: null,
        url: 'https://protfoliomee.netlify.app/',
        date: '2026-03-05',
        views: '16.7K',
        likes: '2.8K',
    },
];

const ytTextures = ['/textures/studio/tvfront_filmikprojektdlamultiego.webp', '/textures/studio/tvfront_filmikedytowaniezdjec.webp'];
const ytPaintedTextures = ['/textures/studio/tvfront_filmikprojektdlamultiego_painted.webp', '/textures/studio/tvfront_filmikedytowaniezdjec_painted.webp'];
const blogTextures = ['/textures/studio/monitorfront_postnafbdoublewinner.webp'];
const blogPaintedTextures = ['/textures/studio/monitorfront_postnafbdoublewinner_painted.webp'];
const ttTextures = ['/textures/studio/phonefront_followmeontiktok.webp'];
const ttPaintedTextures = ['/textures/studio/phonefront_followmeontiktok_painted.webp'];

let ytIdx = 0, blogIdx = 0, ttIdx = 0;
let ytPIdx = 0, blogPIdx = 0, ttPIdx = 0;

export const CONTENT_DATA = RAW_CONTENT_DATA.map((item) => {
    return {
        ...item,
        frontTexture: item.frontTexture || (
            item.platform === 'youtube' ? ytTextures[ytIdx++ % ytTextures.length] :
                item.platform === 'blog' ? blogTextures[blogIdx++ % blogTextures.length] :
                    ttTextures[ttIdx++ % ttTextures.length]
        ),
        paintedFrontTexture: item.paintedFrontTexture || (
            item.platform === 'youtube' ? ytPaintedTextures[ytPIdx++ % ytPaintedTextures.length] :
                item.platform === 'blog' ? blogPaintedTextures[blogPIdx++ % blogPaintedTextures.length] :
                    ttPaintedTextures[ttPIdx++ % ttPaintedTextures.length]
        )
    };
});

// Helper to get content by platform
export const getContentByPlatform = (platform) => {
    if (platform === 'all') return CONTENT_DATA;
    return CONTENT_DATA.filter(item => item.platform === platform);
};

// Get latest content (for "On Air" indicator)
export const getLatestContent = () => {
    return [...CONTENT_DATA].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
};
