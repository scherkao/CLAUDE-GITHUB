# Guide simple : brancher le tracking serveur (sans terminal, 20 minutes)

Tu vas faire 4 choses : récupérer un token chez Meta, créer le Worker chez Cloudflare en collant
le code, créer le webhook chez Shopify, tester. Aucune ligne de commande.

## Étape 1 : le token Meta (2 min)

1. Va sur https://business.facebook.com/events_manager2 (compte ANAS DJOSS ECOM).
2. Clique sur le pixel **Pixel MIRELYAE - DJOSS**.
3. Onglet **Paramètres** (en haut).
4. Descends jusqu'à **API Conversions**, clique **Générer un token d'accès**.
5. Copie le token (longue chaîne de lettres). Garde-le dans tes notes, tu le colles à l'étape 2.
   Ne l'envoie jamais dans un chat.

## Étape 2 : le Worker Cloudflare (8 min)

1. Crée un compte gratuit sur https://dash.cloudflare.com/sign-up (email + mot de passe).
2. Dans le menu de gauche : **Workers & Pages**, puis bouton **Create** (ou Créer).
3. Choisis **Create Worker** (ou « Start with Hello World »).
4. Donne-lui le nom `mirelyae-capi`, clique **Deploy**.
5. Clique **Edit code** (Modifier le code). Un éditeur s'ouvre avec du code par défaut.
6. **Efface tout** le code affiché, puis colle le contenu complet du fichier `capi/worker.js`
   (ouvre-le dans l'app Claude, sélectionne tout, copie).
7. Clique **Deploy** en haut à droite.
8. Reviens sur la page du Worker, onglet **Settings**, section **Variables and Secrets**,
   bouton **Add** :
   - Type **Secret**, nom `META_PIXEL_ID`, valeur `1595695962298420`
   - Type **Secret**, nom `META_ACCESS_TOKEN`, valeur = le token de l'étape 1
   - (le 3e secret `SHOPIFY_WEBHOOK_SECRET` vient à l'étape 3)
   Clique **Deploy** / **Save** après chaque ajout.
9. Note l'URL du Worker, elle ressemble à `https://mirelyae-capi.<ton-compte>.workers.dev`.

## Étape 3 : le webhook Shopify (5 min)

1. Admin Shopify : https://admin.shopify.com/store/fw0is2-my/settings/notifications
2. Tout en bas : **Webhooks**, bouton **Créer un webhook**.
3. Événement : **Paiement de commande** (orders/paid). Format : **JSON**.
   URL : l'URL du Worker de l'étape 2. Version API : la plus récente proposée. **Enregistrer**.
4. Sur cette même page Webhooks, tout en bas, une phrase dit « Tous vos webhooks seront signés
   avec … » suivie d'une clé. Copie cette clé.
5. Retour sur Cloudflare, Worker `mirelyae-capi`, **Settings**, **Variables and Secrets**, **Add** :
   type **Secret**, nom `SHOPIFY_WEBHOOK_SECRET`, valeur = la clé copiée. **Deploy**.

## Étape 4 : le test (5 min)

1. Events Manager, pixel MIRELYAE, onglet **Tester les événements**. Un code du type `TEST12345`
   s'affiche.
2. Cloudflare, Worker, **Settings**, **Variables and Secrets**, **Add** : type **Text**, nom
   `META_TEST_EVENT_CODE`, valeur = ce code. **Deploy**.
3. Sur mirelyae.com, passe une commande test (crée un code promo à 100 % ou utilise le mode test
   de Shopify Payments) avec un vrai email.
4. Dans « Tester les événements », un **Purchase** avec la source **Serveur** doit apparaître en
   moins d'une minute, avec email, téléphone, nom, ville, code postal, IP, user agent.
5. Quand c'est bon : supprime la variable `META_TEST_EVENT_CODE` sur Cloudflare et **Deploy**.

## Étape 5 : éviter le double comptage (1 min, seulement après le test réussi)

Admin Shopify : **Canaux de vente**, **Facebook & Instagram**, **Paramètres**, **Partage des
données** : passe de **Maximum** à **Amélioré**. Le pixel navigateur continue, et ton Worker
devient le seul envoi serveur. Meta déduplique les deux grâce à l'id de commande.

## Si tu bloques

Envoie une capture d'écran de l'étape où tu es, je te dis quoi cliquer. Tu peux aussi installer
l'extension « Claude in Chrome » et lui demander de faire les clics des étapes 2, 3 et 5 pendant
que tu regardes.
