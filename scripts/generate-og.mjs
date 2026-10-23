import sharp from 'sharp';
import fs from 'fs';

async function makeOg() {
  const width = 1200;
  const height = 630;

  const svgText = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f7f4ed"/>
      <circle cx="150" cy="120" r="120" fill="#ede7da" opacity="0.7"/>
      <circle cx="550" cy="500" r="180" fill="#e5decb" opacity="0.5"/>
      <rect x="80" y="60" width="8" height="130" fill="#1a1a1a" rx="4"/>
      
      <text x="110" y="110" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="46" fill="#111827" letter-spacing="1">SUBBULAKSHMI K</text>
      <text x="110" y="160" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="26" fill="#2563eb" letter-spacing="1">FULL STACK DEVELOPER</text>
      <text x="110" y="215" font-family="system-ui, -apple-system, sans-serif" font-weight="500" font-size="20" fill="#374151">React.js • Node.js • Django • Python • PostgreSQL • MySQL</text>
      <text x="110" y="250" font-family="system-ui, -apple-system, sans-serif" font-weight="500" font-size="20" fill="#4b5563">AI-Assisted Software Engineering • Google Gemini &amp; Prompt Engg.</text>

      <line x1="110" y1="290" x2="620" y2="290" stroke="#d1d5db" stroke-width="2"/>

      <text x="110" y="340" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="18" fill="#1f2937">🎓 MCA | Mepco Schlenk Engg. College (CGPA 8.91)</text>
      <text x="110" y="380" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="18" fill="#1f2937">🏆 Winner – Logic Architect Award (2nd Prize, CodeFest'25)</text>
      <text x="110" y="420" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="18" fill="#1f2937">💼 Full Stack Developer Intern – Gates Cloud Tech (2025-2026)</text>
      <text x="110" y="460" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="18" fill="#1f2937">🌐 https://protfoliomee.netlify.app/ | github.com/subbulakshmi0K27</text>

      <rect x="110" y="505" width="290" height="52" rx="26" fill="#111827"/>
      <text x="255" y="538" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="17" fill="#ffffff" text-anchor="middle">VIEW 3D INTERACTIVE PORTFOLIO</text>
    </svg>
  `;

  const portrait = await sharp('public/images/subbulakshmi.png')
    .resize({ height: 600, fit: 'inside' })
    .toBuffer();

  const portraitMeta = await sharp(portrait).metadata();
  const portraitLeft = width - portraitMeta.width - 40;
  const portraitTop = height - portraitMeta.height;

  await sharp(Buffer.from(svgText))
    .composite([
      { input: portrait, left: portraitLeft, top: portraitTop }
    ])
    .webp({ quality: 92 })
    .toFile('public/og-image.webp');

  console.log('Successfully created public/og-image.webp');
}

makeOg().catch(console.error);
