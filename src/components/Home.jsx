
import { resolveAssetPath } from '../utils/assetResolver'

export default function Home({ heroImage, jumpTo }) {
  const resolvedHero = resolveAssetPath(heroImage)
  return (
    <section className="hero" id="home">
      <div className="hero__overlay" />
      <img className="hero__image" src={resolvedHero} alt="Medical students collaborating in a bright clinical setting" />

      <div className="container hero__content">
        <div className="hero__copy reveal">
          <p className="eyebrow">Clinical excellence · Community pulse</p>
          <h1>Rotaract OMC</h1>
          <p className="hero__lede">Where Service Meets Medicine.</p>

          <div className="hero__actions">
            <button className="button button--primary button--icon" type="button" onClick={() => jumpTo('impact')}>
              Discover Our Impact
              <span className="material-symbols-outlined" aria-hidden="true">
                arrow_forward
              </span>
            </button>
            <button className="button button--secondary" type="button" onClick={() => jumpTo('contact')}>
              Join the Movement
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

