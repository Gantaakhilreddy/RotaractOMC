import './Team.css';
import teamData from '../data/team.json';
import { useMemo, useState } from 'react';

const backgroundImages = import.meta.glob('../data/picsweb/**/*.{jpg,jpeg,png,PNG,JPG,JPEG,webp,WEBP}', {
    eager: true,
    import: 'default'
});

const resolveAssetPath = (assetPath) => {
    if (!assetPath) return '';

    const normalizedPath = assetPath.replace(/^src\//, '../');
    return backgroundImages[normalizedPath] || '';
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
                        {teamMembers.map((member) => (
                            <article key={member.id} className="board-card">
                                {member.image && (
                                    <div className="board-card__image">
                                        <img src={member.image} alt={member.name} />
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
                        ))}
                    </div>
                </section>

                {/* Call to Action */}
                <section className="container">
                    <div className="cta-panel">
                        <h2>{cta.title}</h2>
                        <p>{cta.description}</p>
                        <div className="cta-actions">
                            <button className="button button--accent">{cta.primaryButtonText}</button>
                            <button className="button button--outline">{cta.secondaryButtonText}</button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default TeamPage;
