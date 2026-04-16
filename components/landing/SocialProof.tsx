const stats = [
  { value: '12+', label: 'Gyms Onboarded' },
  { value: '3 Cities', label: 'Gurugram · Delhi · Noida' },
  { value: '1,400+', label: 'Members Tracked' },
  { value: '₹18L+', label: 'Revenue Managed' },
]

export default function SocialProof() {
  return (
    <section
      style={{
        borderTop: '1px solid rgba(255,255,255,0.07)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '28px 0',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
        }}
        className="social-proof-grid"
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{ textAlign: 'center' }}
          >
            <p
              style={{
                margin: 0,
                fontSize: '1.35rem',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
              }}
            >
              {stat.value}
            </p>
            <p
              style={{
                margin: '4px 0 0',
                fontSize: '0.78rem',
                color: 'rgba(255,255,255,0.4)',
                fontWeight: 400,
                letterSpacing: '0.01em',
              }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .social-proof-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 24px 16px !important;
          }
        }
      `}</style>
    </section>
  )
}
