# Recherche prod — pré-screening du 27/09/2026

**Statut : pré-screening, pas encore une liste de winners validés.**

Ce que j'ai pu faire aujourd'hui :
- Trendtrack : 0 crédit API restant (1 / 20 000, reset le 30/09/2026 17:25 UTC). Seuls `lookup` et
  `lookup_filter_ids` répondent (gratuits). `search_ads`, `search_shops`, `find_winning_products` refusent.
- Réseau du conteneur : `facebook.com`, `trendtrack.io`, `instagram.com`, `google.com` bloqués
  (403 du proxy, politique de l'environnement). Impossible de piloter le site Trendtrack ou l'Ads
  Library dans un navigateur, donc pas de bouton « Reveal all spend » ni de tri par daily spend.
- Ce qui marche : Meta Ads Library (outil API) + Trendtrack `lookup`. Pipeline de secours du skill
  `winner-product-research` (§5).

Donc, pour chaque page ci-dessous, les colonnes **abonnés IG/FB, nombre de produits, Shopify,
spend/jour** ne sont **pas vérifiées**. Le critère primordial (3 ads ≥ 500k reach ou ≥ 60 €/jour)
n'est validé pour aucune page : à faire le 30/09 (crédits) ou dès que le réseau autorise
`facebook.com` + `app.trendtrack.io`.

Sources : Meta Ads Library (FR, ads actives, 12 requêtes mots-clés + 25 requêtes par page_id) et
Trendtrack `lookup` (active ads, reach 30 j). Date de « 1re ad » = plus ancienne ad visible dans les
50 dernières ; quand le total dépasse 50, la page peut être plus vieille (noté ≥).

## Passe 1 — toutes niches (hors alimentaire), shops récents (≤ 40 j)

| Produit / angle | Page (page_id) | Domaine | 1re ad vue | Ads total / actives | Reach 30 j (TT) | Devise | Verdict provisoire |
|---|---|---|---|---|---|---|---|
| Genouillère « -40 € sur la 2e », 2 achetées = 2 offertes | Artivys (1276239285578225) | artivys.fr | 20/09 (34 ads, historique complet) | 34 / 25 | n/d (0) | EUR | **Candidat fort** : 7 jours, 25 ads actives, offre agressive |
| Genouillère « 1 acheté 1 offerte », stabilité genou | Stabya.off (1361157023743382) | stabya.com | 23/09 (14 ads, complet) | 14 / 12 | n/d | EUR | **Candidat** : 4 jours, 12 ads lancées le 26/09 |
| Coussin ergonomique Ergolune | Ergolune (1270994119434533) | ergolune.fr | 16/09 (15 ads, complet) | 15 / 10 | n/d | EUR | Candidat : 3 vagues d'ads (16/09, 21/09, 27/09) |
| Produit « -40 % aujourd'hui seulement » (à identifier) | Comforta (1241965165674836) | comforta.fr | 18/09 (19 ads, complet) | 19 / 11 | n/d | EUR | Candidat : 3 vagues, produit à identifier sur le site |
| Genouillère mécanique KynFlex (FR + SE) | KynFlex / Novéla (998431330029398) | kynflex.com | ≥ 01/09 (126 ads) | 126 / 13 | n/d | EUR | Candidat : lancé ~fin août, à confirmer ≤ 40 j |
| CozyArt, couverture à colorier + feutres offerts | Mahozen (1128817233646876) | mahozen.com | ≥ 18/09 (166 ads) | 166 / 36 | 210 514 | EUR | Candidat : 36 actives, reach 30 j déjà 210k, cadeau/famille |
| Équipement mobilité (à identifier) | Sereina Boutique (1324291747434029) | n/d | 26/09 (5 ads, complet) | 5 / 5 | n/d | EUR | Trop tôt, surveiller |
| Multi-gadgets (caméra d'inspection, douille universelle, couverture) | Demeurya (1142394672283583) | demeurya.com | ≥ 08/09 (553 ads) | 553 / 23 | 400 572 | USD | À vérifier : probablement > 40 produits (boutique générale) |

Écartés (page trop ancienne, > 40 j) : TaGravure (1re ad 21/05), SIRR Jewelry (23/07), Praktik Care
(09/07), E Kessler (1 882 ads), Harmova (2 748 ads), Illosa (277 actives), Lymphelia (complément,
alimentaire). Écartés hors e-commerce : pages « Ns-… », « Joyreels », « Novel Hub » (apps de
mini-séries), instituts / cliniques / salons.

## Passe 2 — niche femme, shops récents (≤ 40 j)

| Produit / angle | Page (page_id) | Domaine | 1re ad vue | Ads total / actives | Reach 30 j (TT) | Devise | Verdict provisoire |
|---|---|---|---|---|---|---|---|
| Bracelet / collier cadeau « à ma fille », « à mon fils », « pour Maman » | Lixava (1361094017085572) | lixava.com | 27/09 (18 ads, complet) | 18 / 14 | n/d (trop récent) | EUR | **Candidat fort** : 18 ads lancées en une journée, page toute neuve |
| Bracelet (8 ads « Novulana ») | Novulana (1325494240641764) | novulana.com | 24/09 (8 ads, complet) | 8 / 8 | n/d | EUR | Candidat : 3 jours, à identifier le produit exact |
| Appareil micro-infusion / soin anti-âge à domicile | LumBeauty France (819103704624996) | lum-beauty.com | ≥ 17/09 (115 ads) | 115 / 20 | n/d | EUR | Candidat : 20 actives, 2 angles (anti-âge, micro-infusion) |
| Patch yeux « devient transparent quand il agit » | Miyaa-Beauty (1281163905088939) | miyaa-beauty.com | ≥ 19/09 (127 ads) | 127 / 6 | n/d | EUR | Candidat : lancé mi-septembre, vérifier l'âge exact |
| Soin rides au-dessus des lèvres, offre 1+1 | Opermal (1012306315299069) | opermal.com | ≥ 05/09 (230 ads) | 230 / 16 | n/d | EUR | À vérifier : 230 ads en 3 semaines = gros test créa |
| Poils du menton (SOPK), « secret de l'Égypte ancienne » | Kelinia (1099407986598660) | kelinia.com | ≥ 26/09 (240 ads) | 240 / 48 | 271 482 | USD | À vérifier : 48 actives, reach 271k ; page peut-être plus ancienne |

Écartés (page ancienne mais qui scale, utiles comme benchmark créa) : Ailence (sérum coréen, 70
actives, 2,0 M reach 30 j), Maholash (140 actives, 2,5 M), OH MY JELLY (151 actives, 733k),
Levona Paris (89 actives, 649k), Ko-Kow (103 actives, 415k), Cheoni (69 actives), Biijoos (1 951
ads, 18 actives, 348k), SIRR Jewelry (66 jours), TaGravure (4 mois).

## À faire dès que Trendtrack / le réseau reviennent (30/09)

1. `search_shops match_mode=exact` sur chaque domaine ci-dessus : date de création, nb produits,
   Shopify, abonnés IG/FB.
2. Ads Library de chaque page → « Reveal all spend » → « Sort by daily spend » → relever reach +
   spend/jour des 3 premières ads → cocher le critère primordial.
3. Ne garder que les pages ✔ et remplir la fiche produit (format du skill §3).
4. Relancer `search_ads` avec les filtres complets pour attraper les pages absentes de mes 12
   requêtes mots-clés (les mots-clés ne couvrent pas toutes les niches).
