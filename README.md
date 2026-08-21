# Kartikey Fasteners — website

Marketing and product site for Kartikey Fasteners, a manufacturer of MS, SS and brass
fasteners in Phase 9, Industrial Area, Mohali (SAS Nagar), Punjab.

Built with **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4**.
All six routes are statically prerendered.

```bash
npm run dev     # http://localhost:3000
npm run build   # production build (standalone output)
npm run start   # serve the production build
npm run lint
```

Copy `.env.example` to `.env.local` and add a Resend API key before the enquiry
form will send anything.

## Routes

| Route             | Page                    | Content                                                               |
| ----------------- | ----------------------- | --------------------------------------------------------------------- |
| `/`               | Homepage                | Hero, value props, company intro, product grid, process, customers    |
| `/products`       | Products                | All 11 product lines, raw material, plating finishes                  |
| `/infrastructure` | Plant & machinery       | Facility gallery, 7-stage process, machinery ledger, metrology room   |
| `/about`          | About us                | Introduction, philosophy, aim, vision, quality policy, QMS, customers |
| `/quality`        | Certifications          | ISO certificates, third-party test reports, testing machines          |
| `/contact`        | Contact                 | Address, phone, department emails, enquiry form                       |
| `/api/enquiry`    | POST handler            | Validates the enquiry and sends it via Resend                          |

A floating WhatsApp button (`wa.me/919872621694`) appears on every page once the
visitor scrolls past the fold, and the company profile PDF is downloadable from
every page.

## Enquiry form → email

