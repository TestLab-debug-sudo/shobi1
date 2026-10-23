import { createClient } from '@sanity/client';

const sanityClient = createClient({
    projectId: 'subbulakshmi-dev',
    dataset: 'production',
    useCdn: true,
    apiVersion: '2024-03-01',
});

// Tech stack filename -> human-readable name mapping for JSON-LD
const TECH_STACK_NAMES = {
    'reactlogo.webp': 'React',
    'htmllogo.webp': 'HTML',
    'csslogo.webp': 'CSS',
    'jslogo.webp': 'JavaScript',
    'tailwindlogo.webp': 'Tailwind CSS',
    'firebaselogo.webp': 'Firebase',
    'netlifylogo.webp': 'Netlify',
    'wordpresslogo.webp': 'WordPress',
    'elementorlogo.webp': 'Elementor',
    'phplogo.webp': 'PHP',
};

/**
 * Helper to ensure dates are in ISO-8601 format with timezone for SEO.
 */
function formatIsoDate(dateString) {
    if (!dateString) return undefined;
    if (dateString.includes('T')) return dateString; // Already has time/timezone
    return `${dateString}T12:00:00Z`; // Default to noon UTC
}

/**
 * Build dynamic JSON-LD structured data from Sanity content.
 * This generates schema.org entities that AI search engines (Google AI Overviews,
 * Perplexity, Gemini) use to understand and cite content in their answers.
 */
