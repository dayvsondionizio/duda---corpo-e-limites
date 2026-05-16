/**
 * Script to autocrop whitespace from character PNG images.
 * Uses 'sharp' to trim all non-significant borders (white/transparent pixels).
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const publicDir = path.join(__dirname, 'public');

const images = [
  'char_menina.png',
  'char_menina_loira.png',
  'char_menina_morena.png',
  'char_menina_negra.png',
  'char_menino.png',
];

async function cropImage(filename) {
  const inputPath = path.join(publicDir, filename);
  const outputPath = path.join(publicDir, filename); // overwrite

  const backupPath = path.join(publicDir, `_backup_${filename}`);
  
  // Backup original first
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(inputPath, backupPath);
    console.log(`  Backup created: _backup_${filename}`);
  }

  try {
    const img = sharp(inputPath);
    const meta = await img.metadata();
    console.log(`\n[${filename}]`);
    console.log(`  Original: ${meta.width}x${meta.height}px`);

    // trim() removes borders matching the top-left corner color (usually white/grey)
    // threshold: 30 means "consider pixels within 30 brightness units of the corner as background"
    await sharp(inputPath)
      .trim({ background: '#ffffff', threshold: 30 })
      .png()
      .toFile(outputPath + '.tmp');

    // Read cropped metadata
    const croppedMeta = await sharp(outputPath + '.tmp').metadata();
    console.log(`  Cropped:  ${croppedMeta.width}x${croppedMeta.height}px`);
    
    // Replace original
    fs.renameSync(outputPath + '.tmp', outputPath);
    console.log(`  ✓ Saved!`);

  } catch (err) {
    console.error(`  ✗ Error: ${err.message}`);
    // Try alternative approach with just .trim()
    try {
      await sharp(inputPath)
        .trim()
        .png()
        .toFile(outputPath + '.tmp');
      fs.renameSync(outputPath + '.tmp', outputPath);
      console.log(`  ✓ Saved with default trim!`);
    } catch (err2) {
      console.error(`  ✗ Also failed: ${err2.message}`);
    }
  }
}

async function main() {
  console.log('=== Autocrop Character Images ===\n');
  
  for (const img of images) {
    await cropImage(img);
  }
  
  console.log('\n=== Done! All images cropped. ===');
  console.log('Backups saved as _backup_*.png in public/');
}

main().catch(console.error);
