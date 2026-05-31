// Utility to resolve asset paths for images that live under src/data/picsweb
// Mirrors the logic used in TeamPage to allow locating images imported by Vite
// and falling back to public/src paths for unusual formats (HEIC etc.).

// Import all images from the picsweb directory so Vite includes them in the build
const pics = import.meta.glob('../data/picsweb/**/*.{jpg,jpeg,JPG,JPEG,png,PNG,webp,WEBP,gif,GIF}', {
  eager: true,
  import: 'default'
});

export function resolveAssetPath(assetPath) {
  if (!assetPath) return '';
  const path = assetPath.trim();

  // If it's clearly an external URL or an absolute public path, return as-is
  if (/^(https?:)?\/\//i.test(path) || path.startsWith('/')) return path;

  try {
    const filename = path.split('/').pop();
    if (!filename) return path;

    // Try to find a matching imported asset by filename
    const matchedKey = Object.keys(pics).find((key) => key.split('/').pop() === filename);
    if (matchedKey && pics[matchedKey]) return pics[matchedKey];

    // Handle HEIC and other assets not included in the glob
    if (filename.toLowerCase().endsWith('.heic')) {
      return `/src/${path}`;
    }

    // Try a few path variants that may match the glob keys
    const pathVariations = [
      path,
      `/src/${path}`,
      path.replace(/^src\//, '../'),
      `../data/picsweb/${path.split('picsweb/')[1] || ''}`,
    ];

    for (const variant of pathVariations) {
      if (variant && pics[variant]) return pics[variant];
    }

    // Fallback: return path under /src so Vite/public served asset can resolve
    return `/src/${path}`;
  } catch (err) {
    // On error, just return original path
    console.error('[assetResolver] failed to resolve', assetPath, err);
    return assetPath;
  }
}

