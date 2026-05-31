import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './Home.css'; // Assume stylesheet is saved here
import StatCounter from './StatCounter'
import { resolveAssetPath } from '../utils/assetResolver'

export default function HomePage() {
  const navigate = useNavigate()
  const [homeContent, setHomeContent] = useState(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    let mounted = true

    fetch('/home-page.json')
      .then((response) => response.json())
      .then((data) => {
        if (mounted) setHomeContent(data)
      })
      .catch(() => {
        if (mounted) setHomeContent({})
      })

    return () => {
      mounted = false
    }
  }, [])

  const heroImages = homeContent?.hero?.slides ?? []
  const heroIntervalMs = homeContent?.hero?.intervalMs ?? 5000

  useEffect(() => {
    if (heroImages.length <= 1) return undefined

    const t = setInterval(() => setActive((n) => (n + 1) % heroImages.length), heroIntervalMs)
    return () => clearInterval(t)
  }, [heroImages.length, heroIntervalMs])

  return (
    <>
      <section className="hero" id="home">
        <div className="hero__overlay" />
        <div className="hero__bg" aria-hidden="true">
          {heroImages.map((slide, i) => {
            const src = resolveAssetPath(slide.src);
            return (
              <img
                key={slide.src || i}
                className={`hero__image ${i === active ? 'active' : ''}`}
                src={src}
                alt={i === active ? slide.alt : ''}
              />
            )
          })}
        </div>

        <div className="container hero__content">
          <div className="hero__copy reveal">
            <p className="eyebrow">{homeContent?.hero?.eyebrow}</p>
            <h1>{homeContent?.hero?.title}</h1>
            <p className="hero__lede">{homeContent?.hero?.lede}</p>

            <div className="hero__actions">
              {homeContent?.hero?.actions?.map((action) => (
                <button
                  key={action.label}
                  className={action.className}
                  type="button"
                  onClick={() => navigate(action.to)}
                >
                  {action.label}
                  {action.icon ? (
                    <span className="material-symbols-outlined" aria-hidden="true">
                      {action.icon}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
        <section className="section section--stats" id="impact">
            <div className="container">
                <div className="stats-grid reveal">
                    {(homeContent?.impactStats ?? []).map((stat) => (
                        <article className="stat-card" key={stat.label}>
                <span className="material-symbols-outlined stat-card__icon" aria-hidden="true">
                  {stat.icon}
                </span>
                            <h3>
                                <StatCounter target={stat.value} />
                            </h3>
                            <p>{stat.label}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
      {/* Intro Section */}
      <section className="intro-section container">
        <div className="intro-grid">
          <div className="intro-content reveal">
            <span className="eyebrow">{homeContent?.intro?.eyebrow}</span>
            <h2>{homeContent?.intro?.title}</h2>
            <p>{homeContent?.intro?.description}</p>
            <div className="intro-location">
              <div className="intro-location__details">
                <span className="intro-location__title">{homeContent?.intro?.locationTitle}</span>
                <span className="intro-location__subtitle">{homeContent?.intro?.locationSubtitle}</span>
              </div>
            </div>
          </div>

            <div className="intro-image-wrapper reveal" style={{ transitionDelay: '200ms' }}>
            <img src={resolveAssetPath(homeContent?.intro?.image?.src)} alt={homeContent?.intro?.image?.alt} />
            <div className="intro-quote">
              <p>{homeContent?.intro?.quote}</p>
            </div>
          </div>
        </div>
      </section>



      <section className="section section--avenues" id="avenues">
        <div className="container">
          <div className="avenues-header reveal">
            <p className="avenues-header__eyebrow">{homeContent?.avenues?.eyebrow}</p>
            <h2>{homeContent?.avenues?.title}</h2>
            <p className="avenues-header__description">{homeContent?.avenues?.description}</p>
          </div>

          <div className="avenues-grid reveal">
            {(homeContent?.avenues?.items ?? []).map((avenue) => (
              <article
                className={`avenue-card ${avenue.featured ? 'avenue-card--featured' : ''}`}
                key={avenue.title}
              >
                <span className="avenue-card__icon" aria-hidden="true">{avenue.icon}</span>
                <h3>{avenue.title}</h3>
                <p>{avenue.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--cta">
        <div className="container">
          <div className="cta-panel reveal">
            <div className="cta-panel__glow" aria-hidden="true" />
            <h2>{homeContent?.cta?.title}</h2>
            <p>{homeContent?.cta?.description}</p>
            <div className="hero__actions hero__actions--center">
              {homeContent?.cta?.actions?.map((action) => (
                <button
                  key={action.label}
                  className={action.className}
                  type="button"
                  onClick={() => navigate(action.to)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

