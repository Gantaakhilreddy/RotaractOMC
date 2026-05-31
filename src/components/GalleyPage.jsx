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
        imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDv1WyGTlI1v6RKluyjluyeoes1CJtFSQQejMKKZsg90qvDsItKl5ZGCDHUuCzoCmH_Hr5xhoEUBuvIAbcOhLsQPhJDF90VdMl8S69OHw1ybZuFIhH2SfvdUe55t-HPEMq6uOJj1yO_BBSdiiMtzi4_Xr-bTWj3nf6L4-gYdjtWMF9OChpFTG5Q8DMsV9IKhyW6EG-yp_Q6BQ4QOUuFcxrFU6ktcijUB-Ore4HWD-wIzEwFOEhSCc5u6NBWGKLYDmEzsto7HBn0c6H'
    },
    {
        id: 2,
        category: 'Fellowship',
        categoryLabel: 'Fellowship',
        title: 'Annual Induction Ceremony',
        imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATf0PrPhbNmp8r-2OBdVogmtN5Xs7uCk-n35bv46LerQHJVfZOmN_jrSFnrek7Z2Glj_G86KcPYn3Ek0jBrRiaYWXhJ5DoyaxbWhE1cWLCOiRMOZmiORLO7CIkX56evqjkVa6CflHVwMZ6mmfQeri98au4QN6sH7L_kYpufkOe2Xp1dTRvAajTlfK213rwe-Nym7NWMddHqqj0-0H-Nm4nK8RvsIssIAa_vjyj6V5A4yTqA5ACBahPjP9kxtL4rppHHOarPF7MEUu2'
    },
    {
        id: 3,
        category: 'Outreach',
        categoryLabel: 'Outreach',
        title: 'Health Awareness Seminar',
        imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6OJ7is9Oo7pzBB4-sghXoxx7y0xgqbnW_4NrifSL-fUNIJczjZocYhgNTLCXAuRxLvmaVs0pw7xuMCMa_WYLVkDNN28xBOXWtCMArLU9TaaMjzsrDGo6cKXxg6ZgF0hiDfnpWbI_27aCSei6sVayi1mVMX6sHxXiwBbp6Tgf1BElpaYRrlgQEVcRH1sjOEMeDTYzkmcbloxacPjEXHH-EIqrOXhRXKaD8E0aCdR122gsLPb_5resch2ua-SoZR-Djq5PZ5tv8iLkj'
    },
    {
        id: 4,
        category: 'Outreach',
        categoryLabel: 'Outreach',
        title: 'Education Initiative',
        imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmLG2XWtQwSDbP-_ZuEwmcPgK5D049f8CC50iJ9jhdV4ePgf1U5CoIpxc2HUcaZamkcZNlNQD16iQkbpnuVfKw3ZpWQk1V_B7UsEK8e63ccrgn92iGZPnquZ9UFKoLLg0IE1_7Xc-MEdblbxhWOAAbJNHPtjPwMBFB7jZ_pQHHBdbx3Tx5LzYSBwwn4KXsvjnWWu8ww96p4k56GrKqIO4UkTrrbeyOqaqnJAb0iwFzJM2sFWhuYKseEcWKc2LbBPRSuOc-DgbjXeAs'
    },
    {
        id: 5,
        category: 'Medical Camp',
        categoryLabel: 'Medical Camp',
        title: 'Logistics & Supply',
        imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdpknEiJUeLKI5krrjqKhkhApvosmptXQg7I7Z4qUj49a0IOKYjrL0gUQFBB-yNFMF-XG3eLe-b2bfxomotQJalit5PL-nZpOBdzle0GajA6xQRH2vI-VWI49xbTdsrrCNIICIYg5g7qBFvhtP59MU7bVCVYOlO2QJqNl1DUD3tgSLiel3ohJixEn8RNeq_Kg6YJUUFWAIHA9rgdytT2EkSfyR4j2kkYclKJQ9oEPdsn5TdnXd4XegA6XoRo3s233pBruqctL-Er-f'
    },
    {
        id: 6,
        category: 'Fellowship',
        categoryLabel: 'Fellowship',
        title: 'Charter Night Celebration',
        imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2RzrltcdcnhyEQpuyljcg8UsV02AU874PoPr9twHnGRe4eoW02AWKNzNsQG8ZMzjcIF3YL1oZzS9z3kC6xcwi4GvRDCIqOegiGjkImzgED1n6uS6oA-pXon7HFRRqnJSeYcZZ24W4fVjjJra'
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
                                        <div className="gallery-card__content">
                                            <p className="gallery-card__category">{item.categoryLabel || item.category}</p>
                                            <h3 className="gallery-card__title">{item.title}</h3>
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


