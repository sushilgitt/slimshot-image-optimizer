import { login } from "../../shopify.server";
import styles from "../_index/styles.module.css";

// App Store apps must never ask merchants to type their myshopify.com domain
// (requirement 2.3.1): install and shop identification come from OAuth and
// session tokens. So there is no shop-domain form here. A request that already
// carries ?shop= (e.g. from Shopify) is handed straight to OAuth; anything else
// is told to open SlimShot from the Shopify admin.
export const loader = async ({ request }) => {
  const url = new URL(request.url);
  if (url.searchParams.get("shop")) {
    // Throws a redirect into the OAuth flow for a valid shop.
    await login(request);
  }
  return null;
};

export default function Auth() {
  return (
    <main className={styles.index}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>SlimShot for Shopify</p>
        <h1 className={styles.heading}>Open SlimShot from your Shopify admin</h1>
        <p className={styles.text}>
          In your Shopify admin, go to <strong>Apps</strong> and choose <strong>SlimShot</strong>.
          If you haven&apos;t installed it yet, install it from the Shopify App Store first.
        </p>
      </div>
    </main>
  );
}
