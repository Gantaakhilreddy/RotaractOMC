import { useEffect, useState } from 'react'
import './About.css'
import { resolveAssetPath } from '../utils/assetResolver'

const AboutPage = () => {
    const [aboutContent, setAboutContent] = useState(null)

    useEffect(() => {
        let mounted = true

        fetch('/about-page.json')
            .then((response) => response.json())
            .then((data) => {
                if (mounted) setAboutContent(data)
            })
            .catch(() => {
                if (mounted) setAboutContent({})
            })

        return () => {
            mounted = false
        }
    }, [])

    const bentoCards = aboutContent?.bentoCards ?? []
    const timelineItems = aboutContent?.timeline ?? []
    return (
        <div className="page-shell">
            {/* Navigation */}


            <main>
                {/* Page Header */}
                <header className="about-header">
                    <div className="container">
                        <div className="about-header__content">
                            <span className="eyebrow">{aboutContent?.header?.eyebrow}</span>
                            <h1>{aboutContent?.header?.title}</h1>
                            <p>{aboutContent?.header?.description}</p>
                        </div>
                    </div>
                </header>

                {/* Bento Grid Section */}
                <section className="bento-section">
                    <div className="container">
                        <div className="bento-grid">

                            {bentoCards.map((card) => {
                                if (card.type === 'mission') {
                                    return (
                                        <div className="bento-card bento-card--mission" key={card.type}>
                                            <span className="material-symbols-outlined" style={{ color: 'var(--secondary)', fontSize: '2.5rem', marginBottom: '1.5rem' }}>{card.icon}</span>
                                            <h2>{card.title}</h2>
                                            <p>{card.description}</p>
                                            <ul className="mission-list">
                                                {(card.bullets ?? []).map((bullet) => (
                                                    <li key={bullet}>
                                                        <span className="material-symbols-outlined" style={{ color: 'var(--secondary)' }}>check_circle</span>
                                                        {bullet}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )
                                }

                                if (card.type === 'image') {
                                    return (
                                        <div className="bento-card bento-card--image" key={card.type}>
                                            <img src={resolveAssetPath(card.src)} alt={card.alt} />
                                            <div className="bento-card--image-content">
                                                <h3>{card.title}</h3>
                                                <p>{card.description}</p>
                                            </div>
                                        </div>
                                    )
                                }

                                if (card.type === 'vision') {
                                    return (
                                        <div className="bento-card bento-card--vision" key={card.type}>
                                            <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '2rem', marginBottom: '1rem' }}>{card.icon}</span>
                                            <h2>{card.title}</h2>
                                            <p>{card.description}</p>
                                        </div>
                                    )
                                }

                                if (card.type === 'values') {
                                    return (
                                        <div className="bento-card bento-card--values" key={card.type}>
                                            <div>
                                                <h2>{card.title}</h2>
                                                <p>{card.description}</p>
                                            </div>
                                            <div className="core-values-grid">
                                                {(card.values ?? []).map((value) => (
                                                    <div className="core-value" key={value.label}>
                                                        <div className={`core-value__icon ${value.className}`}>
                                                            <span className="material-symbols-outlined">{value.icon}</span>
                                                        </div>
                                                        <span>{value.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                }

                                return null
                            })}

                        </div>
                    </div>
                </section>

                {/* Legacy Timeline Section */}
                <section className="legacy-section">
                    <div className="container">
                        <div className="section-header">
                            <h2>{aboutContent?.timelineSection?.title}</h2>
                            <div className="divider"></div>
                        </div>

                        <div className="timeline">

                            {timelineItems.map((item) => (
                                <div className={`timeline-item ${item.reverse ? 'timeline-item--reverse' : ''}`} key={item.title}>
                                    <div className="timeline-content">
                                        <span className="eyebrow">{item.eyebrow}</span>
                                        <h4>{item.title}</h4>
                                        <p>{item.description}</p>
                                    </div>
                                    <div className="timeline-node">
                                        <span className="material-symbols-outlined">{item.icon}</span>
                                    </div>
                                    <div className="timeline-image">
                                        <img src={resolveAssetPath(item.image)} alt={item.alt} />
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                </section>

            </main>

            {/* Footer */}

        </div>
    );
};

export default AboutPage;
