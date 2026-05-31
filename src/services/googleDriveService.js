/**
 * Google Drive API Service
 * Fetches images from Google Drive folder structure
 * Main folder contains subfolders (event names), each subfolder contains images
 */

const GOOGLE_DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';

/**
 * Build Google Drive API query
 * @param {string} parentFolderId - Parent folder ID
 * @param {string} mimeType - MIME type filter (optional)
 * @returns {string} - Encoded query string
 */
const buildQuery = (parentFolderId, mimeType = null) => {
    let query = `'${parentFolderId}' in parents and trashed = false`;
    if (mimeType) {
        query += ` and mimeType = '${mimeType}'`;
    }
    return encodeURIComponent(query);
};

/**
 * Get direct download URL for a Google Drive file
 * @param {string} fileId - Google Drive file ID
 * @returns {string} - Download URL
 */
const getDownloadUrl = (fileId) => {
    // Use export=view which generally works for browser display of public images
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
};

/**
 * Fetch folders from Google Drive
 * @param {string} folderId - Parent folder ID
 * @param {string} apiKey - Google Drive API key
 * @returns {Promise<Array>} - Array of folder objects {id, name}
 */
export const fetchGoogleDriveFolders = async (folderId, apiKey) => {
    try {
        const query = buildQuery(folderId, 'application/vnd.google-apps.folder');
        const url = `${GOOGLE_DRIVE_API_BASE}/files?q=${query}&key=${apiKey}&fields=files(id,name)&pageSize=100`;

        console.log('[GDrive] Fetching folders...');
        const response = await fetch(url);

        if (!response.ok) {
            const error = await response.json();
            return Promise.reject(new Error(`Google Drive API error: ${error.error?.message || response.statusText}`));
        }

        const data = await response.json();
        console.log(`[GDrive] Found ${data.files?.length || 0} folders`);
        return data.files || [];
    } catch (error) {
        console.error('[GDrive] Error fetching folders:', error);
        throw error;
    }
};

/**
 * Fetch images from a specific folder
 * @param {string} folderId - Folder ID containing images
 * @param {string} apiKey - Google Drive API key
 * @returns {Promise<Array>} - Array of image objects {id, name, mimeType}
 */
export const fetchGoogleDriveImages = async (folderId, apiKey) => {
    try {
        const imageTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml',
        ];

        // Build query for image files
        let query = `'${folderId}' in parents and trashed = false and (`;
        query += imageTypes.map((type) => `mimeType = '${type}'`).join(' or ');
        query += ')';

        // Request thumbnail and webView/webContent links when available
        const url = `${GOOGLE_DRIVE_API_BASE}/files?q=${encodeURIComponent(query)}&key=${apiKey}&fields=files(id,name,mimeType,createdTime,thumbnailLink,webViewLink,webContentLink)&pageSize=100&orderBy=createdTime desc`;

        console.log(`[GDrive] Fetching images from folder: ${folderId}`);
        const response = await fetch(url);

        if (!response.ok) {
            const error = await response.json();
            return Promise.reject(new Error(`Google Drive API error: ${error.error?.message || response.statusText}`));
        }

        const data = await response.json();
        console.log(`[GDrive] Found ${data.files?.length || 0} images in folder`);
        return data.files || [];
    } catch (error) {
        console.error(`[GDrive] Error fetching images from folder ${folderId}:`, error);
        throw error;
    }
};

/**
 * Fetch all gallery data from Google Drive
 * Main folder contains category subfolders, each subfolder contains images
 * @param {string} mainFolderId - Main gallery folder ID
 * @param {string} apiKey - Google Drive API key
 * @returns {Promise<Array>} - Array of gallery items with images grouped by category
 */
export const fetchGalleryFromGoogleDrive = async (mainFolderId, apiKey) => {
    try {
        console.log('[GDrive] Starting gallery fetch...');

        // Step 1: Fetch all category folders
        const categoryFolders = await fetchGoogleDriveFolders(mainFolderId, apiKey);

        if (categoryFolders.length === 0) {
            console.warn('[GDrive] No category folders found');
            return [];
        }

        // Step 2: For each category folder, fetch images
        const galleryItems = [];
        let itemId = 1;

        for (const folder of categoryFolders) {
            console.log(`[GDrive] Processing category: ${folder.name}`);
            const images = await fetchGoogleDriveImages(folder.id, apiKey);

            // Convert folder name to title (capitalize and replace underscores)
            const title = folder.name
                .replace(/_/g, ' ')
                .replace(/^./, (str) => str.toUpperCase());

            const categoryName = folder.name;

            for (const image of images) {
                // Prefer thumbnailLink (fast, small) then webContentLink then webViewLink then a constructed view URL
                const previewUrl = image.thumbnailLink || image.webContentLink || image.webViewLink || getDownloadUrl(image.id);
                galleryItems.push({
                    id: itemId++,
                    category: categoryName,
                    categoryLabel: title,
                    title: image.name.replace(/\.[^/.]+$/, ''),
                    imgSrc: getDownloadUrl(image.id),
                    previewUrl,
                    mimeType: image.mimeType,
                    googleDriveId: image.id,
                });
            }
        }

        console.log(`[GDrive] Total gallery items fetched: ${galleryItems.length}`);
        return galleryItems;
    } catch (error) {
        console.error('[GDrive] Error fetching gallery from Google Drive:', error);
        throw error;
    }
};

/**
 * Get unique categories from gallery items
 * @param {Array} galleryItems - Array of gallery items
 * @returns {Array} - Array of unique category labels
 */
export const getCategories = (galleryItems) => {
    const uniqueCategories = new Set(galleryItems.map((item) => item.categoryLabel));
    return ['All Works', ...Array.from(uniqueCategories).sort()];
};



