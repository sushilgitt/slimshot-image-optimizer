import { useNavigate, useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { getBillingStateCached } from "../billing.server";
import { getUsage } from "../usage.server";
import { entitled } from "../plans.server";
import db from "../db.server";
import { Page, Layout, Button, Badge, Icon, Text, BlockStack, InlineStack } from "@shopify/polaris";
import { ImageMagicIcon, WandIcon, AutomationIcon, GaugeIcon } from "@shopify/polaris-icons";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);

  let plan = null;
  try {
    plan = (await getBillingStateCached(admin, session.shop)).plan;
  } catch (e) {
    if (e instanceof Response) throw e; // let re-auth propagate
  }

  let usage = { imagesUsed: 0 };
  let autoOptimize = false;
  try {
    usage = await getUsage(session.shop);
    const settings = await db.shopSettings.findUnique({ where: { shop: session.shop } });
    autoOptimize = settings?.autoOptimize ?? false;
  } catch { /* usage/settings tables not ready — defaults */ }

  return {
    plan: {
      name: plan?.name || "Free",
      tier: plan?.tier || "free",
      monthlyImages: plan?.monthlyImages ?? 100,
      altText: entitled(plan, "altText"),
      pageSpeed: entitled(plan, "pageSpeed"),
      autoOptimizeAllowed: entitled(plan, "autoOptimize"),
    },
    usage,
    autoOptimize,
  };
};

// Circular monthly-usage meter shown in the hero.
function UsageRing({ used, quota }) {
  const size = 156;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = quota > 0 ? Math.min(1, used / quota) : 0;
  const left = Math.max(0, quota - used);
  return (
    <div className="ss-ring">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={pct >= 1 ? "#FF6B6B" : "#B6F05C"}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
        />
      </svg>
      <div className="ss-ring-center">
        <span className="ss-ring-value">{Number(left).toLocaleString()}</span>
        <span className="ss-ring-label">{`images left of ${Number(quota).toLocaleString()}`}</span>
      </div>
    </div>
  );
}

export default function Index() {
  const navigate = useNavigate();
  const { plan, usage, autoOptimize } = useLoaderData();

  const quota = plan.monthlyImages || 0;
  const used = usage?.imagesUsed || 0;

  const autoLabel = !plan.autoOptimizeAllowed ? "Locked" : autoOptimize ? "On" : "Off";

  const tools = [
    {
      icon: ImageMagicIcon,
      title: "Compress & convert",
      desc: "Shrink product photos and serve them as lightweight WebP files, with no visible loss in quality.",
      cta: "Start compressing",
      to: "/app/productoptimization",
      unlocked: true,
    },
    {
      icon: WandIcon,
      title: "Smart alt text",
      desc: "AI looks at each product photo and writes descriptive, search-friendly alt text you can apply in bulk.",
      cta: plan.altText ? "Write alt text" : "Unlock on Starter",
      to: plan.altText ? "/app/alttextsuggestions" : "/app/billing",
      unlocked: plan.altText,
      lockedLabel: "Starter+",
    },
    {
      icon: AutomationIcon,
      title: "Autopilot for new products",
      desc: "Every product you add is compressed automatically in the background, with no clicks needed.",
      cta: plan.autoOptimizeAllowed ? "Configure autopilot" : "Unlock on Growth",
      to: plan.autoOptimizeAllowed ? "/app/productoptimization" : "/app/billing",
      unlocked: plan.autoOptimizeAllowed,
      lockedLabel: "Growth+",
      status: plan.autoOptimizeAllowed ? { label: autoLabel, tone: autoOptimize ? "success" : undefined } : null,
    },
    {
      icon: GaugeIcon,
      title: "Speed insights",
      desc: "Run live Lighthouse tests on product pages and see how much image weight you've cut.",
      cta: plan.pageSpeed ? "Open insights" : "Unlock on Growth",
      to: plan.pageSpeed ? "/app/pagespeedimpactreports" : "/app/billing",
      unlocked: plan.pageSpeed,
      lockedLabel: "Growth+",
    },
  ];

  return (
    <Page>
      <section className="ss-hero">
        <div>
          <p className="ss-eyebrow">SlimShot</p>
          <h1>Lighter images. Faster store.</h1>
          <p className="ss-hero-sub">
            Compress product photos, fill in missing alt text, and keep every new product lean automatically.
          </p>
          <div className="ss-hero-actions">
            <button type="button" className="ss-btn-lime" onClick={() => navigate("/app/productoptimization")}>
              Compress images
            </button>
            <button type="button" className="ss-btn-ghost" onClick={() => navigate("/app/billing")}>
              Plan &amp; usage
            </button>
          </div>
          <div className="ss-chips">
            <span className="ss-chip">Plan <strong>{plan.name}</strong></span>
            <span className="ss-chip">Used this month <strong>{used.toLocaleString()}</strong></span>
            <span className="ss-chip">Autopilot <strong>{autoLabel}</strong></span>
          </div>
        </div>
        <UsageRing used={used} quota={quota} />
      </section>

      <Layout>
        <Layout.Section>
          <BlockStack gap="300">
            <Text variant="headingMd" as="h2">Toolkit</Text>
            <div className="ss-tool-grid">
              {tools.map((t) => (
                <div key={t.title} className={`ss-tool${t.unlocked ? "" : " ss-tool--locked"}`}>
                  <div className="ss-tool-head">
                    <span className="ss-icon-tile" aria-hidden="true"><Icon source={t.icon} /></span>
                    {t.status && <Badge tone={t.status.tone}>{t.status.label}</Badge>}
                    {!t.unlocked && <Badge tone="info">{t.lockedLabel}</Badge>}
                  </div>
                  <p className="ss-tool-title">{t.title}</p>
                  <p className="ss-tool-desc">{t.desc}</p>
                  <InlineStack>
                    <Button variant={t.unlocked ? "primary" : "secondary"} onClick={() => navigate(t.to)}>
                      {t.cta}
                    </Button>
                  </InlineStack>
                </div>
              ))}
            </div>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
