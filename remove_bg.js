const sharp = require('sharp');
const fs = require('fs');

async function removeBlackBackground(inputPath, outputPath) {
  try {
    const { data, info } = await sharp(inputPath)
      .raw()
      .ensureAlpha()
      .toBuffer({ resolveWithObject: true });

    // Loop through all pixels (4 channels: RGBA)
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // If the pixel is dark (close to black), make it transparent
      // The closer to black, the more transparent
      const brightness = (r + g + b) / 3;
      if (brightness < 30) {
        // Soft edge blending
        data[i + 3] = brightness * (255 / 30);
      }
    }

    await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4
      }
    })
    .png()
    .toFile(outputPath);
    console.log(`Successfully processed ${inputPath}`);
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

const input = process.argv[2];
const output = process.argv[3];
if (input && output) {
  removeBlackBackground(input, output);
} else {
  console.log("Usage: node remove_bg.js <input> <output>");
}
