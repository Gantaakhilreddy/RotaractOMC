import { useEffect, useState } from 'react'
import './Contact.css'

const ContactPage = () => {
    const [contactContent, setContactContent] = useState(null)
    const [formState, setFormState] = useState('idle')

    useEffect(() => {
        let mounted = true

        fetch('/contact-page.json')
            .then((response) => response.json())
            .then((data) => {
                if (mounted) setContactContent(data)
            })
            .catch(() => {
                if (mounted) setContactContent({})
            })

        return () => {
            mounted = false
        }
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        setFormState('sending')

        // Simulate API call
        setTimeout(() => {
            setFormState('success')
            e.target.reset()

            setTimeout(() => {
                setFormState('idle')
            }, 3000)
        }, 1500)
    }

    const formButtonState = contactContent?.form?.buttonStates?.[formState]

    return (
        <div className="page-shell">
            <main className="container">
                <section className="contact-hero">
                    <h1>{contactContent?.hero?.title}</h1>
                    <p>{contactContent?.hero?.description}</p>
                </section>

                <div className="contact-layout">
                    <div className="contact-card">
                        <h2>
                            <span className="material-symbols-outlined">{contactContent?.form?.icon}</span>
                            {contactContent?.form?.title}
                        </h2>
                        <form onSubmit={handleSubmit} className="form-grid">
                            <div className="form-row-2">
                                {(contactContent?.form?.topRowFields ?? []).map((field) => (
                                    <div className="form-group" key={field.id}>
                                        <label htmlFor={field.id}>{field.label}</label>
                                        <input
                                            type={field.type}
                                            id={field.id}
                                            className="form-input"
                                            placeholder={field.placeholder}
                                            required={field.required}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="form-group">
                                <label htmlFor={contactContent?.form?.subjectField?.id}>{contactContent?.form?.subjectField?.label}</label>
                                <select
                                    id={contactContent?.form?.subjectField?.id}
                                    className="form-input"
                                    required={contactContent?.form?.subjectField?.required}
                                >
                                    <option value="">{contactContent?.form?.subjectField?.placeholder}</option>
                                    {(contactContent?.form?.subjectField?.options ?? []).map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor={contactContent?.form?.messageField?.id}>{contactContent?.form?.messageField?.label}</label>
                                <textarea
                                    id={contactContent?.form?.messageField?.id}
                                    className="form-input"
                                    placeholder={contactContent?.form?.messageField?.placeholder}
                                    rows={contactContent?.form?.messageField?.rows}
                                    required={contactContent?.form?.messageField?.required}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className={`button ${formState === 'success' ? 'button--success' : 'button--primary'}`}
                                disabled={formState !== 'idle'}
                                style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
                            >
                                <>
                                    <span
                                        className="material-symbols-outlined"
                                        style={formState === 'sending' ? { animation: 'spin 1s linear infinite' } : undefined}
                                    >
                                        {formButtonState?.icon}
                                    </span>
                                    {' '}
                                    {formButtonState?.label}
                                </>
                            </button>
                        </form>
                    </div>

                    <div className="sidebar-layout">
                        <div className="info-card">
                            <h3>{contactContent?.connectCard?.title}</h3>

                            {(contactContent?.connectCard?.methods ?? []).map((method) => (
                                <div className="contact-method" key={method.label}>
                                    <div className="contact-method__icon">
                                        <span className="material-symbols-outlined">{method.icon}</span>
                                    </div>
                                    <div>
                                        <div className="contact-method__label">{method.label}</div>
                                        <div className="contact-method__value">{method.value}</div>
                                    </div>
                                </div>
                            ))}

                            <div className="social-grid">
                                {(contactContent?.connectCard?.socialLinks ?? []).map((link) => (
                                    <a href={link.href} className="social-link" key={link.label}>
                                        <div className="social-link__icon"><span className="material-symbols-outlined">{link.icon}</span></div>
                                        <span className="social-link__label">{link.label}</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="location-card">
                            <div className="location-card__content">
                                <h3>
                                    <span className="material-symbols-outlined">{contactContent?.locationCard?.icon}</span>
                                    {contactContent?.locationCard?.title}
                                </h3>
                                <p>
                                    {(contactContent?.locationCard?.addressLines ?? []).map((line, index) => (
                                        <span key={`${line}-${index}`}>
                                            {line}
                                            <br />
                                        </span>
                                    ))}
                                </p>
                            </div>
                            <div className="map-container">
                                <div className="absolute inset-0 bg-primary/5 z-10 pointer-events-none"></div>
                                <img
                                    src={contactContent?.locationCard?.map?.src}
                                    alt={contactContent?.locationCard?.map?.alt}
                                />
                                <div className="map-pin-wrapper z-20">
                                    <div className="map-pin-pulse"></div>
                                    <div className="map-pin">
                                        <span className="material-symbols-outlined">{contactContent?.locationCard?.pinIcon}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="faq-section">
                    <h2 className="faq-header">{contactContent?.faq?.title}</h2>
                    <div className="faq-grid">
                        {(contactContent?.faq?.items ?? []).map((faqItem) => (
                            <div className="faq-item" key={faqItem.question}>
                                <h4>{faqItem.category}</h4>
                                <p className="question">{faqItem.question}</p>
                                <p className="answer">{faqItem.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      ` }} />
        </div>
    )
}

export default ContactPage
