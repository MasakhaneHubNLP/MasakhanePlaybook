# Newsletter infra (Listmonk + Amazon SES + Caddy)

Self-hosted newsletter for the Masakhane Playbook. **AGPLv3 / fully open source.**

```
Docusaurus site (GitHub Pages)
        │
        │  HTML form submission
        ▼
newsletter.<your-domain>  ◀──── Caddy (TLS terminator) ◀──── port 80/443 ◀── DNS A record
        │
        ▼
Listmonk (port 9000)  ◀──── Postgres
        │
        │  SMTP
        ▼
Amazon SES  ──────────►  subscriber inbox
```

What's in this folder:

- [docker-compose.yml](docker-compose.yml) — the full stack (Listmonk + Postgres + Caddy)
- [Caddyfile](Caddyfile) — reverse proxy + TLS + CORS
- [.env.example](.env.example) — environment variable template

---

## One-time prerequisites

- A **domain** you control with the ability to add DNS records (e.g., `masakhane.io`, or a subdomain delegated to you).
- An **AWS account** for SES.
- A **VPS** running Docker (any provider; recommendations below).
- ~2 hours for first-time setup.

---

## Step 1 — Provision a VPS

Pick whichever fits:

| Provider | Plan | Cost | Notes |
| --- | --- | --- | --- |
| Hetzner | CX22 | €4.51/mo | EU regions; great price/perf |
| DigitalOcean | Basic 1 GB | $4/mo | NYC/SFO/AMS/SGP |
| Fly.io | shared-cpu-1x | free tier–$2/mo | Global anycast; small but works |
| Vultr | Cloud Compute 1 GB | $5/mo | Many regions |

Minimum specs: **1 vCPU, 1 GB RAM, 25 GB disk, Ubuntu 24.04 LTS.**

Once provisioned, SSH in and:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose-v2 git
sudo usermod -aG docker $USER
# log out, log back in so docker group applies
```

---

## Step 2 — Point a DNS A record at the VPS

In your DNS provider's panel, add:

```
Type:   A
Name:   newsletter           (so the FQDN is newsletter.your-domain)
Value:  <VPS public IPv4>
TTL:    300
```

If you also want IPv6, add an `AAAA` record with the VPS's IPv6 address.

Wait until `dig newsletter.your-domain +short` returns the VPS IP from anywhere (~5 min).

---

## Step 3 — Set up Amazon SES

SES is the cheapest production-grade SMTP option (~$0.10 per 1000 emails). New accounts start in **sandbox mode** — you can only send to verified addresses. To go to production you must request access (form + a day or two of waiting).

### 3a. Verify the sending domain

In the AWS console → SES → **Verified identities** → **Create identity**:

- Identity type: **Domain**
- Domain: `your-domain` (the apex; SES will instruct you to send from `noreply@your-domain` or any subdomain)
- Use a custom MAIL FROM domain: optional but improves deliverability — pick something like `mail.your-domain`
- Tick **DKIM signing**

SES gives you ~6 DNS records to add (3× CNAME for DKIM, 1× MX, 1× TXT for SPF). Add them in your DNS provider's panel and wait. Status flips to "Verified" once SES picks them up (~30 min, sometimes hours).

### 3b. Create SMTP credentials

SES → **SMTP settings** → **Create SMTP credentials**. Note the:

- **SMTP endpoint** — e.g., `email-smtp.us-east-1.amazonaws.com`
- **Port** — 587 (STARTTLS) or 465 (TLS)
- **Username** — looks like `AKIAxxxxxxxxxxxx`
- **Password** — long base64 string, **shown only once**, copy it now

Save these — you'll paste them into Listmonk's SMTP settings later.

### 3c. Move out of sandbox

Open a "Production access" support case in SES. Tell them you're sending opt-in newsletter emails to subscribers from a community open-source project. Approval is usually within 24 hours.

While in sandbox, you can still test by adding `your-own-email@example.com` as a verified identity (Verified identities → Create identity → Email address).

---

## Step 4 — Deploy the stack

On the VPS:

```bash
mkdir -p ~/newsletter && cd ~/newsletter
# Copy these files from the repo (or git clone the repo and cd into infra/newsletter/)
# Then:
cp .env.example .env
# Edit .env with strong random values:
nano .env
# Edit Caddyfile and replace newsletter.example.org with your real hostname:
nano Caddyfile
```

Generate strong values for the .env (run on your laptop or the VPS):

```bash
openssl rand -base64 32   # use the output for LISTMONK_DB_PASSWORD
openssl rand -base64 32   # and for LISTMONK_ADMIN_PASSWORD
```

Boot the stack:

```bash
docker compose up -d
docker compose logs -f
```

After ~30 seconds, Caddy provisions a Let's Encrypt cert for your hostname and starts routing.

Verify:

```bash
curl -I https://newsletter.your-domain
# Expect: HTTP/2 200 ... server: Caddy
```

Open `https://newsletter.your-domain/admin` in your browser → log in with the admin user/password from `.env`.

