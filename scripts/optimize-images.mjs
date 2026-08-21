// Optimizes and renames the portfolio thumbnails, and (re)optimizes any
// per-work detail images already dropped into src/assets/img/detail/<slug>/.
// Run with: yarn optimize-images
//
// Originals are preserved (untouched) under .image-backups/ before anything
// in src/assets is renamed or overwritten, so this is safe to re-run.
import { existsSync } from 'node:fs';
import { copyFile, mkdir, readdir, rename, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const THUMBNAIL_DIR = path.join(ROOT, 'src/assets/img/detailimg/thumbnail');
const DETAIL_DIR = path.join(ROOT, 'src/assets/img/detailimg/detail');
const BACKUP_DIR = path.join(ROOT, '.image-backups');

const THUMBNAIL_MAX = { width: 1400, height: 1867 }; // generous for retina at the sizes it's shown
const DETAIL_MAX = { width: 2000, height: 2000 };
const QUALITY = 82;

// old inconsistent filename -> unified slug (also used to look up detail/<slug>)
const THUMBNAIL_SLUGS = {
  'Parkjangho_thumbnail.jpg': 'parkjangho',
  'kimjiwon_thumbnail.jpg': 'kimjiwon',
  'leesemin_thumbnail.jpg': 'leesemin',
  'kimgyubeen_thumbnail.jpg': 'kimgyubeen',
  'Jungwoohyun_thumbnail.jpg': 'jungwoohyun',
  'LeeLynn_thumbnail.jpg': 'leelynn',
  'choseoyoung_thumbnail.jpg': 'choseoyoung',
  'kimseongjae_thumbnail.jpg': 'kimseongjae',
  'Xu Ning_thumbnail.jpg': 'xuning',
  'OhSeongkeon_thumbnail.png': 'ohseongkeon',
  'Jeongjieun_thumbnail.jpg': 'jeongjieun',
  'kangdahyun__thumbnail.PNG': 'kangdahyun',
  'Leejihee_thumbnail.jpeg': 'leejihee',
  'jiuhyun_thumbnail.jpg': 'jiuhyun',
  'yangjungwon_thumbnail.jpg': 'yangjungwon',
  'kimsihyun_thumbnail.jpg': 'kimsihyun',
  'baekdanha_thumbnail.jpg': 'baekdanha',
  'kimseeun_thumbnail.jpg': 'kimseeun',
  'yangeuiyeol_thumbnail.jpg': 'yangeuiyeol',
  'baeyujin_thumbnail.jpg': 'baeyujin',
  'yeodana_thumbnail.jpg': 'yeodana',
  'HwangJiwon_thumbnail.jpg': 'hwangjiwon',
};

async function backup(sourcePath, label) {
  const dest = path.join(BACKUP_DIR, label, path.basename(sourcePath));
  await mkdir(path.dirname(dest), { recursive: true });
  await copyFile(sourcePath, dest);
}

const KNOWN_SLUGS = new Set(Object.values(THUMBNAIL_SLUGS));

async function optimizeThumbnails() {
  const entries = await readdir(THUMBNAIL_DIR);
  let converted = 0;

  for (const filename of entries) {
    // already-optimized output from a previous run — leave it alone
    if (filename.endsWith('.webp') && KNOWN_SLUGS.has(path.parse(filename).name)) continue;

    const slug = THUMBNAIL_SLUGS[filename];
    const sourcePath = path.join(THUMBNAIL_DIR, filename);

    if (!slug) {
      console.warn(`  ! no slug mapping for "${filename}" — moving to backup, not used by any work`);
      await backup(sourcePath, 'thumbnail-unmatched');
      await rm(sourcePath);
      continue;
    }

    await backup(sourcePath, 'thumbnail-original');

    const outputPath = path.join(THUMBNAIL_DIR, `${slug}.webp`);
    await sharp(sourcePath)
      .resize({ ...THUMBNAIL_MAX, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outputPath + '.tmp');
    await rm(sourcePath);
    await rename(outputPath + '.tmp', outputPath);
    converted += 1;
  }

  console.log(`thumbnails: optimized ${converted} file(s) -> ${THUMBNAIL_DIR}`);
}

async function optimizeDetailImages() {
  if (!existsSync(DETAIL_DIR)) return;

  const slugDirs = await readdir(DETAIL_DIR, { withFileTypes: true });
  let converted = 0;

  for (const dirent of slugDirs) {
    if (!dirent.isDirectory()) continue;
    const slugPath = path.join(DETAIL_DIR, dirent.name);
    const files = await readdir(slugPath);

    for (const filename of files) {
      if (filename.startsWith('.') || filename.endsWith('.webp')) continue;
      const sourcePath = path.join(slugPath, filename);
      if (!(await stat(sourcePath)).isFile()) continue;

      await backup(sourcePath, `detail-original/${dirent.name}`);

      const base = path
        .parse(filename)
        .name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-');
      const outputPath = path.join(slugPath, `${base}.webp`);
      await sharp(sourcePath)
        .resize({ ...DETAIL_MAX, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(outputPath + '.tmp');
      await rm(sourcePath);
      await rename(outputPath + '.tmp', outputPath);
      converted += 1;
    }
  }

  console.log(`detail images: optimized ${converted} file(s) -> ${DETAIL_DIR}`);
}

await optimizeThumbnails();
await optimizeDetailImages();
