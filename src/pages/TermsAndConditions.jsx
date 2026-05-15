import { useNavigate } from 'react-router-dom';

const sections = [
  {
    title: '1. Acceptance of Terms',
    body:
      'By accessing or using BookNest, you agree to follow these Terms and Conditions and all applicable laws. If you do not agree, please do not use the platform.',
  },
  {
    title: '2. Eligibility and Accounts',
    body:
      'You are responsible for providing accurate account information and for maintaining the confidentiality of your login credentials. You must be legally capable of entering into a binding agreement to use this service.',
  },
  {
    title: '3. Marketplace Listings',
    body:
      'Users may list books for sale, rent, or exchange. You must ensure that descriptions, prices, images, and condition details are accurate. Misleading or fraudulent listings may be removed without notice.',
  },
  {
    title: '4. User Conduct',
    body:
      'You agree not to misuse the platform, post unlawful content, harass other users, attempt unauthorized access, or interfere with the normal operation of BookNest.',
  },
  {
    title: '5. Orders, Rentals, and Exchanges',
    body:
      'Transactions made through BookNest are the responsibility of the participating users and any connected payment or delivery process. Users should communicate clearly regarding payment, timelines, book condition, and return expectations where applicable.',
  },
  {
    title: '6. Intellectual Property',
    body:
      'The BookNest name, branding, interface, and platform content are protected by applicable intellectual property rights. You may not copy, reproduce, or distribute platform materials without permission.',
  },
  {
    title: '7. Limitation of Liability',
    body:
      'BookNest is provided on an as-is basis. We do not guarantee uninterrupted service, error-free operation, or the behavior of third-party users. To the fullest extent permitted by law, BookNest is not liable for indirect or consequential losses.',
  },
  {
    title: '8. Termination',
    body:
      'We may suspend or terminate access to the platform if a user violates these terms, harms the community, or creates security or legal risk for the service.',
  },
  {
    title: '9. Changes to These Terms',
    body:
      'These Terms and Conditions may be updated from time to time. Continued use of BookNest after changes are published means you accept the revised terms.',
  },
  {
    title: '10. Contact',
    body:
      'For questions about these terms, you can reach out through the Contact page available on the BookNest website.',
  },
];

const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,600;1,400&display=swap');

        .terms-page {
          min-height: 100vh;
          padding: 96px 24px 86px;
          background:
            radial-gradient(ellipse at top, rgba(212, 175, 55, 0.1), transparent 46%),
            linear-gradient(180deg, #000000 0%, #070707 58%, #000000 100%);
          color: #ffffff;
          font-family: 'Inter', sans-serif;
        }

        .terms-shell {
          max-width: 1060px;
          margin: 0 auto;
        }

        .terms-hero {
          position: relative;
          overflow: hidden;
          padding: clamp(34px, 5vw, 58px);
          border-radius: 20px;
          border: 1px solid rgba(212, 175, 55, 0.16);
          background: #0a0a0a;
          box-shadow: 0 28px 80px rgba(0, 0, 0, 0.55);
        }

        .terms-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(212, 175, 55, 0.1), transparent 34%),
            radial-gradient(circle at 88% 18%, rgba(212, 175, 55, 0.12), transparent 28%);
          pointer-events: none;
        }

        .terms-hero-content {
          position: relative;
          max-width: 760px;
        }

        .terms-label {
          margin: 0 0 14px;
          font-size: 11px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: rgba(212, 175, 55, 0.82);
          font-weight: 700;
        }

        .terms-title {
          margin: 0;
          font-family: 'Fraunces', serif;
          font-size: clamp(36px, 6vw, 66px);
          font-style: italic;
          font-weight: 600;
          line-height: 1.02;
          letter-spacing: 0;
        }

        .terms-subtitle {
          margin: 18px 0 0;
          font-size: 15px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.54);
          font-weight: 300;
        }

        .terms-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 26px;
        }

        .terms-pill {
          padding: 9px 13px;
          border: 1px solid rgba(212, 175, 55, 0.13);
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.3);
          color: rgba(255, 255, 255, 0.7);
          font-size: 12px;
        }

        .terms-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
        }

        .terms-btn {
          border-radius: 10px;
          padding: 13px 22px;
          font-size: 12px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
        }

        .terms-btn:hover {
          transform: translateY(-2px);
        }

        .terms-btn-primary {
          border: none;
          color: #000000;
          background: #d4af37;
        }

        .terms-btn-secondary {
          border: 1px solid rgba(212, 175, 55, 0.22);
          color: rgba(255, 255, 255, 0.82);
          background: transparent;
        }

        .terms-btn-primary:hover {
          background: #f1c40f;
        }

        .terms-btn-secondary:hover {
          border-color: rgba(212, 175, 55, 0.48);
          color: #ffffff;
        }

        .terms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 14px;
          margin-top: 24px;
        }

        .terms-card {
          position: relative;
          padding: 24px;
          border-radius: 14px;
          border: 1px solid #1a1a1a;
          background: #0a0a0a;
          transition: border-color 0.2s ease, transform 0.2s ease, background 0.2s ease;
        }

        .terms-card:hover {
          transform: translateY(-3px);
          border-color: rgba(212, 175, 55, 0.28);
          background: #0d0d0d;
        }

        .terms-card::before {
          content: "";
          position: absolute;
          left: 24px;
          top: 0;
          width: 48px;
          height: 2px;
          background: #d4af37;
          opacity: 0.75;
        }

        .terms-card h2 {
          margin: 0 0 12px;
          font-family: 'Fraunces', serif;
          font-size: 21px;
          font-weight: 600;
          color: #ffffff;
          line-height: 1.25;
        }

        .terms-card p {
          margin: 0;
          font-size: 14px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.55);
          font-weight: 300;
        }

        @media (max-width: 640px) {
          .terms-page {
            padding: 82px 16px 56px;
          }

          .terms-hero {
            border-radius: 16px;
            padding: 30px 22px;
          }

          .terms-grid {
            grid-template-columns: 1fr;
          }

          .terms-btn {
            width: 100%;
          }
        }
      `}</style>

      <section className="terms-page">
        <div className="terms-shell">
          <div className="terms-hero">
            <div className="terms-hero-content">
              <p className="terms-label">BookNest Legal</p>
              <h1 className="terms-title">Terms & Conditions</h1>
              <p className="terms-subtitle">
                These terms outline the standards for accounts, listings, transactions,
                and community conduct across BookNest. Please read them carefully before
                buying, renting, exchanging, or listing books on the platform.
              </p>

              <div className="terms-meta">
                <span className="terms-pill">Marketplace rules</span>
                <span className="terms-pill">User responsibilities</span>
                <span className="terms-pill">Community safety</span>
              </div>

              <div className="terms-actions">
                <button
                  className="terms-btn terms-btn-primary"
                  onClick={() => navigate('/books')}
                >
                  Explore Books
                </button>
                <button
                  className="terms-btn terms-btn-secondary"
                  onClick={() => navigate('/contact')}
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>

          <div className="terms-grid">
            {sections.map((section) => (
              <article className="terms-card" key={section.title}>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default TermsAndConditions;
