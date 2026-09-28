import { Icon } from "@shopify/polaris";

// Header shown at the top of every SlimShot feature page: a dark icon tile,
// an eyebrow label, the page title and a one-line description.
export default function PageIntro({ icon, eyebrow, title, subtitle }) {
  return (
    <div className="ss-intro">
      <span className="ss-icon-tile" aria-hidden="true">
        <Icon source={icon} />
      </span>
      <div>
        {eyebrow && <p className="ss-intro-eyebrow">{eyebrow}</p>}
        <h1 className="ss-intro-title">{title}</h1>
        {subtitle && <p className="ss-intro-sub">{subtitle}</p>}
      </div>
    </div>
  );
}
