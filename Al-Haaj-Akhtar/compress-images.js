import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── GUARD FUNCTIONS ─────────────────────────────────────────────

function hasExistingBackups(dir) {
    if (!fs.existsSync(dir)) return false;
    return fs.readdirSync(dir).some(f => f.endsWith('.bak'));
}

function countBackups(dir) {
    if (!fs.existsSync(dir)) return 0;
    return fs.readdirSync(dir).filter(f => f.endsWith('.bak')).length;
}

function getOriginalFromBackup(backupPath) {
    return backupPath.replace(/\.bak$/, '');
}

// ─── BACKUP FUNCTION ───────────────────────────────────────────

function backupFiles(dir, extensions) {
    if (!fs.existsSync(dir)) return 0;
    const files = fs.readdirSync(dir).filter(f => {
        const ext = path.extname(f).toLowerCase();
        return extensions.includes(ext) && !f.endsWith('.bak');
    });
    for (const file of files) {
        const srcPath = path.join(dir, file);
        const backupPath = `${srcPath}.bak`;
        if (!fs.existsSync(backupPath)) {
            fs.copyFileSync(srcPath, backupPath);
        }
    }
    return files.length;
}

// ─── FFMPEG HELPERS ─────────────────────────────────────────────

function checkFfmpeg() {
    try {
        execSync('ffmpeg -version', { stdio: 'pipe' });
        return true;
    } catch (e) {
        return false;
    }
}

function getVideoDuration(videoPath) {
    try {
        const output = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`, { encoding: 'utf8' });
        return parseFloat(output.trim());
    } catch (e) {
        return null;
    }
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// ─── VIDEO COMPRESSION ─────────────────────────────────────────

function compressVideo(inputPath, outputPath, crf = 28) {
    try {
        const cmd = `ffmpeg -i "${inputPath}" -vcodec libx264 -crf ${crf} -preset medium -movflags +faststart -acodec aac -b:a 128k "${outputPath}" -y`;
        execSync(cmd, { stdio: 'pipe' });
        return true;
    } catch (e) {
        console.error(`   ❌ Failed to compress: ${path.basename(inputPath)} - ${e.message}`);
        return false;
    }
}

async function compressVideosInDir(dir, label) {
    if (!fs.existsSync(dir)) return 0;

    const videoExts = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
    const files = fs.readdirSync(dir).filter(f => {
        const ext = path.extname(f).toLowerCase();
        return videoExts.includes(ext) && !f.endsWith('.bak') && !f.includes('_compressed');
    });

    if (files.length === 0) return 0;

    console.log(`📁 Compressing ${label}...`);
    let compressedCount = 0;
    let totalOriginalSize = 0;
    let totalCompressedSize = 0;

    for (const file of files) {
        const inputPath = path.join(dir, file);
        const ext = path.extname(file);
        const baseName = path.basename(file, ext);
        const outputPath = path.join(dir, `${baseName}_compressed.mp4`);

        // Skip if compressed output already exists from previous run
        if (fs.existsSync(outputPath)) {
            console.log(`   ⏭️  Skipping (already compressed): ${file}`);
            continue;
        }

        // Create backup if not exists
        const backupPath = `${inputPath}.bak`;
        if (!fs.existsSync(backupPath)) {
            fs.copyFileSync(inputPath, backupPath);
        }

        const originalSize = fs.statSync(inputPath).size;
        const duration = getVideoDuration(inputPath);

        console.log(`   🎬 ${file}${duration ? ` (${Math.round(duration)}s)` : ''} - ${formatBytes(originalSize)}`);

        if (compressVideo(inputPath, outputPath)) {
            const compressedSize = fs.statSync(outputPath).size;
            const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

            // Replace original with compressed
            fs.unlinkSync(inputPath);
            fs.renameSync(outputPath, inputPath);

            console.log(`      ✅ ${formatBytes(compressedSize)} (${savings}% smaller)`);
            compressedCount++;
            totalOriginalSize += originalSize;
            totalCompressedSize += compressedSize;
        }
    }

    if (compressedCount > 0) {
        const totalSavings = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1);
        console.log(`   ✓ Compressed ${compressedCount} videos (${formatBytes(totalOriginalSize)} → ${formatBytes(totalCompressedSize)}, ${totalSavings}% saved)\n`);
    } else {
        console.log(`   ℹ️ No new videos to compress\n`);
    }

    return compressedCount;
}

// ─── IMAGE COMPRESSION ──────────────────────────────────────────

async function compressImages() {
    const foodDir = path.join(__dirname, 'public', 'food');
    const publicDir = path.join(__dirname, 'public');
    const cateringDir = path.join(__dirname, 'public', 'catering');

    // ─── GUARD: Check for existing backups ─────────────────────────
    const dirs = [foodDir, publicDir, cateringDir].filter(d => fs.existsSync(d));
    const backupCounts = dirs.map(d => ({ dir: d, count: countBackups(d) }));
    const totalBackups = backupCounts.reduce((sum, d) => sum + d.count, 0);

    if (totalBackups > 0) {
        console.log('⚠️  GUARD TRIGGERED: Backups already exist!');
        console.log('   Image compression skipped to prevent double-compression.\n');
        backupCounts.forEach(({ dir, count }) => {
            if (count > 0) console.log(`   • ${path.basename(dir)}: ${count} backup(s)`);
        });
        console.log('\n💡 To re-compress from originals, delete .bak files first.\n');
        return;
    }

    console.log('Creating backups...\n');

    // Create backups
    const backupCount = backupFiles(foodDir, ['.png', '.jpg', '.jpeg']);
    backupFiles(cateringDir, ['.png', '.jpg', '.jpeg']);
    backupFiles(publicDir, ['.png', '.jpg', '.jpeg']);
    console.log(`✓ Backed up ${backupCount} files (.bak extension)\n`);

    console.log('Compressing images...\n');

    // Compress PNG files in /public/food
    console.log('📁 Compressing /public/food PNGs...');
    const foodPngs = await imagemin([`${foodDir}/*.png`], {
        destination: foodDir,
        plugins: [imageminPngquant({ quality: [0.6, 0.7] })]
    });
    console.log(`   ✓ Compressed ${foodPngs.length} PNG files`);

    // Compress JPG/JPEG files in /public/food
    console.log('📁 Compressing /public/food JPEGs...');
    const foodJpgs = await imagemin([`${foodDir}/*.{jpg,jpeg}`], {
        destination: foodDir,
        plugins: [imageminMozjpeg({ quality: 65 })]
    });
    console.log(`   ✓ Compressed ${foodJpgs.length} JPEG files`);

    // Compress files in /public/catering
    console.log('📁 Compressing /public/catering...');
    let cateringCount = 0;
    try {
        const cateringJpgs = await imagemin([`${cateringDir}/*.jpg`], {
            destination: cateringDir,
            plugins: [imageminMozjpeg({ quality: 65 })]
        });
        cateringCount += cateringJpgs.length;
    } catch (e) { /* ignore */ }
    try {
        const cateringJpegs = await imagemin([`${cateringDir}/*.jpeg`], {
            destination: cateringDir,
            plugins: [imageminMozjpeg({ quality: 65 })]
        });
        cateringCount += cateringJpegs.length;
    } catch (e) { /* ignore */ }
    console.log(`   ✓ Compressed ${cateringCount} files`);

    // Compress main public images
    console.log('📁 Compressing main public images...');
    const mainImages = await imagemin([`${publicDir}/*.{png,jpg,jpeg}`], {
        destination: publicDir,
        plugins: [
            imageminPngquant({ quality: [0.6, 0.7] }),
            imageminMozjpeg({ quality: 65 })
        ]
    });
    console.log(`   ✓ Compressed ${mainImages.length} main images`);

    console.log('\n✅ All images compressed successfully!');
}