function buildJsonLd(globalInfo, projects, studio, awards, faqList) {
    const graph = [];

    // --- 1. Person: Central node of the Knowledge Graph ---
    const person = {
        '@type': 'Person',
        '@id': 'https://protfoliomee.netlify.app/#person',
        name: 'Subbulakshmi K',
        alternateName: ['Subbulakshmi', 'Subbu'],
        url: 'https://protfoliomee.netlify.app',
        jobTitle: 'Full Stack Developer',
        description: globalInfo?.aboutMe || 'Full Stack Developer with hands-on experience in React.js, Node.js, Django, Machine Learning & Google Gemini.',
        knowsAbout: ['React.js', 'Node.js', 'Django', 'Python', 'Java', 'JavaScript', 'PostgreSQL', 'MySQL', 'Machine Learning', 'Google Gemini', 'Prompt Engineering'],
        sameAs: [
            'https://github.com/subbulakshmi0K27',
            'https://protfoliomee.netlify.app',
            'https://engenix01.netlify.app'
        ]
    };
    graph.push(person);

    // --- 2. WebSite ---
    const website = {
        '@type': 'WebSite',
        '@id': 'https://protfoliomee.netlify.app/#website',
        url: 'https://protfoliomee.netlify.app',
        name: 'Subbulakshmi K | Full Stack Developer & AI Engineer',
        description: 'Interactive 3D Portfolio of Subbulakshmi K',
        publisher: { '@id': 'https://protfoliomee.netlify.app/#person' }
    };
    graph.push(website);

    // --- 3. ProfilePage ---
    const profilePage = {
        '@type': 'ProfilePage',
        '@id': 'https://protfoliomee.netlify.app/#profilepage',
        url: 'https://protfoliomee.netlify.app',
        mainEntity: { '@id': 'https://protfoliomee.netlify.app/#person' },
        about: { '@id': 'https://protfoliomee.netlify.app/#person' }
    };
    graph.push(profilePage);

    // --- 4. FAQPage (GEO & AI search engine optimizer) ---
    if (faqList && faqList.length > 0) {
        const faqPage = {
            '@type': 'FAQPage',
            '@id': 'https://itomdev.com/#faq',
            mainEntity: faqList.map(item => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: item.answer
                }
            }))
        };
        graph.push(faqPage);
    }

    // --- 5. ItemList: Portfolio Projects (Google rich results for lists) ---
    if (projects && projects.length > 0) {
        graph.push({
            '@type': 'ItemList',
            '@id': 'https://itomdev.com/#projectslist',
            name: 'Portfolio Projects by Tomasz "ITom" Szmajda',
            description: 'Selected web development projects showcasing React, Three.js, and creative frontend engineering.',
            numberOfItems: projects.length,
            itemListElement: projects.map((p, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item: {
                    '@type': 'CreativeWork',
                    name: p.seoTitle || p.title,
                    description: p.seoDescription || p.description || '',
                    url: p.url || undefined,
                    creator: { '@id': 'https://itomdev.com/#person' },
                    ...(p.techStack && p.techStack.length > 0 ? {
                        keywords: p.techStack.map(t => TECH_STACK_NAMES[t] || t).join(', ')
                    } : {}),
                }
            }))
        });

        // Individual CreativeWork entries for each project (richer detail)
        projects.forEach(p => {
            const projectSlug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            graph.push({
                '@type': 'CreativeWork',
                '@id': `https://itomdev.com/#project-${projectSlug}`,
                name: p.seoTitle || p.title,
                description: p.seoDescription || p.description || '',
                url: p.url || undefined,
                creator: { '@id': 'https://itomdev.com/#person' },
                ...(p.techStack && p.techStack.length > 0 ? {
                    keywords: p.techStack.map(t => TECH_STACK_NAMES[t] || t).join(', ')
                } : {}),
            });
        });
    }

    // --- 6. Studio Content (YouTube -> VideoObject, Blog -> Article, TikTok -> VideoObject) ---
    if (studio && studio.length > 0) {
        studio.forEach((s, idx) => {
            const studioSlug = `studio-item-${idx}`;
            if (s.platform === 'youtube') {
                let embedUrl = undefined;
                if (s.url) {
                    const ytMatch = s.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^"&?\/\s]{11})/);
                    if (ytMatch && ytMatch[1]) {
                        embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
                    }
                }

                graph.push({
                    '@type': 'VideoObject',
                    '@id': `https://itomdev.com/#${studioSlug}`,
                    name: s.seoTitle || s.title,
                    description: s.seoDescription || s.description || '',
                    url: s.url || undefined,
                    contentUrl: s.url || undefined,
                    ...(embedUrl ? { embedUrl } : {}),
                    thumbnailUrl: s.thumbnailUrl || 'https://itomdev.com/og-image.webp',
                    ...(s.duration ? { duration: `PT${s.duration.replace(':', 'M')}S` } : {}),
                    ...(s.date ? { uploadDate: formatIsoDate(s.date) } : {}),
                    ...(s.views ? { interactionStatistic: { '@type': 'InteractionCounter', interactionType: 'https://schema.org/WatchAction', userInteractionCount: s.views } } : {}),
                    author: { '@id': 'https://itomdev.com/#person' },
                });
            } else if (s.platform === 'blog') {
                graph.push({
                    '@type': 'Article',
                    '@id': `https://itomdev.com/#${studioSlug}`,
                    headline: s.seoTitle || s.title,
                    description: s.seoDescription || s.description || '',
                    url: s.url || undefined,
                    image: s.thumbnailUrl || 'https://itomdev.com/og-image.webp',
                    ...(s.date ? { datePublished: formatIsoDate(s.date) } : {}),
                    ...(s.readTime ? { timeRequired: `PT${s.readTime.replace(' min', '')}M` } : {}),
                    author: { '@id': 'https://itomdev.com/#person' },
                });
            } else if (s.platform === 'tiktok') {
                graph.push({
                    '@type': 'VideoObject',
                    '@id': `https://itomdev.com/#${studioSlug}`,
                    name: s.seoTitle || s.title,
                    description: s.seoDescription || s.description || '',
                    url: s.url || undefined,
                    contentUrl: s.url || undefined,
                    thumbnailUrl: s.thumbnailUrl || 'https://itomdev.com/og-image.webp',
                    ...(s.date ? { uploadDate: formatIsoDate(s.date) } : {}),
                    ...(s.views ? { interactionStatistic: { '@type': 'InteractionCounter', interactionType: 'https://schema.org/WatchAction', userInteractionCount: s.views } } : {}),
                    ...(s.likes ? { aggregateRating: { '@type': 'AggregateRating', ratingCount: s.likes } } : {}),
                    author: { '@id': 'https://itomdev.com/#person' },
                });
            } else if (s.platform === 'instagram' || s.platform === 'x' || s.platform === 'linkedin') {
                graph.push({
                    '@type': 'SocialMediaPosting',
                    '@id': `https://itomdev.com/#${studioSlug}`,
                    headline: s.seoTitle || s.title,
                    description: s.seoDescription || s.description || '',
                    url: s.url || undefined,
                    image: s.thumbnailUrl || 'https://itomdev.com/og-image.webp',
                    ...(s.date ? { datePublished: formatIsoDate(s.date) } : {}),
                    ...(s.likes ? { interactionStatistic: { '@type': 'InteractionCounter', interactionType: 'https://schema.org/LikeAction', userInteractionCount: s.likes } } : {}),
                    author: { '@id': 'https://itomdev.com/#person' },
                });
            } else if (s.platform === 'codrops') {
                graph.push({
                    '@type': 'Article',
                    '@id': `https://itomdev.com/#${studioSlug}`,
                    headline: s.seoTitle || s.title,
                    description: s.seoDescription || s.description || '',
                    url: s.url || undefined,
                    image: s.thumbnailUrl || 'https://itomdev.com/og-image.webp',
                    ...(s.date ? { datePublished: formatIsoDate(s.date) } : {}),
                    author: { '@id': 'https://itomdev.com/#person' },
                });
            }
        });
    }

    // --- 7. Awards as schema.org Award/CreativeWork ---
    if (awards && awards.length > 0) {
        const categoryLabels = { sotd: 'Site of the Day', sotm: 'Site of the Month', other: 'Honorable Mention' };
        graph.push({
            '@type': 'ItemList',
            '@id': 'https://itomdev.com/#awardslist',
            name: 'Academic & Technical Awards received by Subbulakshmi K',
            numberOfItems: awards.length,
            itemListElement: awards.map((a, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item: {
                    '@type': 'CreativeWork',
                    name: `${categoryLabels[a.category] || a.category} — ${a.seoTitle || a.title}`,
                    ...(a.date ? { dateCreated: formatIsoDate(a.date) } : {}),
                    url: a.url || undefined,
                    description: a.seoDescription || undefined,
                    award: categoryLabels[a.category] || a.category,
                    creator: { '@id': 'https://protfoliomee.netlify.app/#person' },
                }
            }))
        });
    }

    return {
        '@context': 'https://schema.org',
        '@graph': graph
    };
}

