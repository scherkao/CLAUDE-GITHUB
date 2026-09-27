---
name: winner-product-research
description: Recherche de produits gagnants (dropshipping / e-commerce) avec Trendtrack + Meta Ads Library. Utiliser quand l'utilisateur demande une "recherche prod", des "winners", des produits à lancer, ou un scan de shops Shopify récents avec des ads qui scalent. Deux passes par défaut - toutes niches, puis niche femme.
---

# Winner Product Research (méthode "Jiola")

Tu es un expert en recherche produit e-commerce. Objectif : sortir une liste courte de
produits **déjà en train de scaler** chez des shops **récents et petits**, avec une fiche
par produit. Tu ne devines pas : chaque ligne du rapport est sourcée (outil + date).

## 1. Critères par défaut (tous modifiables par l'utilisateur)

| Critère | Valeur par défaut | Où le vérifier |
|---|---|---|
| Âge du shop | créé il y a **≤ 40 jours** | Trendtrack `search_shops.creation_date_from` / `search_ads.shop_created_after` |
| Plateforme | **Shopify** | `search_ads.technologies=["shopify"]` |
| Abonnés page | **≤ 30 000** Instagram **et** ≤ 30 000 Facebook | `search_ads.max_instagram_followers` / `max_facebook_likes` |
| Ads actives | **≥ 5** sur la page | `search_ads.min_active_ads` / `search_shops.min_active_ads` |
| Catalogue | **< 40 produits** | `search_ads.max_products` / `search_shops.max_products_count` |
| Niche exclue | **alimentaire** (food, boissons, compléments) | exclure `category_ids` Food & Drink (id 528 et enfants), filtrer à la main les compléments |
| **Critère primordial** | la page a **≥ 3 ads** avec **reach ≥ 500 000** OU **spend ≥ 60 €/jour**, sur les 40 derniers jours | Trendtrack (reach) + Ads Library "Reveal all spend" (spend, voir §4) |

Passe 1 = toutes niches (hors alimentaire). Passe 2 = niche **femme** : cosmétique, soin
visage/cheveux/ongles, bijoux (bague, bracelet, collier), lingerie, accessoires, maternité,
et plus largement tout produit dont la cible principale est une femme.

## 2. Pipeline nominal (Trendtrack avec crédits)

1. `check_credits` : si `remaining` < ~50, passer au pipeline de secours (§5) et le dire.
2. `lookup_filter_ids type=categories` pour résoudre les ids de niche (femme : Beauty &
   Fitness 239, Face & Body Care 248, Skin & Nail Care 254, Hair Care 268, Make-Up 251,
   Fashion & Style 257 ; jewelry n'existe pas comme facette, utiliser des mots-clés).
3. `search_ads` avec les filtres du tableau, `sort_by=reach`, `reach_period=total`,
   `min_reach=500000`, `max_ads_per_brand=3`, `status=active`, `shop_created_after=<J-40>`.
   Pour la passe femme : ajouter `category_ids` beauté OU `keywords` (bague, bracelet,
   collier, sérum, cheveux, maquillage, cils, ongles, lingerie, sac) avec `keyword_mode=any`.
   Paginer (limit 20) jusqu'à épuisement ou ~10 pages.
4. Regrouper par page Facebook. Garder les pages qui ont **≥ 3 ads** ≥ 500k reach dans les
   résultats. Pour les pages avec 1 ou 2 ads ≥ 500k, passer à l'étape spend (§4) : le
   critère est "reach OU spend", et le spend Trendtrack est souvent en retard.
5. `search_shops match_mode=exact query=<domaine>` pour confirmer date de création,
   nombre de produits, plateforme, abonnés.
6. Écarter : alimentaire / compléments, apps (mini-séries, jeux), services locaux,
   grandes marques établies, pages avec > 30k abonnés, catalogues ≥ 40 produits.

## 3. Fiche produit (une par winner, format obligatoire)

```
### <Nom du produit> — <Page Facebook> (<domaine>)
- Niche : femme | générale — sous-niche : …
- Shop : Shopify, créé le <date> (<n> jours), <n> produits, IG <n> / FB <n> abonnés
- Ads actives : <n> (source, date)
- Top 3 ads (40 derniers jours) :
  | # | Reach total | Spend / jour | Jours actifs | Lien Ads Library |
  |---|---|---|---|---|
- Critère primordial : ✔ / ✘ (3 ads ≥ 500k reach OU ≥ 60 €/j)
- Verdict : WINNER à lancer / à surveiller / non
- Angle créa dominant : <hook>, <format>, <offre (1+1, -40 %, etc.)>
```

Le rapport final va dans `research/<YYYY-MM-DD>-<slug>.md` avec deux sections
(toutes niches, femme) et une section "à valider" pour ce qui n'a pas pu être vérifié.

## 4. Vérifier le spend réel dans la Meta Ads Library (extension Trendtrack)

Les stats de spend Trendtrack API sont en retard. Procédure manuelle ou navigateur :

1. Ouvrir `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&view_all_page_id=<page_id>`.
2. Avec l'extension Chrome Trendtrack installée, cliquer le bouton vert **« Reveal all spend »**.
3. Trier **« Sort by daily spend »**.
4. Lire les **3 premières ads** : reach total + daily spend. La page passe si les 3 sont
   ≥ 500k reach OU ≥ 60 €/jour, et que ces ads ont tourné dans les 40 derniers jours.
5. Reporter reach, spend/jour, jours actifs et le lien `?id=<ad_id>` dans la fiche.

Sans extension : le reach EU par ad est visible dans « Transparence UE » de chaque ad ;
estimer spend/jour ≈ reach × CPM / 1000 / jours actifs (CPM FR par défaut 8 €, à indiquer
comme estimation).

## 5. Pipeline de secours (0 crédit Trendtrack, ou réseau bloqué)

Outils gratuits qui restent disponibles : Trendtrack `lookup` (active ads, reach 30j,
domaine, page id) et `lookup_filter_ids` ; Meta `ads_library_search` (pages, ids d'ads,
dates de création, devise).

1. `ads_library_search` par mots-clés FR (`countries=["FR"]`, `ACTIVE`, limit 50) :
   femme → bague, bracelet, collier, bijoux, sérum visage, cheveux, maquillage, anti-âge,
   cils, ongles ; général → livraison offerte, stock limité, offre limitée, 1 acheté = 1
   offert, satisfait ou remboursé, commandez maintenant.
2. Dédupliquer par `page_id`, écarter apps / séries / services / grandes marques.
3. `lookup q=<nom de page>` (par lots de 5 à 8, sinon rate limit) → active ads, reach 30j,
   domaine.
4. `ads_library_search page_ids=[<id>] ad_active_status=ALL limit=50` → nombre total
   d'ads et date de la plus ancienne ad visible = proxy de l'âge de la page. Heuristique :
   un `page_id` ≥ 1.2e15 est une page créée en 2025-2026 ; total ads > 300 = page ancienne.
5. Produire le rapport en marquant explicitement **non vérifié** : abonnés, nombre de
   produits, Shopify, spend/jour. Les valider dès que les crédits reviennent (§2 étape 5
   et §4).

## 6. Garde-fous

- Ne jamais inventer un reach ou un spend. Si la donnée manque, écrire « n/d ».
- Une page avec beaucoup d'ads mais 0 reach 30j sur Trendtrack est souvent trop récente
  pour être indexée : la garder en « à valider », pas l'écarter.
- Toujours donner le lien Ads Library de chaque ad citée.
- Rappeler la date du reset de crédits Trendtrack si le pipeline de secours a été utilisé.
