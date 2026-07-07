# External services & pricing

Reference for every third-party service the Kazedra site depends on. Keep this file in sync when something changes — it's the one source of truth outside the code.

> **Visites 3D — migré vers Roogo (juillet 2026).** Le service de visites virtuelles 3D (page marketing, réservation self-serve, PawaPay, Supabase `bookings`, SMS Africa's Talking) appartient désormais à la marque Roogo. Tout est documenté dans `roogo-web/docs/visites-3d.md`. Ce site redirige `/visites-3d` (308) vers `https://www.roogobf.com/visites-3d`. Kazedra est recentré sur le développement logiciel et le conseil.

---

## Stripe (projet global)

Les variables `STRIPE_SECRET_KEY` et `STRIPE_WEBHOOK_SECRET` sont utilisées par les routes `src/app/api/checkout_sessions` et `src/app/api/webhooks.js` (checkout d'abonnement Roogo, héritage). Aucun autre service de paiement n'est branché sur ce site.