`POST /api/enquiry` sends through [Resend](https://resend.com).

| Variable         | Default                                  |
| ---------------- | ---------------------------------------- |
| `RESEND_API_KEY` | — **required**, the route 503s without it |
| `MAIL_TO`        | `Kartikeyfasteners@gmail.com`             |
| `MAIL_FROM`      | `Kartikey Fasteners <info@kaisoul.tech>`  |

`Reply-To` is set to the enquirer, so hitting reply in Gmail answers the customer
directly.

**Before it will send, `kaisoul.tech` must be verified in Resend** — add the DKIM
and SPF records Resend gives you to that domain's DNS. Resend rejects sends from
unverified domains, which surfaces on the site as "We could not send that just
now."

The route also enforces:

- required name, email and requirement, with email format checked
- a hidden honeypot field — bots that fill it get a `200` and nothing is sent
- 5 enquiries per IP per 10 minutes, then `429`

Verified locally against a dummy key: missing fields → `400`, malformed email →
`400`, honeypot → silent `200`, valid payload → reaches Resend, 6th request →
`429`.

## 3D hero

The landing page hero renders **real WebGL geometry**, not CSS transforms:
a hex bolt, washer, hex nut, pan-head machine screw, countersunk self-tapping
screw and flange nut, in brushed steel and blued steel.

- **Everything is generated in the browser** from a few dozen numbers in
  [`three/fasteners.ts`](./src/components/three/fasteners.ts) — hexagons as
  extruded shapes with bored holes, dome heads swept on a lathe, and threads as
  a tube swept along a helix curve (tapering to a point on the self-tapper).
  There is **no `.glb` or `.obj` to download**.
- **Scroll assembles it.** At rest the washer and nut float apart from the bolt;
  as you scroll the hero away they rise onto the shank and the nut spins on as
  it would on a real thread. Satellites pop in on load with an easing overshoot
  and pop back out as the hero leaves.
- Metal is lit by a procedural `RoomEnvironment` studio probe through a
  PMREM pass — no HDR file either — with a blue rim light from the palette.
- The cluster tracks the pointer with eased parallax.

Performance guards, since the visitor may be on a phone:

- `three` is `next/dynamic`-imported with `ssr: false`, so its ~550 kB chunk is
  **not in the initial bundle** — verified absent from the served HTML
- device pixel ratio capped at 1.75
- the render loop stops entirely when the canvas scrolls off-screen
  (IntersectionObserver) or the tab is hidden (`visibilitychange`)
- camera distance, rig offset and scale all rebind on resize, so the cluster
  clears the headline on desktop and drifts behind the copy on portrait
- every geometry, material, render target and the renderer itself is disposed on
  unmount
- `prefers-reduced-motion` renders a single assembled frame and never starts the
  loop
- if WebGL is unavailable the canvas simply never appears and the grayscale
  photograph underneath is the hero

## Motion

Hand-rolled in [`src/components/motion.tsx`](./src/components/motion.tsx) — no
animation library, because the deploy target has one CPU core and every kilobyte
of JS is parsed on it.

| Primitive     | Used for                                                     |
| ------------- | ------------------------------------------------------------ |
| `Reveal`      | Fade + travel + rotate-in on scroll, staggered across grids   |
| `Reveal pop`  | Scale-in with overshoot, and scale away again on exit         |
| `Tilt`        | Pointer-tracked 3D rotation with a moving specular highlight  |
| `Parallax`    | Hero plates drifting against the scroll                       |
| `CountUp`     | Statistics counting up when they enter the viewport           |
| `Marquee`     | Customer names scrolling continuously, paused on hover        |

Plus CSS-only `lift-3d` cards, drifting `aurora` washes behind dark bands, a
sweeping `sheen`, and the `ping-ring` on the WhatsApp button.

`pop` is deliberately limited to decorative blocks — product tiles and process
cards — and never applied to a paragraph somebody might be reading, because
text that animates away as you scroll back is hostile.

All of it runs off **one shared rAF-throttled scroll listener**, not an
`IntersectionObserver` per element. IO is the more efficient tool, but it can go
silent in an occluded or backgrounded tab, and an element that never reveals is
an element the reader never sees. `schedule()` queues both a `requestAnimationFrame`
and a 64 ms timer — whichever arrives first wins — so a tab that is not
compositing still measures.

**Content never depends on JavaScript.** The hidden state is a CSS rule
(`.reveal:not(.rv-in)`), switched off wholesale by a `<noscript>` override in the
root layout and by `prefers-reduced-motion: reduce`. Every animation is disabled
under reduced motion.

## Deploying

[`deploy.sh`](./deploy.sh) targets a shared VPS with **no root access, one CPU
and one thread**.

```bash
chmod +x deploy.sh ssl.sh
./deploy.sh              # install, build, release, restart, health check
```

| Command                | Does                                            |
| ---------------------- | ----------------------------------------------- |
| `./deploy.sh`          | Full deploy                                     |
| `./deploy.sh build`    | Build and assemble a release only               |
| `./deploy.sh restart`  | Restart the server                               |
| `./deploy.sh status`   | Is it up?                                        |
| `./deploy.sh logs`     | Tail the log                                     |
| `./deploy.sh rollback` | Swap back to the previous release                |

What it does about the single core:

- `output: "standalone"` plus `experimental.cpus: 1` — the release is ~40 MB
  instead of shipping all of `node_modules`, and Next builds with one worker
  instead of thrashing a pool it has no cores for
- `NODE_OPTIONS=--max-old-space-size=1024` so the build fails with a clear error
  instead of being taken by the OOM killer; override with `NODE_HEAP_MB=768`
- `npm ci --maxsockets 3` and `nice -n 10` to keep install and build from
  starving whatever else the shared box is doing
- warns before building if less than 700 MB of RAM is available
- timestamped releases under `.releases/` with a `.current` symlink, keeping the
  last 3 for instant rollback
- PM2 if the host has it, otherwise `nohup` — no systemd, no root
- env files are symlinked into each release, so rotating an API key needs a
  restart, not a redeploy

### TLS without root

[`ssl.sh`](./ssl.sh) uses **acme.sh**, not certbot — it installs into `$HOME`,
runs as your own user, and installs its own renewal cron entry. None of that
needs sudo.

```bash
./ssl.sh install                 # acme.sh into ~/.acme.sh
./ssl.sh issue                   # HTTP-01 via $WEBROOT
DNS_API=dns_cf ./ssl.sh issue    # DNS-01, no open port required
./ssl.sh status                  # expiry dates
```

Certificates land in `~/ssl/` as `fullchain.pem`, `privkey.pem`, `cert.pem` and
`chain.pem`.

**Binding `:443` still requires root, and this script does not pretend
otherwise.** It obtains and renews the certificate; something you do not
control has to terminate TLS and proxy to the Node server on `$PORT`. Pick the
one that matches your host:

- **Panel-managed TLS** (cPanel, Plesk, CyberPanel) — paste the files into the
  panel's SSL screen, or just use the panel's one-click AutoSSL and skip
  `ssl.sh` entirely
- **A vhost you can edit** — point `ssl_certificate` at `~/ssl/fullchain.pem`
  and set `RELOAD_CMD` in `ssl.sh` so renewals take effect
- **Cloudflare in front** — set SSL mode to Full (strict) and install a
  Cloudflare Origin Certificate instead; it lasts 15 years and never renews

DNS-01 is the safer default on a locked-down host, since it needs no inbound
port at all.

## Design system

Structure, typography and component language come from the Stitch project
**Industrial Precision Core** (`3065495923692201406`) — kept verbatim in
[`design-source/`](./design-source):

- Sharp **0px corner radius** on every component.
- **Montserrat** (display, 700/800) · **Inter** (body) · **JetBrains Mono** (uppercase
  labels at `0.1em` tracking).
- "Technical ledger" tables, ghost cards with an accent bar, underline-only form inputs,
  grayscale photography that reveals colour on hover, alternating light/dark section bands.

Colour is the supplied five-stop blue palette rather than the Stitch red:

| Token                | Hex       | Role                                   |
| -------------------- | --------- | -------------------------------------- |
| `--color-primary`    | `#3D52A0` | Brand blue — CTAs, accents, bands      |
| `--color-accent`     | `#7091E6` | Highlights, accent bars, links on dark |
| `--color-muted`      | `#8697C4` | Body text on dark, captions            |
| `--color-line`       | `#ADBBDA` | Borders and rules on light             |
| `--color-tint`       | `#EDE8F5` | Tinted light section background        |

Three shades are **derived** from that family, because a five-stop palette has no dark
anchor and no accessible mid-tone for body copy:

| Token                | Hex       | Role                | Contrast          |
| -------------------- | --------- | ------------------- | ----------------- |
| `--color-navy`       | `#1B2447` | Dark bands, headings| 15.1:1 on white   |
| `--color-primary-dk` | `#32448A` | Primary button hover| —                 |
| `--color-body`       | `#48547E` | Secondary text      | 7.3:1 on white    |

Tokens live in [`src/app/globals.css`](./src/app/globals.css).

## Content

Every factual claim on the site — machinery counts, capacities, certificate numbers,
test methods, addresses, product list — is transcribed from the official company
profile deck and the certificates reproduced inside it. It is centralised in
[`src/lib/company.ts`](./src/lib/company.ts), which is the single place to edit copy,
specifications and contact details.

Notable data:

- **73 machines across 4 units** (Plot 43, 44, 166, 299) — full make/capacity/quantity
  ledger transcribed from the master machinery list.
- **13 classes of calibrated test equipment** with make, least count and range.
- **ISO 9001:2015** (cert. `25MEQTV94`) and **ISO 14001:2015** (cert. `25MEETL86`),
  issued 05/07/2025, valid to 04/07/2028, by Magnitude Management Services Pvt. Ltd.
- Third-party salt spray testing to **ASTM B-117-2019** by Indiana, Mohali.

Photography in `public/img/` is extracted from the profile deck (product shots, plant,
process stages, certificates, team). The logo has had its white background keyed out to
transparency so it sits on any surface.

The downloadable brochure is the company profile deck, recompressed from 14.9 MB
to 6.3 MB by downsampling its photography — visually identical on screen and in
print, less than half the download.

## Known follow-ups

1. **Resend needs a real API key and a verified sender domain.** Add
   `RESEND_API_KEY` to `.env.production.local` and verify `kaisoul.tech` in
   Resend (DKIM + SPF). Until then the form returns 503 and tells the visitor to
   use email or WhatsApp instead.
2. **Address discrepancy in the source deck.** The contact page of the profile gives
   *Plot No. 166, Phase 9*; the ISO certificates give *Plot No. 299, Phase-9, 160062*;
   the machinery list gives *Plot 299, 166, 43 & 44, Phase-9, 160022*. The site uses
   Plot 166 as the contact address and lists all four plots as manufacturing units —
   confirm which should be the public postal address, and the correct PIN.
3. **Customer names are set as a typographic ledger**, not logos. The logos in the deck
   are third-party trademarks flattened into the page image; if you want real logos,
   source clean files and confirm you have permission to display them.
4. **Product size ranges** are shown as "made to order". Add real thread/length ranges
   per line when available.