// ─── VIDEO COMPRESSION ─────────────────────────────────────────

async function compressVideos() {
    const foodDir = path.join(__dirname, 'public', 'food');
    const publicDir = path.join(__dirname, 'public');
    const cateringDir = path.join(__dirname, 'public', 'catering');
    const hallDir = path.join(__dirname, 'public', 'Hall');

    if (!checkFfmpeg()) {
        console.log('\n⚠️  ffmpeg not found. Skipping video compression.');
        console.log('   Install ffmpeg to enable video compression:');
        console.log('   • Windows: choco install ffmpeg  or  download from ffmpeg.org');
        console.log('   • Mac: brew install ffmpeg');
        console.log('   • Linux: sudo apt install ffmpeg\n');
        return 0;
    }

    console.log('Compressing videos...\n');

    let totalCompressed = 0;
    totalCompressed += await compressVideosInDir(foodDir, '/public/food videos');
    totalCompressed += await compressVideosInDir(publicDir, 'main public videos');
    totalCompressed += await compressVideosInDir(cateringDir, '/public/catering videos');
    totalCompressed += await compressVideosInDir(hallDir, '/public/Hall videos');

    if (totalCompressed === 0) {
        console.log('ℹ️  No new videos found to compress\n');
    }

    return totalCompressed;
}

// ─── MAIN ──────────────────────────────────────────────────────

async function compressAssets() {
    console.log('╔════════════════════════════════════════╗');
    console.log('║     Asset Compression Tool 🗜️         ║');
    console.log('╚════════════════════════════════════════╝\n');

    await compressImages();
    console.log('');
    await compressVideos();

    console.log('\n═══════════════════════════════════════════');
    console.log('✅ All assets processed successfully!');
    console.log('💡 Backups saved with .bak extension');
    console.log('═══════════════════════════════════════════');
}

compressAssets().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});