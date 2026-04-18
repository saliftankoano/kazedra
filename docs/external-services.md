# External services & pricing

Reference for every third-party service the Kazedra site depends on, plus the prices we charge clients. Keep this file in sync when something changes — it's the one source of truth outside the code.

---

## Service pricing — 3D virtual tours

| Formule | Prix | Inclus |
|---|---|---|
| Scan 3D seul | **50 000 FCFA / bien** | Scan sur place, lien de visite Kuula partageable, livraison sous 48 h |
| Scan 3D + publication sur Roogo | **30 000 FCFA / bien** | Tout le scan + annonce Roogo avec la visite 3D mise en avant |

- Unité: par bien scanné.
- Zone couverte (v1): **Ouagadougou uniquement**.
- Paiement: **Mobile Money (Orange ou Moov) au moment de la réservation**, via PawaPay. Le créneau est maintenu 8 minutes pendant le paiement ; passé ce délai sans confirmation, il redevient disponible.
- Livrable: lien Kuula hébergé, accessible sans installation, partageable sans limite.

Les montants affichés côté site sont définis dans `src/lib/time-slots.ts` :

```ts
export const PRICE_SCAN_ONLY = 50000;
export const PRICE_SCAN_WITH_ROOGO = 30000;
```

---

## Kuula — hébergement des visites 3D

- Utilisé pour héberger et embarquer les visites produites par l'équipe.
- Collection de démonstration embarquée sur `/visites-3d` :
  `https://kuula.co/share/collection/7MDZD?logo=1&info=1&fs=1&vr=0&thumbs=1&inst=fr`
- Mode d'intégration : `<iframe>` (plus sûr que le `<script>` officiel dans Next.js).
- À surveiller : limite du plan gratuit (nombre de scans, résolutions). Passer sur un plan payant avant d'y atteindre.

---

## Supabase — stockage des réservations