---

## Step 5 — Configure Listmonk SMTP

Inside the Listmonk admin UI:

1. **Settings → Mailers → Edit the default mailer**:
   - Hostname: your SES endpoint (e.g., `email-smtp.us-east-1.amazonaws.com`)
   - Port: `587`
   - Username: SES SMTP username (the `AKIA...` value)
   - Password: SES SMTP password
   - Encryption: `STARTTLS`
   - Hello hostname: your sending domain
   - Email address: e.g., `Masakhane Newsletter <newsletter@your-domain>`
2. **Test by clicking "Send test"**. If you're still in SES sandbox, only verified addresses receive the test.
3. **Settings → SMTP relay** can be left at defaults.

---

## Step 6 — Create your list and form

1. **Lists → New list**:
   - Name: `AfricaNLP Newsletter`
   - Type: `Public`
   - Optin: `Double` (recommended — sends a confirmation email; required for GDPR)
2. **Forms** (left sidebar):
   - Tick the new list
   - Listmonk shows a generated `<form>` HTML block
   - Copy that block — you'll paste it into the Docusaurus newsletter page

---

## Step 7 — Embed the form on the Docusaurus site

Edit [src/pages/newsletter.md](../../src/pages/newsletter.md). Replace the `Coming soon` block with the form HTML Listmonk gave you. It looks roughly like:

```html
<form method="post" action="https://newsletter.your-domain/subscription/form" class="listmonk-form">
  <div>
    <input type="hidden" name="nonce" />
    <p><input type="email" name="email" required placeholder="E-mail" /></p>
    <p><input type="text" name="name" placeholder="Name (optional)" /></p>
    <p><input type="hidden" name="l" value="..." /></p>
    <p><button type="submit">Subscribe</button></p>
  </div>
</form>
```

Commit, push, deploy. The form posts directly to Listmonk; no JS, no CORS preflight problems for vanilla form posts.

---

## Operations

### Backup

The only stateful container is Postgres. Back it up daily:

```bash
docker compose exec -T db pg_dump -U listmonk listmonk | gzip > ~/backups/listmonk-$(date +%F).sql.gz
```

Drop that into a cron job and rsync `~/backups/` to S3 / Backblaze B2.

### Updates

```bash
cd ~/newsletter
docker compose pull
docker compose up -d
```

The Listmonk container's start command runs `--upgrade --yes` automatically, so schema migrations are applied on each restart.

### Logs

```bash
docker compose logs -f app    # Listmonk
docker compose logs -f caddy  # Caddy / TLS
docker compose logs -f db     # Postgres
```

### Common gotchas

- **Form submissions blocked by CORS**: the Caddyfile sets the right headers for browsers. If you self-submit via JS rather than a plain `<form>`, ensure your origin is in `Access-Control-Allow-Origin`.
- **Emails go to spam**: confirm DKIM (Step 3a) is verified, MAIL FROM domain is set, SPF includes `amazonses.com`. Send a test through https://www.mail-tester.com to score deliverability.
- **SES sandbox limit**: 200 emails/day, 1 email/second, only verified recipients. Production access lifts these.
- **Postgres won't start after a host reboot**: usually a permission issue on `listmonk-db` volume. `docker compose down && docker compose up -d` fixes it.

---

## Cost estimate

| Item | Monthly |
| --- | --- |
| Hetzner CX22 VPS | ~€4.50 (~$5) |
| AWS SES (10 000 emails/month) | $1 |
| Domain (yearly amortized) | ~$1 |
| **Total** | **~$7/month** |

Scales to 100 000 subscribers on the same hardware. Migrate up when you outgrow it.

---

## Why not Substack / Buttondown / Mailchimp?

You explicitly asked for fully open source. Listmonk + SES is the only mature stack that meets that bar. Substack and Buttondown are SaaS — convenient but lock in subscriber data on someone else's servers; Mailchimp's pricing punishes growth. Listmonk is what Caddy, Element, and many other OSS projects use for their own newsletters.

---

## License

Listmonk is **AGPLv3** — fine for self-hosting; the AGPL trigger only applies if you offer Listmonk *as a service to other parties* and modify the source. Running it for your own newsletter, even publicly accessible, is unaffected.
