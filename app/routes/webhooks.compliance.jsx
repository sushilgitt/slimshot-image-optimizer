// Mandatory GDPR compliance webhooks: customers/data_request, customers/redact
// and shop/redact all arrive here.
//
// authenticate.webhook verifies the HMAC and throws a 401 on a bad signature,
// which is what Shopify's review checks for.
//
// This app stores no customer data — only per-shop sessions, the monthly usage
// counter and shop settings (optimization results live in product metafields on
// the shop itself). So the two customer topics just acknowledge, and shop/redact
// (sent 48h after uninstall) erases everything we hold for the shop.
//
// These must NOT share the app/uninstalled handler: that deletes the shop's
// sessions, so a routine customer data request would log the merchant out.
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { shop, topic } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);

  // Normalize "SHOP_REDACT" / "shop/redact" to one form.
  switch (String(topic).toLowerCase().replace("/", "_")) {
    case "customers_data_request":
    case "customers_redact":
      // No customer data stored — nothing to report or erase.
      break;

    case "shop_redact":
      await db.$transaction([
        db.session.deleteMany({ where: { shop } }),
        db.usageCounter.deleteMany({ where: { shop } }),
        db.shopSettings.deleteMany({ where: { shop } }),
      ]);
      break;

    default:
      console.warn(`Unhandled compliance topic ${topic} for ${shop}`);
  }

  return new Response();
};
