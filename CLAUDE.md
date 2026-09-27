# Règles de travail (SOP) — à respecter dans toutes les sessions

## Meta Ads : ne jamais toucher une campagne active sans permission explicite

- **Interdit sans confirmation écrite de l'utilisateur dans la conversation en cours** :
  créer, modifier, mettre en pause, réactiver, dupliquer, supprimer, changer le budget,
  l'enchère, l'audience, le placement, la créa, l'événement d'optimisation ou le pixel
  d'une campagne, d'un ad set ou d'une ad **publiée / active**. Toucher une campagne
  active la remet en phase d'apprentissage.
- Concrètement : aucun appel `ads_create_*`, `ads_update_entity`, `ads_activate_entity`,
  `ads_creative_*` (create/update/delete), `ads_boost_ig_post`, `ads_experiment_*`,
  ni aucune mutation catalogue / pixel (`ads_pixel_event_*`, `ads_catalog_*` en écriture)
  sans que l'utilisateur ait dit explicitement « ok fais-le » pour cette action précise.
- Une permission donnée pour une action ne vaut pas pour la suivante.
- Les lectures (`ads_get_*`, `ads_library_search`, stats et qualité de pixel) sont libres.
- En cas de doute : proposer la modification en clair (quoi, sur quelle entité, valeur
  avant / après) et attendre la confirmation.

## Shopify

- Même principe pour la boutique : pas de mutation (produits, thème, pixels, réductions,
  commandes) sans confirmation explicite. Lectures libres.

## Recherche produit

- Utiliser le skill `winner-product-research` (`.claude/skills/winner-product-research/`).
- Les rapports vont dans `research/`.
