#!/usr/bin/env node
/*
  Node script to fetch gallery items from Google Drive and write a static
  JSON cache to `public/gallery-cache.json`. The app will first try to load
  this static file to avoid calling the Drive API from browsers.

  Usage: node scripts/refresh-gallery.js
  Requirements: create a `.env` file at project root with VITE_GOOGLE_DRIVE_API_KEY
*/
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

// Load .env
dotenv.config();

import { fetchGalleryFromGoogleDrive } from '../src/services/googleDriveService.js';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const OUT_FILE = path.join(ROOT, 'public', 'gallery-cache.json');
const CONFIG_PATH = path.join(ROOT, 'src', 'data', 'gallery-config.json');

const run = async () => {
  try {
    const apiKey = process.env.VITE_GOOGLE_DRIVE_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_GOOGLE_DRIVE_API_KEY not found in environment. Create a .env file with this key.');
    }

    const configRaw = await fs.readFile(CONFIG_PATH, 'utf-8');
    const config = JSON.parse(configRaw);
    const folderId = config.googleDrive?.folderId;
    if (!folderId || folderId.includes('example')) {
      throw new Error('No valid folderId set in src/data/gallery-config.json');
    }

    console.log('[refresh-gallery] Fetching gallery from Google Drive...');
    const items = await fetchGalleryFromGoogleDrive(folderId, apiKey);
    const out = {
      timestamp: Date.now(),
      items,
    };

    await fs.writeFile(OUT_FILE, JSON.stringify(out, null, 2), 'utf-8');
    console.log(`[refresh-gallery] Wrote ${items.length} items to ${OUT_FILE}`);
  } catch (err) {
    console.error('[refresh-gallery] Error:', err);
    process.exit(1);
  }
};

run();

