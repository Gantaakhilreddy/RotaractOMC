import { useEffect, useState } from 'react'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import R3150Logo from '../assets/R3150.jpeg'
import RotaryLogo from '../assets/Rotary.jpeg'
import RomcLogo from '../assets/ROMC.png'

const navLinks = [
  { label: 'Home', target: '/' },
  { label: 'About', target: '/about' },
  { label: 'Events', target: '/events' },
  { label: 'Team', target: '/team' },
  { label: 'Gallery', target: '/gallery' },
  { label: 'Contact', target: '/contact' },
]

const footerColumns = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Home', target: '/' },
      { label: 'About', target: '/about' },
      { label: 'Events', target: '/events' },
      { label: 'Team', target: '/team' },
      { label: 'Gallery', target: '/gallery' },
      { label: 'Contact', target: '/contact' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'Instagram', target: 'https://www.instagram.com/rotaract_omc', external: true },
      { label: 'LinkedIn', target: 'https://www.linkedin.com/company/rotaract-club-of-omc/', external: true },
    ],
  },
]

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = window.location.pathname
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  const handleNavClick = (target) => {
    navigate(target)
    setIsMenuOpen(false)
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="container topbar__inner">
          <button className="brand brand-button brand-button--logos" type="button" onClick={() => navigate('/')} aria-label="Go to home page">
            <span className="brand-button__logo">
              <img src={RomcLogo} alt="Rotaract OMC logo" />
            </span>
            <span className="brand-button__logo">
              <img src={R3150Logo} alt="Rotary International District 3150" />
            </span>
            <span className="brand-button__logo">
              <img src={RotaryLogo} alt="Rotary logo" />
            </span>
          </button>

          <nav className="nav" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <button
                key={link.label}
                className={
                  currentPath === link.target
                    ? 'nav__link nav__link--active nav__link--button'
                    : 'nav__link nav__link--button'
                }
                type="button"
                onClick={() => navigate(link.target)}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <button
            className="button button--primary"
            type="button"
            onClick={() => navigate('/contact')}
          >
            Join Us
          </button>

          <button 
            className={`hamburger-menu ${isMenuOpen ? 'hamburger-menu--open' : ''}`}
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            <span className="hamburger-menu__line"></span>
            <span className="hamburger-menu__line"></span>
            <span className="hamburger-menu__line"></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="mobile-menu" aria-label="Mobile navigation">
            <div className="mobile-menu__content">
              <div className="mobile-menu__logos">
                <span className="mobile-menu__logo">
                  <img src={RomcLogo} alt="Rotaract OMC logo" />
                </span>
                <span className="mobile-menu__logo">
                  <img src={R3150Logo} alt="Rotary International District 3150" />
                </span>
                <span className="mobile-menu__logo">
                  <img src={RotaryLogo} alt="Rotary logo" />
                </span>
              </div>

              <ul className="mobile-menu__links">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <button
                      className={`mobile-menu__link ${
                        currentPath === link.target ? 'mobile-menu__link--active' : ''
                      }`}
                      type="button"
                      onClick={() => handleNavClick(link.target)}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>

              <button
                className="button button--primary mobile-menu__cta"
                type="button"
                onClick={() => handleNavClick('/contact')}
              >
                Join Us
              </button>
            </div>
          </nav>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer" id="contact">
        <div className="container footer__grid">
          <div className="footer__brand-block">
            <button
              className="brand brand-button brand--footer"
              type="button"
              onClick={() => navigate('/')}
            >
              Rotaract OMC
            </button>
            <p>
              Rotaract Club of Osmania Medical College. Empowering the next generation of healthcare leaders.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title} className="footer__column">
              <h3>{column.title}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a className="footer__link-button" href={link.target} target="_blank" rel="noreferrer">
                        {link.label}
                      </a>
                    ) : (
                      <button
                        className="footer__link-button"
                        type="button"
                        onClick={() => navigate(link.target)}
                      >
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="footer__column">
            <h3>Contact Info</h3>
            <address>
              <span>Osmania Medical College, Koti, Hyderabad, 500095</span>
              <a href="mailto:info@rotaractomc.org">info@rotaractomc.org</a>
            </address>
          </div>
        </div>

        <div className="container footer__fineprint">
          <p>© 2026 Rotaract Club of Osmania Medical College. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