// Helper to generate the llms.txt content in clean Markdown
function buildLlmsTxt(globalInfo, projects, studio, awards, faqList) {
    const siteTitle = globalInfo?.siteTitle || 'Subbulakshmi K | Full Stack Developer & AI Engineer';
    const siteDescription = globalInfo?.siteDescription || 'Interactive 3D Developer Portfolio of Subbulakshmi K';
    const aboutMe = globalInfo?.aboutMe || 'Full Stack Developer with hands-on experience building responsive web applications using React.js, Node.js, Django, and SQL databases, along with applied machine learning and Google Gemini AI development.';

    let content = `# ${siteTitle}\n`;
    content += `> ${siteDescription}\n\n`;

    content += `## Biography / About Me\n`;
    content += `${aboutMe}\n\n`;

    content += `## Core Technologies & Skills\n`;
    content += `- Python, Java, JavaScript, React.js, Node.js, Django, REST APIs, PostgreSQL, MySQL, Machine Learning, Google Gemini, Prompt Engineering, HTML5, CSS3, Git.\n\n`;

    if (projects && projects.length > 0) {
        content += `## Selected Portfolio Projects\n`;
        projects.forEach(p => {
            const tech = p.techStack ? ` (Tech: ${p.techStack.map(t => TECH_STACK_NAMES[t] || t).join(', ')})` : '';
            content += `- [${p.seoTitle || p.title}](${p.url || 'https://protfoliomee.netlify.app'}): ${p.seoDescription || p.description || ''}${tech}\n`;
        });
        content += `\n`;
    }

    if (studio && studio.length > 0) {
        content += `## Studio Content & Publications\n`;
        studio.forEach(s => {
            content += `- [${s.seoTitle || s.title} (${s.platform})](${s.url || 'https://protfoliomee.netlify.app'}): ${s.seoDescription || s.description || ''}\n`;
        });
        content += `\n`;
    }

    if (awards && awards.length > 0) {
        content += `## Design Awards & Achievements\n`;
        const categoryLabels = { sotd: 'Site of the Day', sotm: 'Site of the Month', other: 'Honorable Mention' };
        awards.forEach(a => {
            const category = categoryLabels[a.category] || a.category;
            content += `- **${category}** — [${a.seoTitle || a.title}](${a.url || 'https://protfoliomee.netlify.app'}): Awarded on ${a.date || 'unknown'}. ${a.seoDescription || ''}\n`;
        });
        content += `\n`;
    }

    if (faqList && faqList.length > 0) {
        content += `## Frequently Asked Questions (FAQ)\n`;
        faqList.forEach(item => {
            content += `- **${item.question}**\n`;
            content += `  ${item.answer.replace(/\n/g, '\n  ')}\n`;
        });
    }

    return content;
}

