# Punere în producție

Aplicația rulează pe serverul „Dezvoltare personală” (78.47.247.17, ARM64), în
`/opt/apps/constelatii`, port **3002**, construită pe server:

```bash
cd /opt/apps/constelatii
git pull
docker compose up -d --build
```

Secretele stau în `/opt/apps/constelatii/.env` (niciodată în depozit); lista
cheilor e în `.env.local.example`.

## Migrările (Prisma)

Migrările din `prisma/migrations` se aplică **înainte** de pornirea codului
care are nevoie de ele, cu `DATABASE_URL` spre baza de producție:

```bash
npx prisma migrate deploy
```

(`prisma.config.ts` citește `DATABASE_URL` din `.env.local`.) Imaginea Docker
nu conține CLI-ul Prisma, deci comanda se rulează de pe un calculator cu
depozitul și `node_modules`, nu din container.

## E-mailurile după înregistrare (cron)

Bun venit (la înregistrare), ziua 1 (doar fără nicio constelație salvată),
ziua 3 (ce a făcut, din date reale), ziua 7 (pachetele, doar fără plată), ziua
de după plată, revenirea după 30 de zile fără activitate, plus ghidul primei
constelații pe e-mail pentru vizitatori și o invitație la cont după 3 zile.
Codul: `lib/lifecycle/`. Primesc doar conturile și vizitatorii creați **după**
migrarea `20260930120000_emailuri_ciclu_de_viata` (momentul se fixează în
`email_settings` când rulează), cel mult un e-mail la 48 de ore (bun venit nu
intră în regulă), niciodată cui a bifat „Nu vreau emailuri…” sau s-a dezabonat
(`/dezabonare`, plus antet List-Unsubscribe cu un click).

1. **Înainte de deploy**: `npx prisma migrate deploy` (migrarea
   `20260930120000_emailuri_ciclu_de_viata`, aditivă: coloanele
   `users.marketing_opt_out`, `users.marketing_choice_at` și tabelele
   `email_settings`, `leads`, `email_log`, `email_unsubscribes`). Fără ea,
   înregistrarea pică.

2. În `.env` pe server: `CRON_SECRET=` cu un șir aleator lung
   și `MYDASHBOARD_STATS_TOKEN=` (HMAC-SHA256(CRON_SECRET din mydashboard, 'stats:constelatii'); le pune `_deploy/dezvoltare_env.py`) —
   fără el, `/api/mydashboard/stats` răspunde 404 și mydashboard nu arată cifrele aplicației
   (`openssl rand -hex 32`); `RESEND_API_KEY` și `EMAIL_FROM` există deja.
   Apoi `docker compose up -d --build`.

3. Cronul, pe server (`crontab -e`), la 15 minute; secretul se citește din
   `.env`, nu se scrie în crontab:

   ```cron
   */15 * * * * curl -fsS -m 120 -X POST -H "Authorization: Bearer $(grep -E '^CRON_SECRET=' /opt/apps/constelatii/.env | cut -d= -f2-)" https://constelatii.com/api/cron/emails >/dev/null 2>&1
   ```

   Probă fără trimitere (numără ce ar pleca, pe feluri):

   ```bash
   curl -X POST -H "Authorization: Bearer $(grep -E '^CRON_SECRET=' /opt/apps/constelatii/.env | cut -d= -f2-)" "https://constelatii.com/api/cron/emails?dry=1"
   ```

   Un lot are cel mult 50 de e-mailuri, cu 600 ms între ele; restul pleacă la
   rularea următoare.

## Pagina de admin (`/admin`)

Conturi noi, vizitatori care au cerut ghidul, clienți plătitori (e-mail, dată,
pachet, sumă, factură), checkout-uri neplătite, încasări azi / 7 / 30 de zile /
total și e-mailurile din ciclul de viață pe tip (plus dezabonări). Aceleași
cifre ca în mydashboard (`lib/stats.ts`).

În `.env` pe server: `ADMIN_EMAILS=adresa@exemplu.ro` (mai multe, separate prin
virgulă). Se intră logat cu un cont care are una dintre adrese; fără variabilă,
`/admin` răspunde 404 pentru toți. Înregistrarea nu verifică adresa de e-mail,
deci contul pentru adresa din `ADMIN_EMAILS` trebuie creat înainte de a seta
variabila.
