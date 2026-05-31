import { useEffect, useMemo, useState } from 'react';
import './Gallery.css';
import { getCachedData, setCachedData } from '../services/cacheService';
import { fetchGalleryFromGoogleDrive, getCategories } from '../services/googleDriveService';
import galleryConfig from '../data/gallery-config.json';
const FALLBACK_GALLERY_DATA = [
    {
        id: 1,
        category: 'Medical Camp',
        categoryLabel: 'Medical Camp',
        title: 'Rural Health Check-up',
        imgSrc: "src/data/picsweb/HomePageSlider/picone.jpeg"
    },
    {
        id: 2,
        category: 'Fellowship',
        categoryLabel: 'Fellowship',
        title: 'Annual Induction Ceremony',
        imgSrc: "src/data/picsweb/HomePageSlider/PicTwo.jpeg"
    },
    {
        id: 3,
        category: 'Outreach',
        categoryLabel: 'Outreach',
        title: 'Health Awareness Seminar',
        imgSrc: "src/data/picsweb/HomePageSlider/PicThree.jpeg"
    },
    {
        id: 4,
        category: 'Outreach',
        categoryLabel: 'Outreach',
        title: 'Education Initiative',
        imgSrc: "src/data/picsweb/HomePageSlider/PicFour.jpeg"
    },
    {
        id: 5,
        category: 'Medical Camp',
        categoryLabel: 'Medical Camp',
        title: 'Logistics & Supply',
        imgSrc: "src/data/picsweb/HomePageSlider/PicFive.jpeg"
    },
    {
        id: 6,
        category: 'Fellowship',
        categoryLabel: 'Fellowship',
        title: 'Charter Night Celebration',
        imgSrc:  "src/data/picsweb/HomePageSlider/PicSix.jpeg"
    }
];
const GalleryPage = () => {
    const [galleryData, setGalleryData] = useState(FALLBACK_GALLERY_DATA);
    const [filters, setFilters] = useState(['All Works', 'Medical Camp', 'Outreach', 'Fellowship']);
    const [activeFilter, setActiveFilter] = useState('All Works');
    const [lightboxImg, setLightboxImg] = useState(null);
    const [loadingGallery, setLoadingGallery] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const cacheKey = useMemo(() => {
        const folderId = galleryConfig.googleDrive.folderId || 'gallery';
        return `gallery_v2_${folderId}`;
    }, []);
    useEffect(() => {
        const loadGalleryData = async () => {
            try {
                const apiKey = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;
                const folderId = galleryConfig.googleDrive.folderId;
                // Allow either explicit ms or days to configure TTL
                const cacheDurationMs = Number(galleryConfig.googleDrive.cacheDurationMs)
                    || (Number(galleryConfig.googleDrive.cacheDurationDays) * 24 * 60 * 60 * 1000)
                    || 22 * 24 * 60 * 60 * 1000;

                // Try in-browser cache (localStorage)
                if (apiKey && folderId && !folderId.includes('example')) {
                    const cachedData = getCachedData(cacheKey, cacheDurationMs);
                    if (cachedData?.length) {
                        setGalleryData(cachedData);
                        setFilters(getCategories(cachedData));
                        setActiveFilter('All Works');
                        setLoadingGallery(false);
                        return;
                    }
                }

                // If no cache found and Google Drive is configured, fetch and cache new data
                if (apiKey && folderId && !folderId.includes('example')) {
                    const freshData = await fetchGalleryFromGoogleDrive(folderId, apiKey);
                    if (!freshData.length) {
                        throw new Error('No images found in the configured Google Drive folder.');
                    }
                    // Save to in-browser cache for fast subsequent visits
                    setCachedData(cacheKey, freshData);
                    setGalleryData(freshData);
                    setFilters(getCategories(freshData));
                    setActiveFilter('All Works');
                    setLoadingGallery(false);
                    return;
                }

                // If not configured, use fallback data
                setGalleryData(FALLBACK_GALLERY_DATA);
                setFilters(['All Works', 'Medical Camp', 'Outreach', 'Fellowship']);
                setLoadingGallery(false);
            } catch (error) {
                setErrorMessage(error?.message || 'Failed to load gallery.');
                setGalleryData(FALLBACK_GALLERY_DATA);
                setFilters(['All Works', 'Medical Camp', 'Outreach', 'Fellowship']);
                setLoadingGallery(false);
            }
        };
        loadGalleryData();
    }, [cacheKey]);
    const filteredGallery = galleryData.filter((item) => {
        if (activeFilter === 'All Works') return true;
        return (item.categoryLabel || item.category) === activeFilter;
    });
    return (
        <div className="page-shell">
            <main className="container">
                <header className="gallery-header">
                    <h1>{galleryConfig.gallery.pageTitle}</h1>
                    <p>{galleryConfig.gallery.pageDescription}</p>
                </header>
                <div className="gallery-frame">
                    {loadingGallery && (
                        <div className="gallery-loading">
                            <div className="loading-spinner"></div>
                            <p>Loading gallery...</p>
                        </div>
                    )}
                    {errorMessage && (
                        <div className="gallery-error">
                            <span className="material-symbols-outlined">error</span>
                            <div>
                                <p><strong>Could not load gallery:</strong> {errorMessage}</p>
                                <small>Showing fallback gallery data for now.</small>
                            </div>
                        </div>
                    )}
                    {!loadingGallery && (
                        <div className="gallery-filters">
                            {filters.map((filter) => (
                                <button
                                    key={filter}
                                    className={`filter-btn ${activeFilter === filter ? 'filter-btn--active' : ''}`}
                                    onClick={() => setActiveFilter(filter)}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    )}
                    {!loadingGallery && (
                        <div className="masonry-grid">
                            {filteredGallery.map((item) => {
                                const imageSrc = item.previewUrl || item.imgSrc;
                                return (
                                    <article key={item.id} className="masonry-item">
                                        <div
                                            className="gallery-card__image-container"
                                            onClick={() => setLightboxImg(imageSrc)}
                                        >
                                            <img
                                                src={imageSrc}
                                                alt={item.title}
                                                loading="lazy"
                                                onError={(e) => {
                                                    if (e.currentTarget.src !== item.imgSrc) {
                                                        e.currentTarget.src = item.imgSrc;
                                                    }
                                                }}
                                            />
                                            <div className="gallery-card__overlay">
                                                <span className="material-symbols-outlined">zoom_in</span>
                                            </div>
                                        </div>

                                    </article>
                                );
                            })}
                        </div>
                    )}
                    {galleryConfig.gallery.enableLoadMore && !loadingGallery && (
                        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                            <button className="button button--outline">Load More Memories</button>
                        </div>
                    )}
                </div>
            </main>
            {lightboxImg && (
                <div className="lightbox" onClick={() => setLightboxImg(null)}>
                    <button
                        className="lightbox__close"
                        onClick={(e) => {
                            e.stopPropagation();
                            setLightboxImg(null);
                        }}
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <img
                        src={lightboxImg}
                        alt="Expanded view"
                        className="lightbox__image"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};
export default GalleryPage;


