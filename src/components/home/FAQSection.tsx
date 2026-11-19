import { useState } from 'react'

const faqs = [
  { q: 'What is an insurance broker?', a: 'An insurance broker acts as an intermediary between you and insurance companies, helping you find the best coverage at the right price. Unlike agents who work for one insurer, brokers work for you.' },
  { q: 'How can I get an insurance quote?', a: 'You can get a free quote by clicking "Get A Quote" on our website, calling us directly, or visiting our office. Our experts will guide you through the best options.' },
  { q: 'What types of insurance do you offer?', a: 'We offer Motor, Health, Life, Home, Travel, and Commercial insurance. We also specialise in Surety Bonds and POSP advisory services.' },
  { q: 'How does the claims process work?', a: 'Simply report your claim to us, submit the required documents, and our team handles the rest — including follow-up with the insurer until settlement.' },
  { q: 'How can I contact SSS?', a: 'You can reach us at +91 97250 43210, email us at info@sssriskmanagement.in, or use the contact form on our website. We\'re available Monday–Saturday, 10 AM–6 PM.' },
]

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <>
      <style>{`
        .faq { padding: 72px 0; background: #fff; }
        .faq-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 64px;
          align-items: start;
        }
        .faq-tag {
          display: inline-block;
          background: #fff0e6;
          color: #FF6B00;
          font-family: 'Inter', sans-serif;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 50px;
          margin-bottom: 12px;
          border: 1px solid #ffd0a8;
        }
        .faq-title {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(22px, 3vw, 30px);
          font-weight: 700;
          color: #111827;
          margin-bottom: 14px;
        }
        .faq-title span { color: #FF6B00; }
        .faq-desc {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: #6b7280;
          line-height: 1.7;
        }
        .faq-list { display: flex; flex-direction: column; gap: 10px; }
        .faq-item {
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .faq-item.faq-open { border-color: #FF6B00; }
        .faq-question {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 18px;
          cursor: pointer;
          background: #fff;
          user-select: none;
          gap: 12px;
        }
        .faq-question:hover { background: #fffaf7; }
        .faq-question-text {
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 13.5px;
          color: #111827;
        }
        .faq-toggle {
          width: 26px; height: 26px;
          background: #f3f4f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: #6b7280;
          flex-shrink: 0;
          transition: all 0.2s;
          font-weight: 700;
        }
        .faq-open .faq-toggle { background: #FF6B00; color: #fff; }
        .faq-answer {
          padding: 0 18px 16px;
          font-family: 'Inter', sans-serif;
          font-size: 13.5px;
          color: #4b5563;
          line-height: 1.7;
          border-top: 1px solid #f3f4f6;
          padding-top: 12px;
        }
        @media (max-width: 900px) { .faq-inner { grid-template-columns: 1fr; gap: 32px; } }
      `}</style>

      <section className="faq">
        <div className="faq-inner">
          <div>
            <div className="faq-tag">FAQ</div>
            <h2 className="faq-title">Frequently Asked <span>Questions</span></h2>
            <p className="faq-desc">Got questions about insurance? We've got answers. If you can't find what you're looking for, contact us directly.</p>
          </div>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <div key={i} className={`faq-item${open === i ? ' faq-open' : ''}`}>
                <div className="faq-question" onClick={() => setOpen(open === i ? null : i)}>
                  <span className="faq-question-text">{f.q}</span>
                  <span className="faq-toggle">{open === i ? '−' : '+'}</span>
                </div>
                {open === i && <div className="faq-answer">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