export function generateSeoHtml() {
    let cachedLlmsContent = '';

    async function getLlmsContent() {
        if (!cachedLlmsContent) {
            if (sanityClient.config().projectId === 'subbulakshmi-dev') {
                const subbuProjects = [
                    { title: 'Engenix E-Commerce Website', url: 'https://engenix01.netlify.app/', description: 'Responsive e-commerce web platform with product catalog, search filters, cart state management, and user authentication.', techStack: ['reactlogo.webp', 'jslogo.webp', 'csslogo.webp'] },
                    { title: 'Anemia Prediction Using Eye Conjunctiva', url: 'https://github.com/subbulakshmi0K27', description: 'Non-invasive machine learning healthcare diagnostics achieving 95.10% accuracy using Decision Tree, SVM, and Random Forest on conjunctiva imagery.', techStack: ['jslogo.webp'] },
                    { title: 'Secure Logging as a Service (SLAAS)', url: 'https://github.com/subbulakshmi0K27', description: 'Cloud-based secure log management and analytics infrastructure engineered with Java and MySQL.', techStack: [] },
                    { title: 'Cyber Hacking Breaches Prediction & Detection', url: 'https://github.com/subbulakshmi0K27', description: 'Machine learning threat detection system analyzing historical cyber security attack vectors.', techStack: ['htmllogo.webp', 'jslogo.webp'] }
                ];
                const subbuStudio = [
                    { title: 'Gates Cloud Technologies — Full Stack Developer Intern', platform: 'blog', description: 'Engineered responsive web apps with HTML5, CSS3, JavaScript, PostgreSQL, API integration & Git workflows.' },
                    { title: 'CloudsBySunil x TecGrad — React.js Project Intern', platform: 'blog', description: 'Live individual & team projects in React.js, collaborative software delivery and problem solving.' },
                    { title: 'Foxzoid Game Studio LLP — Game Developer Intern', platform: 'blog', description: 'Iterative development, performance tuning, and earned Certificate of Completion.' },
                    { title: 'Google Gemini & AI-Assisted Engineering', platform: 'blog', description: 'Workflows integrating ChatGPT, Claude, and Google Gemini for accelerated development and testing.' }
                ];
                const subbuAwards = [
                    { title: 'Logic Architect Award (2nd Prize) — CodeFest 25', category: 'sotd', date: '2025-02-15', description: 'Honored for optimal system design and problem solving in hackathon competition.' },
                    { title: 'MCA Degree — CGPA 8.91 (Mepco Schlenk Engineering College)', category: 'sotm', date: '2024-2026', description: 'Master of Computer Applications academic excellence.' },
                    { title: 'BSc Computer Science — CGPA 7.70 (Madurai Kamaraj University)', category: 'other', date: '2021-2024', description: 'Undergraduate computer science foundations.' },
                    { title: 'AI Conclave Participant: Empowering Future Engineers with AI', category: 'other', date: '2025-01-20', description: 'Technical conclave at Mepco Schlenk Engineering College.' }
                ];
                const subbuFaq = [
                    { question: 'Who is Subbulakshmi K?', answer: 'Subbulakshmi K is a Full Stack Developer & AI Engineer specializing in React.js, Node.js, Django, Machine Learning, and Google Gemini.' },
                    { question: 'What is Subbulakshmi K\'s education?', answer: 'MCA (Master of Computer Applications) with CGPA 8.91 at Mepco Schlenk Engineering College (2024-2026) and BSc Computer Science with CGPA 7.70 at Madurai Kamaraj University (2021-2024).' },
                    { question: 'How can I contact Subbulakshmi K?', answer: 'Email: subbulakshmi0k27@gmail.com, Phone: +91 8778584218, GitHub: github.com/subbulakshmi0K27, Portfolio: protfoliomee.netlify.app' }
                ];
                cachedLlmsContent = buildLlmsTxt(null, subbuProjects, subbuStudio, subbuAwards, subbuFaq);
                return cachedLlmsContent;
            }

            try {
                const [globalInfo, projects, studio, awards, faqList] = await Promise.all([
                    sanityClient.fetch(`*[_id == "globalInfo"][0]`),
                    sanityClient.fetch(`*[_type == "galleryProject"]`),
                    sanityClient.fetch(`*[_type == "studioItem"]`),
                    sanityClient.fetch(`*[_type == "awardCertificate"]`),
                    sanityClient.fetch(`*[_type == "faq"]`)
                ]);
                cachedLlmsContent = buildLlmsTxt(globalInfo, projects, studio, awards, faqList);
            } catch (e) {
                console.error('SEO Plugin Error: Failed to fetch Sanity data for llms.txt', e);
                cachedLlmsContent = `# Subbulakshmi K\n> Full Stack Developer & AI Engineer\n`;
            }
        }
        return cachedLlmsContent;
    }

    return {
        name: 'sanity-seo-plugin',

        // Serve llms.txt in local development mode
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                if (req.url === '/llms.txt') {
                    const content = await getLlmsContent();
                    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                    res.end(content);
                } else {
                    next();
                }
            });
        },

        // This hook runs when Vite generates or serves index.html
        async transformIndexHtml(html) {
            if (sanityClient.config().projectId === 'subbulakshmi-dev') {
                return html;
            }
            try {
                // Fetch all data in parallel
                const [globalInfo, projects, studio, awards, faqList] = await Promise.all([
                    sanityClient.fetch(`*[_id == "globalInfo"][0]`),
                    sanityClient.fetch(`*[_type == "galleryProject"]`),
                    sanityClient.fetch(`*[_type == "studioItem"] { ..., "thumbnailUrl": frontTexture.asset->url }`),
                    sanityClient.fetch(`*[_type == "awardCertificate"]`),
                    sanityClient.fetch(`*[_type == "faq"]`)
                ]);

                // Fallback values for Subbulakshmi K
                const siteTitle = 'Subbulakshmi K | Full Stack Developer & AI Engineer Portfolio';
                const siteDescription = 'Interactive 3D developer portfolio of Subbulakshmi K — Full Stack Developer & AI Engineer. Hands-on experience building responsive web apps using React.js, Node.js, Django, and applied Machine Learning.';
                const aboutMe = 'Full Stack Developer with hands-on experience building responsive web applications using React.js, Node.js, Django, and SQL databases, along with applied machine learning projects spanning healthcare diagnostics and cybersecurity. Skilled in AI-assisted software development, Prompt Engineering, and working with ChatGPT, Claude, and Google Gemini.';

                // Cache llms.txt content for later bundle emission
                cachedLlmsContent = buildLlmsTxt(globalInfo, projects, studio, awards, faqList);

                // ====== PART 1: Build the semantic HTML string ======
                let seoHtml = `\n<div id="seo-content" class="sr-only-seo">\n`;
                
                seoHtml += `  <header>\n`;
                seoHtml += `    <h1>${siteTitle}</h1>\n`;
                seoHtml += `    <p>${siteDescription}</p>\n`;
                seoHtml += `  </header>\n`;

                seoHtml += `  <section id="about">\n`;
                seoHtml += `    <h2>About Me</h2>\n`;
                seoHtml += `    <p>${aboutMe}</p>\n`;
                if (globalInfo?.githubUrl) seoHtml += `    <a href="${globalInfo.githubUrl}">GitHub</a>\n`;
                if (globalInfo?.linkedinUrl) seoHtml += `    <a href="${globalInfo.linkedinUrl}">LinkedIn</a>\n`;
                seoHtml += `  </section>\n`;

                if (projects && projects.length > 0) {
                    seoHtml += `  <section id="projects">\n    <h2>Projects</h2>\n    <ul>\n`;
                    projects.forEach(p => {
                        seoHtml += `      <li>\n        <h3>${p.seoTitle || p.title}</h3>\n        <p>${p.seoDescription || p.description || ''}</p>\n        ${p.url ? `<a href="${p.url}">Visit ${p.seoTitle || p.title}</a>\n` : ''}      </li>\n`;
                    });
                    seoHtml += `    </ul>\n  </section>\n`;
                }

                if (studio && studio.length > 0) {
                    seoHtml += `  <section id="studio">\n    <h2>The Studio (Content)</h2>\n    <ul>\n`;
                    studio.forEach(s => {
                        seoHtml += `      <li>\n        <h3>${s.seoTitle || s.title} (${s.platform})</h3>\n        <p>${s.seoDescription || s.description || ''}</p>\n        ${s.url ? `<a href="${s.url}">View Content</a>\n` : ''}      </li>\n`;
                    });
                    seoHtml += `    </ul>\n  </section>\n`;
                }

                if (awards && awards.length > 0) {
                    seoHtml += `  <section id="awards">\n    <h2>Awards & Certificates</h2>\n    <ul>\n`;
                    awards.forEach(a => {
                        seoHtml += `      <li>\n        <h3>${a.seoTitle || a.title}</h3>\n        <p>${a.category} - ${a.date}</p>\n        <p>${a.seoDescription || ''}</p>\n        ${a.url ? `<a href="${a.url}">Link</a>\n` : ''}      </li>\n`;
                    });
                    seoHtml += `    </ul>\n  </section>\n`;
                }

                // FAQ Section (GEO/AI search optimizer fallback)
                if (faqList && faqList.length > 0) {
                    seoHtml += `  <section id="faq">\n`;
                    seoHtml += `    <h2>Frequently Asked Questions (FAQ)</h2>\n`;
                    faqList.forEach(item => {
                        seoHtml += `    <article>\n`;
                        seoHtml += `      <h3>${item.question}</h3>\n`;
                        seoHtml += `      <p>${item.answer}</p>\n`;
                        seoHtml += `    </article>\n`;
                    });
                    seoHtml += `  </section>\n`;
                }

                seoHtml += `</div>\n`;

                // ====== PART 2: Build dynamic JSON-LD ======
                const jsonLdSchemas = buildJsonLd(globalInfo, projects, studio, awards, faqList);
                const jsonLdScript = `\n  <!-- Dynamic Structured Data (JSON-LD) — generated from Sanity at build time -->\n  <script type="application/ld+json">\n${JSON.stringify(jsonLdSchemas, null, 2)}\n  </script>\n`;

                // ====== PART 3: Transform HTML ======
                // Update the <title> tag
                let transformedHtml = html.replace(
                    /<title>(.*?)<\/title>/,
                    `<title>${siteTitle}</title>`
                );
                
                // Add or replace meta description
                if (transformedHtml.includes('<meta name="description"')) {
                    transformedHtml = transformedHtml.replace(
                        /<meta name="description" content="(.*?)"\s*\/?>/,
                        `<meta name="description" content="${siteDescription}" />`
                    );
                } else {
                    transformedHtml = transformedHtml.replace(
                        '</head>',
                        `  <meta name="description" content="${siteDescription}" />\n</head>`
                    );
                }

                // Update Open Graph dynamic metadata
                transformedHtml = transformedHtml
                    .replace(
                        /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
                        `<meta property="og:title" content="${siteTitle}" />`
                    )
                    .replace(
                        /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
                        `<meta property="og:description" content="${siteDescription}" />`
                    );

                // Update Twitter card dynamic metadata
                transformedHtml = transformedHtml
                    .replace(
                        /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
                        `<meta name="twitter:title" content="${siteTitle}" />`
                    )
                    .replace(
                        /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
                        `<meta name="twitter:description" content="${siteDescription}" />`
                    );

                // Inject dynamic JSON-LD right before </head> (next to the existing static one)
                transformedHtml = transformedHtml.replace('</head>', `${jsonLdScript}</head>`);

                // Replace the static placeholder with the dynamic one to prevent duplicate #seo-content and double h1s
                if (transformedHtml.includes('id="seo-content"')) {
                    transformedHtml = transformedHtml.replace(
                        /<div id="seo-content" class="sr-only-seo">[\s\S]*?<\/div>/,
                        seoHtml
                    );
                } else {
                    // Fallback injection if the template doesn't contain the static block
                    transformedHtml = transformedHtml.replace('</body>', `${seoHtml}</body>`);
                }

                return transformedHtml;
            } catch (error) {
                console.error('SEO Plugin Error: Failed to fetch Sanity data', error);
                // Return original HTML on failure so we don't break the build
                return html;
            }
        },

        // Emit llms.txt to the build output directory
        async generateBundle() {
            const content = await getLlmsContent();
            this.emitFile({
                type: 'asset',
                fileName: 'llms.txt',
                source: content
            });
        }
    };
}