Projet: à créer sur [supabase.com](https://supabase.com) (région la plus proche : `eu-west-2` ou `eu-central-1`).

### Variables d'environnement

Ajouter à `.env.local` :

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Schéma

Le schéma SQL vit dans `supabase/migrations/0001_bookings.sql`. Exécuter dans le SQL Editor de Supabase.

Points importants :
- Table `bookings` (id, date, slot, name, company, phone, email, address, area_band, with_roogo, notes, status, created_at).
- Index unique partiel `bookings_active_slot_uniq` sur `(date, slot)` où `status <> 'cancelled'` — empêche toute double-réservation (source de vérité contre les collisions).
- Vue `booking_slots_view` (date, slot) — exposée en lecture seule au rôle `anon` pour la requête de disponibilité, sans fuite de PII.
- RLS active sur `bookings`, accès refusé en lecture/écriture — seules les routes API (via la clé `service_role`) peuvent écrire.

### Statuts

- `pending_payment` — réservation créée, en attente de la confirmation PawaPay. Bloque le créneau tant que `held_until > now()` (fenêtre de 8 minutes).
- `confirmed` — paiement Mobile Money réussi, réservation active (bloque le créneau).
- `cancelled` — la ligne n'occupe plus le créneau (paiement échoué, expiré, ou annulation manuelle). On peut re-réserver.
- `completed` — la visite a eu lieu (bloque toujours le créneau dans l'historique).

La migration `supabase/migrations/0002_payments.sql` ajoute les colonnes `payment_deposit_id`, `payment_status`, `payment_provider`, `held_until`, étend le `check` sur `status` pour inclure `pending_payment`, et redéfinit `booking_slots_view` pour compter comme pris tout créneau `confirmed` OU `pending_payment` dont le hold n'est pas expiré.

---

## PawaPay — encaissement Mobile Money

Agrégateur Mobile Money utilisé pour encaisser la totalité du tarif au moment de la réservation. Partagé avec Roogo — on réutilise le même merchant account, pas de nouvelle inscription.

### Sandbox vs live

Le code (`src/lib/pawapay.ts`) résout l'environnement via `PAWAPAY_LOCAL_MODE` :

- `PAWAPAY_LOCAL_MODE=sandbox` → `https://api.sandbox.pawapay.io` — numéros de test uniquement, aucun débit réel.
- `PAWAPAY_LOCAL_MODE=live` → `https://api.pawapay.io` — paiements réels.
- **En production (`NODE_ENV=production`), le live est forcé**, quelle que soit la valeur de `PAWAPAY_LOCAL_MODE`.

### Variables d'environnement

`.env.local` :

```
PAWAPAY_LOCAL_MODE=sandbox
PAWAPAY_SANDBOX_URL=https://api.sandbox.pawapay.io
PAWAPAY_SANDBOX_API_TOKEN=<token sandbox — copier depuis le .env.local de Roogo>
PAWAPAY_LIVE_URL=https://api.pawapay.io
PAWAPAY_LIVE_API_TOKEN=<token live — copier depuis le .env.local de Roogo>
```

Les tokens vivent dans le dashboard PawaPay → Settings → API tokens. On les partage avec Roogo : ne pas en générer de nouveaux.

### Couverture Burkina Faso

| Opérateur | Code provider | Devise | Format numéro |
|---|---|---|---|
| Orange Money | `ORANGE_BFA` | XOF | `226XXXXXXXX` (11 chiffres, sans `+`) |
| Moov Money | `MOOV_BFA` | XOF | `226XXXXXXXX` |

**Orange Money — étape OTP obligatoire.** L'utilisateur doit composer `*144*4*6#` sur son téléphone Orange pour obtenir un code de pré-autorisation, qu'il saisit ensuite dans le modal de paiement. Le code (`preAuthorisationCode`) est joint à la requête `/v2/deposits`. Moov ne nécessite pas cette étape — une simple confirmation USSD suffit.

### Flux technique

1. `POST /api/payments/initiate` — valide le formulaire, nettoie les `pending_payment` expirés, insère la ligne `bookings` avec `status='pending_payment'` et `held_until=now()+8min`, appelle PawaPay `/v2/deposits`, renvoie `{ depositId }`.
2. Le client poll `POST /api/payments/status` toutes les 3 secondes (max 20 tentatives = 60 s). La route lit d'abord la base (court-circuit sur état terminal), sinon appelle `GET /v2/deposits/{depositId}` et synchronise.
3. PawaPay envoie un webhook → `POST /api/pawapay/callback`. Le route valide l'IP source (liste blanche des 7 IPs PawaPay en production), met à jour la base, et sur `COMPLETED` déclenche l'envoi SMS (client + équipe) via Africa's Talking.
4. SMS non-blocking : le poll (`/api/payments/status`) et le webhook peuvent tous deux détecter le `COMPLETED`. Chacun n'envoie le SMS que si l'état précédent n'était pas déjà `completed` — le premier gagne, l'autre est no-op.

### Callback — IPs autorisées (production)

La liste est maintenue dans `src/lib/pawapay.ts` (`PAWAPAY_IPS`). Toute requête hors liste reçoit 403. En développement (`NODE_ENV !== 'production'`), le filtre IP est désactivé pour permettre les tests locaux.

À configurer côté PawaPay : dashboard → Settings → Webhooks → URL de production `https://www.kazedra.com/api/pawapay/callback`.

### Numéros de test (sandbox)

La liste complète vit dans `docs/pawapay-test-numbers.md` du repo Roogo. En résumé, chaque provider expose :
- un numéro qui réussit systématiquement (`COMPLETED`) ;
- un qui échoue (`FAILED`) avec différents failure codes ;
- un qui reste en `SUBMITTED` pour tester le polling long.

Tous les montants XOF sont acceptés en sandbox — pas de solde à provisionner.

### Coûts

Frais marchand PawaPay : ~1,5 % par transaction réussie Orange/Moov au Burkina (à vérifier dans le dashboard PawaPay → Settings → Pricing pour le tarif exact applicable au compte partagé avec Roogo). Facturé directement à l'entité PawaPay — pas d'intégration comptable séparée côté Kazedra.

### Hold de 8 minutes

Choix produit : assez long pour laisser le temps de taper le code USSD, assez court pour libérer les créneaux abandonnés sans cron. Le mécanisme d'auto-nettoyage est dans `/api/payments/initiate` : avant chaque INSERT, toute ligne `status='pending_payment' AND held_until < now()` est flippée en `cancelled`, ce qui débloque l'index unique partiel. Si le volume augmente et que des holds s'accumulent (ex. trafic faible, pas d'initiate pendant des heures), envisager un cron Supabase qui exécute le même UPDATE toutes les 5 minutes.

---

## Africa's Talking — envoi de SMS

Choisi pour la couverture des opérateurs burkinabè (Onatel, Orange, Telecel) et la simplicité de l'API.

### Sandbox vs live

Le SDK route automatiquement vers le bon environnement en fonction du `AT_USERNAME` :

- `AT_USERNAME=sandbox` → `https://api.sandbox.africastalking.com` — aucun SMS réel envoyé, aucun coût.
- `AT_USERNAME=<votre app live>` → `https://api.africastalking.com` — SMS réels, facturés selon le barème ci-dessous.

**Règle** : **toujours** utiliser sandbox en développement local, **uniquement** live en production. Le code (`src/lib/africastalking.ts`) logge le mode actif au premier envoi et avertit si la combinaison `NODE_ENV`/username paraît suspecte.

### Variables d'environnement

`.env.local` (développement) :

```
AT_USERNAME=sandbox
AT_API_KEY=<votre clé sandbox générée depuis le dashboard AT>
AT_SENDER_ID=              # laisser vide en sandbox
TEAM_PHONE=+22670000000    # votre propre numéro pour tester
```

Production (Vercel/hébergeur) :

```
AT_USERNAME=<nom de votre app live AT>
AT_API_KEY=<clé API live>
AT_SENDER_ID=KAZEDRA       # optionnel — sender ID validé par AT, sinon shared shortcode
TEAM_PHONE=+226XXXXXXXX    # numéro de l'équipe commerciale
```

### Tarifs SMS — Burkina Faso

Tarifs facturés à Kazedra par message sortant, par palier mensuel :

| Opérateur | Basic (USD 0–150) | Plus (USD 151–800) | Premium (USD 801–3 000) | Max (USD 3 001+) |
|---|---|---|---|---|
| Onatel | 0,052 | 0,050 | 0,048 | 0,045 |
| Orange | 0,052 | 0,050 | 0,048 | 0,045 |
| Telecel | 0,052 | 0,050 | 0,048 | 0,045 |

(source : panel Africa's Talking, consulté lors de la mise en place du service).

Ordre de grandeur : 2 SMS par réservation (client + équipe) ≈ 0,10 USD.

### Templates

Définis dans `src/lib/africastalking.ts` :

- **Client** : `Kazedra a confirme votre visite 3D le {date} a {slot}. Nous vous appellerons la veille pour finaliser l'acces au bien. Merci !`
- **Équipe** : `Nouvelle reservation 3D: {nom} ({societe}) / {tel} / {date} {slot} / {adresse} / {tarif}`

Pas d'accents dans les templates pour éviter les problèmes d'encodage GSM-7 (risque de split en deux SMS).

### Comportement en cas d'échec

Un échec d'envoi SMS ne bloque pas la confirmation de la réservation. Le paiement PawaPay a déjà été encaissé et la ligne `bookings` est déjà `confirmed` en base — les erreurs SMS sont loggées (`console.error`) et l'équipe peut rattraper manuellement en consultant le dashboard Supabase.

---

## Configuration des créneaux horaires

- Blocs de 2 heures, tous les jours, entre 7h et 17h :
  - 07:00–09:00
  - 09:00–11:00
  - 11:00–13:00
  - 13:00–15:00
  - 15:00–17:00
- Définis dans `src/lib/time-slots.ts` **et** dans le `check` du SQL (`supabase/migrations/0001_bookings.sql`). Toute modification doit être appliquée aux deux endroits.

---

## Stripe (projet global, pas utilisé par les visites 3D)

Les variables `STRIPE_SECRET_KEY` et `STRIPE_WEBHOOK_SECRET` sont utilisées par Roogo (`src/app/api/checkout_sessions`) — les visites 3D encaissent via PawaPay (Mobile Money), pas Stripe.
