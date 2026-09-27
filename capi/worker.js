// Shopify "orders/paid" webhook -> Meta Conversions API (Purchase), déployé sur Cloudflare Workers.
// Rôle : envoyer 100 % des commandes payées à Meta côté serveur, avec un maximum de clés de matching,
// et un event_id = id de commande pour la déduplication avec le pixel navigateur.
//
// Secrets (wrangler secret put ...) :
//   META_PIXEL_ID        id du dataset/pixel Meta (ex. 1595695962298420)
//   META_ACCESS_TOKEN    token Conversions API (Events Manager > Paramètres > Conversions API > Générer)
//   SHOPIFY_WEBHOOK_SECRET  clé de signature affichée dans Shopify > Paramètres > Notifications > Webhooks
// Variables optionnelles (wrangler.toml [vars]) :
//   META_TEST_EVENT_CODE  code "Tester les événements" pendant la mise en place, à retirer ensuite

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') return new Response('ok', { status: 200 });

    const raw = await request.text();
    const hmac = request.headers.get('X-Shopify-Hmac-Sha256') || '';
    if (!(await verifyShopifyHmac(raw, hmac, env.SHOPIFY_WEBHOOK_SECRET))) {
      return new Response('invalid hmac', { status: 401 });
    }

    const topic = request.headers.get('X-Shopify-Topic') || '';
    if (topic !== 'orders/paid') return new Response('ignored', { status: 200 });

    const order = JSON.parse(raw);
    const event = await buildPurchaseEvent(order, request);

    const body = { data: [event] };
    if (env.META_TEST_EVENT_CODE) body.test_event_code = env.META_TEST_EVENT_CODE;

    const res = await fetch(`https://graph.facebook.com/v21.0/${env.META_PIXEL_ID}/events?access_token=${env.META_ACCESS_TOKEN}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    console.log('meta capi', res.status, text);
    // Toujours 200 vers Shopify pour éviter les re-livraisons en boucle ; l'erreur est dans les logs.
    return new Response(text, { status: 200 });
  },
};

async function buildPurchaseEvent(order, request) {
  const addr = order.billing_address || order.shipping_address || {};
  const cust = order.customer || {};
  const email = order.email || order.contact_email || cust.email || '';
  const phone = order.phone || addr.phone || cust.phone || '';
  const client = order.client_details || {};
  const ip = client.browser_ip || request.headers.get('CF-Connecting-IP') || '';
  const ua = client.user_agent || '';
  const attrs = Object.fromEntries((order.note_attributes || []).map((a) => [a.name, a.value]));

  // fbc : depuis un attribut _fbc si le thème/pixel l'a stocké, sinon reconstruit depuis fbclid de la landing page.
  let fbc = attrs._fbc || attrs.fbc || '';
  if (!fbc && order.landing_site) {
    const m = order.landing_site.match(/[?&]fbclid=([^&]+)/);
    if (m) fbc = `fb.1.${Date.parse(order.created_at) || Date.now()}.${decodeURIComponent(m[1])}`;
  }
  const fbp = attrs._fbp || attrs.fbp || '';

  const user_data = {
    em: [await sha256(norm(email))],
    ph: [await sha256(normPhone(phone))],
    fn: [await sha256(norm(addr.first_name || cust.first_name))],
    ln: [await sha256(norm(addr.last_name || cust.last_name))],
    ct: [await sha256(norm(addr.city))],
    st: [await sha256(norm(addr.province_code || addr.province))],
    zp: [await sha256(norm(addr.zip))],
    country: [await sha256(norm(addr.country_code))],
    external_id: [await sha256(String(cust.id || order.id))],
    client_ip_address: ip || undefined,
    client_user_agent: ua || undefined,
    fbc: fbc || undefined,
    fbp: fbp || undefined,
  };
  for (const k of Object.keys(user_data)) {
    const v = user_data[k];
    if (v === undefined || (Array.isArray(v) && !v[0])) delete user_data[k];
  }

  const items = order.line_items || [];
  return {
    event_name: 'Purchase',
    event_time: Math.floor(Date.parse(order.processed_at || order.created_at) / 1000),
    event_id: String(order.id), // même id que le pixel navigateur => déduplication
    action_source: 'website',
    event_source_url: order.order_status_url || order.landing_site || undefined,
    user_data,
    custom_data: {
      currency: order.currency,
      value: Number(order.total_price),
      order_id: String(order.id),
      content_type: 'product',
      content_ids: items.map((i) => String(i.product_id)),
      contents: items.map((i) => ({ id: String(i.product_id), quantity: i.quantity, item_price: Number(i.price) })),
      num_items: items.reduce((n, i) => n + i.quantity, 0),
    },
  };
}

function norm(s) { return (s || '').toString().trim().toLowerCase(); }
function normPhone(s) { return (s || '').toString().replace(/\D/g, ''); }

async function sha256(s) {
  if (!s) return '';
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function verifyShopifyHmac(raw, header, secret) {
  if (!secret || !header) return false;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(raw));
  const expected = btoa(String.fromCharCode(...new Uint8Array(sig)));
  if (expected.length !== header.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ header.charCodeAt(i);
  return diff === 0;
}
