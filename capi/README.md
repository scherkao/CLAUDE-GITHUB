# CAPI maison : Shopify -> Meta Conversions API (remplace Wetracked pour l'événement Purchase)

Chaque commande **payée** déclenche un webhook Shopify vers un Cloudflare Worker (gratuit, 100 000
requêtes/jour) qui envoie un `Purchase` à Meta côté serveur avec email, téléphone, nom, adresse,
IP, user agent, fbc/fbp (hashés SHA-256 quand Meta l'exige) et `event_id = id de commande`.

## Mise en place (15 min, une seule fois)

1. **Token Meta** : Events Manager > pixel MIRELYAE > Paramètres > Conversions API > « Générer un
   token d'accès ». Ne jamais le coller dans un chat, il va dans un secret Worker.
2. **Cloudflare** : compte gratuit, puis dans ce dossier :
   ```
   npm i -g wrangler
   wrangler login
   wrangler secret put META_PIXEL_ID          # 1595695962298420
   wrangler secret put META_ACCESS_TOKEN      # token de l'étape 1
   wrangler deploy                            # donne l'URL https://mirelyae-capi.<compte>.workers.dev
   ```
3. **Webhook Shopify** : Paramètres > Notifications > Webhooks > Créer un webhook :
   événement « Paiement de commande » (orders/paid), format JSON, URL du Worker, version API la plus
   récente. Copier la **clé de signature** affichée en bas de la page, puis :
   ```
   wrangler secret put SHOPIFY_WEBHOOK_SECRET
   ```
4. **Éviter le double comptage** : dans Shopify > Canaux de vente > Facebook & Instagram > Paramètres
   > Partage des données, passer de « Maximum » à « Amélioré » (navigateur seul). Le Worker devient
   l'unique émetteur serveur ; le pixel navigateur du canal continue et se déduplique grâce à l'event_id.
   Ne pas faire ça avant que le Worker soit déployé et testé.
5. **Test** : Events Manager > « Tester les événements », copier le code TEST dans `wrangler.toml`
   (`META_TEST_EVENT_CODE`), redéployer, passer une commande test à 0 €, vérifier l'événement
   Purchase « Serveur » avec ses clés de matching, puis retirer le code de test et redéployer.

## Vérification continue

La routine `routines/reconciliation-tracking-mirelyae.md` compare chaque matin les commandes
Shopify aux Purchase reçus (navigateur vs serveur) et aux achats attribués par campagne.

## Limites

- Couvre l'événement Purchase (le plus important pour l'optimisation). ViewContent, AddToCart et
  InitiateCheckout restent envoyés par le pixel navigateur du canal Shopify.
- fbc est reconstruit depuis le `fbclid` de la page d'arrivée quand le cookie n'est pas transmis.
