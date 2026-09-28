import { redirect, Form, useLoaderData } from "react-router";
import { login } from "../../shopify.server";
import styles from "./styles.module.css";

export const loader = async ({ request }) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return { showForm: Boolean(login) };
};

export default function App() {
  const { showForm } = useLoaderData();

  return (
    <main className={styles.index}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>SlimShot for Shopify</p>
        <h1 className={styles.heading}>Lighter images. Faster store.</h1>
        <p className={styles.text}>
          SlimShot compresses your product photos, writes the alt text you&apos;re missing,
          and keeps every new product lean automatically.
        </p>
        {showForm && (
          <Form className={styles.form} method="post" action="/auth/login">
            <label className={styles.label}>
              <span>Store domain</span>
              <input className={styles.input} type="text" name="shop" placeholder="your-store.myshopify.com" />
            </label>
            <button className={styles.button} type="submit">
              Open SlimShot
            </button>
          </Form>
        )}
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
