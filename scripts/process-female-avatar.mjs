import sharp from 'sharp';
import fs from 'fs';

async function processAvatar(inputPath, outputPath) {
    const image = sharp(inputPath);
    const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const { width, height, channels } = info;

    // Flood fill from borders to identify outer background
    const visited = new Uint8Array(width * height);
    const queue = [];

    // Helper to get index
    const getIdx = (x, y) => y * width + x;

    // Is pixel "background white" (e.g. > 242 on R, G, B)
    const isBg = (x, y) => {
        const p = (y * width + x) * channels;
        return data[p] > 240 && data[p + 1] > 240 && data[p + 2] > 240;
    };

    // Add borders to queue
    for (let x = 0; x < width; x++) {
        if (isBg(x, 0)) { visited[getIdx(x, 0)] = 1; queue.push(x, 0); }
        if (isBg(x, height - 1)) { visited[getIdx(x, height - 1)] = 1; queue.push(x, height - 1); }
    }
    for (let y = 0; y < height; y++) {
        if (isBg(0, y)) { visited[getIdx(0, y)] = 1; queue.push(0, y); }
        if (isBg(width - 1, y)) { visited[getIdx(width - 1, y)] = 1; queue.push(width - 1, y); }
    }

    let head = 0;
    while (head < queue.length) {
        const cx = queue[head++];
        const cy = queue[head++];

        const neighbors = [
            [cx - 1, cy],
            [cx + 1, cy],
            [cx, cy - 1],
            [cx, cy + 1]
        ];

        for (const [nx, ny] of neighbors) {
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const nIdx = getIdx(nx, ny);
                if (!visited[nIdx] && isBg(nx, ny)) {
                    visited[nIdx] = 1;
                    queue.push(nx, ny);
                }
            }
        }
    }

    // Set alpha = 0 for all connected background pixels
    let transparentCount = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = getIdx(x, y);
            const p = idx * channels;
            if (visited[idx]) {
                data[p + 3] = 0; // alpha = 0
                transparentCount++;
            } else {
                // Ensure inside is fully opaque
                data[p + 3] = 255;
            }
        }
    }

    console.log(`Processed ${inputPath}: ${transparentCount} transparent pixels out of ${width * height}`);

    await sharp(data, {
        raw: {
            width,
            height,
            channels
        }
    })
    .webp({ quality: 95, lossless: true })
    .toFile(outputPath);
}

const input1 = 'C:/Users/ruban/.gemini/antigravity-ide/brain/f841bceb-677b-44f0-8848-6203c9506db7/female_sketch_avatar_1792758358334.jpg';
const input2 = 'C:/Users/ruban/.gemini/antigravity-ide/brain/f841bceb-677b-44f0-8848-6203c9506db7/female_sketch_wave_1792758380087.jpg';
const input3 = 'C:/Users/ruban/.gemini/antigravity-ide/brain/f841bceb-677b-44f0-8848-6203c9506db7/female_sketch_wave_3_1792758404915.jpg';

async function run() {
    await processAvatar(input1, 'public/textures/corridor/avatar_anim/female_1.webp');
    await processAvatar(input2, 'public/textures/corridor/avatar_anim/female_2.webp');
    await processAvatar(input3, 'public/textures/corridor/avatar_anim/female_3.webp');
    console.log('Done processing female avatar frames!');
}

run().catch(console.error);
