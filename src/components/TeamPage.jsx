import './Team.css';
import teamData from '../data/team.json';
import { useMemo, useState } from 'react';

// Import all team images from the picsweb directory - support common image formats
const backgroundImages = import.meta.glob('../data/picsweb/**/*.{jpg,jpeg,JPG,JPEG,png,PNG,webp,WEBP,gif,GIF}', {
    eager: true,
    import: 'default'
});

const resolveAssetPath = (assetPath) => {
    if (!assetPath || assetPath.trim() === '') return '';
    
    try {
        // Get the filename from the path
        const filename = assetPath.split('/').pop();
        if (!filename) return '';
        
        // First, try to find a matching image by filename in glob imports
        const matchedKey = Object.keys(backgroundImages).find(key => {
            const keyFilename = key.split('/').pop();
            return keyFilename === filename;
        });
        
        if (matchedKey && backgroundImages[matchedKey]) {
            return backgroundImages[matchedKey];
        }
        
        // For HEIC files and other assets not in glob, use them as-is
        // Vite will serve them from the public/src directory
        if (filename.toLowerCase().endsWith('.heic')) {
            return `/src/${assetPath}`;
        }
        
        // Fallback: try direct key matches with different path formats
        const pathVariations = [
            assetPath,
            `/src/${assetPath}`,
            assetPath.replace(/^src\//, '../'),
            `../data/picsweb/${assetPath.split('picsweb/')[1] || ''}`,
        ];
        
        for (const variant of pathVariations) {
            if (variant && backgroundImages[variant]) {
                return backgroundImages[variant];
            }
        }
        
        // If still not found, return as-is (might be an asset path)
        return `/src/${assetPath}`;
    } catch (err) {
        console.error('[Team] Failed to resolve asset path:', assetPath, err);
        return '';
    }
};

const TeamPage = () => {
    const hero = teamData.hero || {};
    const cta = teamData.cta || {};

    // Year-wise team data
    const yearsObj = useMemo(() => teamData.years || {}, []);
    const availableYears = useMemo(() => Object.keys(yearsObj).sort((a, b) => b.localeCompare(a)), [yearsObj]);
    const currentYearStr = new Date().getFullYear().toString();
    const defaultYear = availableYears.includes(currentYearStr) ? currentYearStr : (availableYears[0] || currentYearStr);
    const [selectedYear, setSelectedYear] = useState(defaultYear);

    const yearTeam = yearsObj[selectedYear] || {};
    const heroBackgroundImage = resolveAssetPath(yearTeam.backgroundImage || hero.backgroundImage || '');
    const teamMembers = yearTeam.team || [];

    return (
        <div className="page-shell">
            <main>
                {/* Hero Section */}
                <section
                    className={`team-hero container ${heroBackgroundImage ? 'team-hero--featured' : ''}`}
                    style={heroBackgroundImage ? {
                        backgroundImage: `linear-gradient(135deg, rgba(0, 10, 30, 0.82), rgba(0, 10, 30, 0.52)), url(${heroBackgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    } : undefined}
                >
                    <h1>{hero.title}</h1>
                    <p>{hero.description}</p>
                </section>

                {/* Team Section */}
                <section className="section container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        {availableYears.length > 1 && (
                            <div className="year-selector">
                                <label className="sr-only" htmlFor="team-year-select">Select year</label>
                                <select
                                    id="team-year-select"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    aria-label="Select team year"
                                >
                                    {availableYears.map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                    <div className="board-grid">
                        {teamMembers.map((member) => {
                            const resolvedImage = member.image ? resolveAssetPath(member.image) : '';
                            return (
                            <article key={member.id} className="board-card">
                                {resolvedImage && (
                                    <div className="board-card__image">
                                        <img src={resolvedImage} alt={member.name} loading="lazy" />
                                    </div>
                                )}
                                <h3>{member.name}</h3>
                                <p>{member.role}</p>
                                {member.socials && member.socials.length > 0 && (
                                    <div className="board-card__socials">
                                        {member.socials.map((social) => (
                                            <a key={social.icon} href={social.url} className="social-btn" aria-label={social.label}>
                                                <span className="material-symbols-outlined">{social.icon}</span>
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </article>
                            );
                        })}
                    </div>
                </section>

                {/* Call to Action */}
                <section className="container">
                    <div className="cta-panel">
                        <h2>{cta.title}</h2>
                        <p>{cta.description}</p>
                        <div className="cta-actions">
                            <button
                                className="button button--accent"
                                onClick={() => window.location.href = cta.primaryButtonLink}
                            >
                                {cta.primaryButtonText}
                            </button>

                            <button
                                className="button button--outline"
                                onClick={() => window.location.href = cta.secondaryButtonLink}
                            >
                                {cta.secondaryButtonText}
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default TeamPage;
