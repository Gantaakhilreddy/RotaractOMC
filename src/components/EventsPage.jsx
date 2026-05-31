import './Events.css';
import eventsData from '../data/events.json';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resolveAssetPath } from '../utils/assetResolver';

const EventsPage = () => {
    const navigate = useNavigate();
    const hero = eventsData.hero;
    const upcomingSection = eventsData.upcomingSection || {};
    const pastSection = eventsData.pastSection || {};
    const cta = eventsData.cta || {};
    const upcomingEvents = eventsData.upcomingEvents || [];

    // Year-wise data for Past Successes only
    const yearsObj = useMemo(() => eventsData.years || {}, []);
    const availableYears = useMemo(() => Object.keys(yearsObj).sort((a, b) => b.localeCompare(a)), [yearsObj]);
    const currentYearStr = new Date().getFullYear().toString();
    const defaultYear = availableYears.includes(currentYearStr) ? currentYearStr : (availableYears[0] || currentYearStr);
    const [selectedYear, setSelectedYear] = useState(defaultYear);
    const yearData = yearsObj[selectedYear] || { pastEvents: [] };

    return (
        <div className="page-shell">
            <main>
                {/* Hero Section */}
                <section className="about-hero">
                    <div className="container">
                        <span className="eyebrow">{hero.eyebrow}</span>
                        <h1 className="text-balance">{hero.title}</h1>
                        <p>
                            {hero.description}
                        </p>
                    </div>
                </section>

                {/* Upcoming Drives Section (No Year Selector) */}
                <section className="section">
                    <div className="container">
                        <div className="events-header">
                            <div>
                                <h2>{upcomingSection.title}</h2>
                                <p>{upcomingSection.description}</p>
                            </div>
                            {upcomingSection.periodLabel && (
                                <span className="event-card__location">{upcomingSection.periodLabel}</span>
                            )}
                        </div>

                        <div className="events-grid">
                            {upcomingEvents.map((event) => (
                                <article key={event.id} className="event-card">
                                        <div className="event-card__image">
                                        <img src={resolveAssetPath(event.image)} alt={event.title} />
                                        {event.badge ? <span className="event-card__badge">{event.badge}</span> : null}
                                    </div>
                                    <div className="event-card__content">
                                        <div className="event-card__meta">
                                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>calendar_today</span>
                                            {event.date}
                                        </div>
                                        <h3 className="event-card__title">{event.title}</h3>
                                        <p className="event-card__desc">
                                            {event.description}
                                        </p>
                                        <div className="event-card__footer">
                                            <button
                                                type="button"
                                                className="event-link"
                                                onClick={() => navigate('/gallery')}
                                            >
                                                {event.linkText} <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                                            </button>
                                            <span className="event-card__location">{event.location}</span>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Past Successes Section (With Year Selector) */}
                <section className="section section--surface-low">
                    <div className="container">
                        <div className="events-header events-header--primary">
                            <div>
                                <h2>{pastSection.title}</h2>
                                <p>{pastSection.description}</p>
                            </div>
                            {availableYears.length > 1 && (
                                <div className="year-selector">
                                    <label className="sr-only" htmlFor="past-year-select">Select year</label>
                                    <select
                                        id="past-year-select"
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                        aria-label="Select year for past successes"
                                    >
                                        {availableYears.map((y) => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="past-grid">
                            {(yearData.pastEvents || []).map((event) => (
                                <article key={event.id} className="past-card">
                                    <div className="past-card__image">
                                        <img src={resolveAssetPath(event.image)} alt={event.title} />
                                    </div>
                                    <div className="past-card__content">
                                        <span className="past-card__status">{event.status}</span>
                                        <h4 className="past-card__title">{event.title}</h4>
                                        <p className="past-card__desc">
                                            {event.description}
                                        </p>
                                        <button
                                            type="button"
                                            className="past-link"
                                            onClick={() => navigate('/gallery')}
                                        >
                                            {event.linkText} <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="section">
                    <div className="container">
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
                    </div>
                </section>
            </main>
        </div>
    );
};

export default EventsPage;