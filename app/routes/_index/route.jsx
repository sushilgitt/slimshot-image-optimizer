import { redirect } from "react-router";
import styles from "./styles.module.css";

export const loader = async ({ request }) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return null;
};

export default function App() {
  return (
    <main className={styles.index}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>SlimShot for Shopify</p>
        <h1 className={styles.heading}>Lighter images. Faster store.</h1>
        <p className={styles.text}>
          SlimShot compresses your product photos, writes the alt text you&apos;re missing,
          and keeps every new product lean automatically.
        </p>
        <p className={styles.install}>
          Install SlimShot from the Shopify App Store, then open it from your Shopify admin.
        </p>
        <ul className={styles.list}>
          <li>
            <strong>Compress &amp; convert</strong>
            <span>Re-encode product photos as WebP and swap them in place, often more than half the size.</span>
          </li>
          <li>
            <strong>Smart alt text</strong>
            <span>AI describes each product photo so shoppers and search engines know what&apos;s in it.</span>
          </li>
          <li>
            <strong>Speed insights</strong>
            <span>Run live Lighthouse tests and see how much image weight you&apos;ve cut.</span>
          </li>
        </ul>
      </div>
    </main>
  );
}
