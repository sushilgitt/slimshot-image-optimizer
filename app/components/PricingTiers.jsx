import { PLAN_TIERS } from "../planCatalog";

// Plan comparison used by both the standalone pricing page and the in-app
// pricing wall. Presentational only: every plan CTA is a real top-frame link
// (`target="_top"`) to Shopify's hosted managed-pricing page, where the actual
// price/cycle live and are picked. A direct anchor is used (rather than a form
// POST + reauthorize-header redirect) because a user click is a reliable
// user-activation that can navigate the top frame out of the embedded iframe —
// the POST-based redirect intermittently failed during initial setup and looped
// the merchant back to the app index.
//
// NOTE: we intentionally do NOT show prices here. Prices are owned by the
// Partner Dashboard plans and can be changed there without a code deploy;
// rendering them in-app would risk showing a stale amount. The merchant sees the
// real price on Shopify's pricing page after clicking through.
export default function PricingTiers({ pricingUrl }) {
  return (
    <div style={s.page}>
      <div style={s.band}>
        <p style={s.eyebrow}>SlimShot plans</p>
        <h1 style={s.heading}>Pick how many images you want to slim down each month</h1>
        <p style={s.subheading}>
          Every plan compresses and converts to WebP. Higher plans add AI alt text, autopilot for new
          products, and speed insights.
        </p>
      </div>

      <div style={s.grid}>
        {PLAN_TIERS.map((tier) => {
          const featured = Boolean(tier.popular);
          return (
            <div key={tier.name} style={featured ? s.cardFeatured : s.card}>
              <div style={s.cardTop}>
                <p style={featured ? s.tierNameOnDark : s.tierName}>{tier.name}</p>
                {featured && <span style={s.flag}>Recommended</span>}
              </div>
              <p style={featured ? s.taglineOnDark : s.tagline}>{tier.tagline}</p>

              <p style={featured ? s.quotaOnDark : s.quota}>
                {tier.images}
                <span style={featured ? s.quotaUnitOnDark : s.quotaUnit}> images / mo</span>
              </p>

              <ul style={s.featureList}>
                {tier.features.map((f, i) => (
                  <li key={i} style={featured ? s.featureOnDark : s.feature}>
                    <span style={featured ? s.dotOnDark : s.dot} aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>

              <a href={pricingUrl} target="_top" style={featured ? s.ctaFeatured : s.cta}>
                {tier.price === 0 ? "Start free" : `Get ${tier.name}`}
              </a>
            </div>
          );
        })}
      </div>

      <p style={s.disclaimer}>Billed securely by Shopify. Change or cancel your plan any time.</p>
    </div>
  );
}

const INK = "#0B1B2B";
const TEAL = "#0F9B8E";
const LIME = "#B6F05C";
const MUTED = "#5B6B78";
const LINE = "#DCE9E7";
const FONT = "\"Plus Jakarta Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif";

const ctaBase = {
  display: "block",
  textAlign: "center",
  textDecoration: "none",
  boxSizing: "border-box",
  cursor: "pointer",
  marginTop: "auto",
  padding: "11px 14px",
  borderRadius: 999,
  fontSize: 14,
  fontWeight: 700,
};

const cardBase = {
  display: "flex",
  flexDirection: "column",
  borderRadius: 16,
  padding: "24px 22px",
  boxSizing: "border-box",
  minHeight: 380,
};

const s = {
  page: {
    minHeight: "100vh",
    background: "#F4F8F8",
    fontFamily: FONT,
    paddingBottom: 48,
  },
  band: {
    background: `radial-gradient(circle at 85% 0%, rgba(34,184,207,0.3) 0, transparent 45%), linear-gradient(160deg, ${INK} 0%, #12283D 100%)`,
    color: "#FFFFFF",
    padding: "48px 24px 110px",
    textAlign: "center",
  },
  eyebrow: {
    fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase",
    color: LIME, margin: "0 0 14px 0",
  },
  heading: {
    fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.2,
    margin: "0 auto 12px", maxWidth: 640,
  },
  subheading: {
    fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.72)", margin: "0 auto", maxWidth: 560,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    maxWidth: 1080,
    margin: "-72px auto 0",
    padding: "0 24px",
    alignItems: "stretch",
  },
  card: {
    ...cardBase,
    background: "#FFFFFF",
    border: `1px solid ${LINE}`,
    boxShadow: "0 10px 30px rgba(11,27,43,0.06)",
  },
  cardFeatured: {
    ...cardBase,
    background: INK,
    border: `1px solid ${INK}`,
    boxShadow: "0 18px 44px rgba(11,27,43,0.28)",
  },
  cardTop: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
  tierName: { fontSize: 17, fontWeight: 800, color: INK, margin: 0 },
  tierNameOnDark: { fontSize: 17, fontWeight: 800, color: "#FFFFFF", margin: 0 },
  flag: {
    fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase",
    color: INK, background: LIME, padding: "4px 8px", borderRadius: 6,
  },
  tagline: { fontSize: 12, color: MUTED, margin: "4px 0 18px 0" },
  taglineOnDark: { fontSize: 12, color: "rgba(255,255,255,0.6)", margin: "4px 0 18px 0" },
  quota: { fontSize: 30, fontWeight: 800, color: INK, letterSpacing: "-0.02em", margin: "0 0 18px 0" },
  quotaOnDark: { fontSize: 30, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em", margin: "0 0 18px 0" },
  quotaUnit: { fontSize: 13, fontWeight: 500, color: MUTED, letterSpacing: 0 },
  quotaUnitOnDark: { fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.6)", letterSpacing: 0 },
  featureList: { listStyle: "none", padding: 0, margin: "0 0 22px 0", display: "flex", flexDirection: "column", gap: 9 },
  feature: { display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#23323F" },
  featureOnDark: { display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "rgba(255,255,255,0.88)" },
  dot: { width: 7, height: 7, borderRadius: 2, background: TEAL, flexShrink: 0 },
  dotOnDark: { width: 7, height: 7, borderRadius: 2, background: LIME, flexShrink: 0 },
  cta: { ...ctaBase, background: "#FFFFFF", color: TEAL, border: `1.5px solid ${TEAL}` },
  ctaFeatured: { ...ctaBase, background: LIME, color: INK, border: `1.5px solid ${LIME}` },
  disclaimer: { textAlign: "center", fontSize: 12, color: MUTED, marginTop: 28 },
};
