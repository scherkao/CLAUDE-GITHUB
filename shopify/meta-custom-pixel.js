// Meta Pixel — Shopify "Custom pixel" (Paramètres > Événements clients > Ajouter un pixel personnalisé)
// Remplacer PIXEL_ID par l'ID du dataset Meta (Events Manager, ou ads_get_datasets via le MCP Meta).
// Ce code tourne dans le sandbox Shopify : il utilise analytics.subscribe, pas le DOM du thème.
// Limite : événements navigateur uniquement. Pour la Conversions API (serveur), utiliser l'app
// "Facebook & Instagram" de Shopify ou un connecteur CAPI (Stape, etc.), avec le même eventID.

!function (f, b, e, v, n, t, s) {
  if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
  if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
  t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
}(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

const PIXEL_ID = 'PIXEL_ID';
fbq('init', PIXEL_ID);

const money = (m) => ({ value: Number(m?.amount || 0), currency: m?.currencyCode || 'EUR' });
const ids = (lines) => (lines || []).map((l) => (l.variant || l.merchandise)?.product?.id).filter(Boolean);

analytics.subscribe('page_viewed', () => fbq('track', 'PageView'));

analytics.subscribe('product_viewed', (e) => {
  const v = e.data.productVariant;
  fbq('track', 'ViewContent', { content_type: 'product', content_ids: [v.product.id], content_name: v.product.title, ...money(v.price) });
});

analytics.subscribe('product_added_to_cart', (e) => {
  const l = e.data.cartLine;
  fbq('track', 'AddToCart', { content_type: 'product', content_ids: [l.merchandise.product.id], content_name: l.merchandise.product.title, ...money(l.cost.totalAmount) });
});

analytics.subscribe('checkout_started', (e) => {
  const c = e.data.checkout;
  fbq('track', 'InitiateCheckout', { content_type: 'product', content_ids: ids(c.lineItems), num_items: c.lineItems.length, ...money(c.totalPrice) });
});

analytics.subscribe('payment_info_submitted', (e) => {
  const c = e.data.checkout;
  fbq('track', 'AddPaymentInfo', { content_type: 'product', content_ids: ids(c.lineItems), ...money(c.totalPrice) });
});

analytics.subscribe('checkout_completed', (e) => {
  const c = e.data.checkout;
  // eventID = id de commande : permet la déduplication avec un éventuel événement serveur (CAPI).
  fbq('track', 'Purchase', { content_type: 'product', content_ids: ids(c.lineItems), num_items: c.lineItems.length, ...money(c.totalPrice) }, { eventID: String(c.order?.id || c.token) });
});
