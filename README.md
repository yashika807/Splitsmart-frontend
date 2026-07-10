# SplitSmart — Frontend

A group expense splitter that lets you describe spending in plain English
("Rahul paid 500 for dinner") and have AI turn it into structured expenses,
then works out the minimum set of payments needed to settle up.

React + Vite frontend, backed by a Spring Boot API. Built as a learning
project / portfolio piece.

**Live app:** _(add your Netlify URL here once deployed)_
**Backend repo:** [splitsmart-backend](https://github.com/yashika807/splitsmart-backend)

## Screenshots

> TODO — add real screenshots/GIFs here once the full stack is running with
> a few sample expenses in it. A good demo should show: the receipt-splitting
> flow end to end (upload → assign items → summary), the AI parser turning a
> sentence into expenses, the Trip/Family toggle, and the settlement view.

## Features

- **Receipt photo → itemized split** (flagship feature) — photograph a
  receipt, Gemini's vision model reads every line item, you assign each item
  to one or more people, and the app works out each person's share including
  their *proportional* cut of tax and tip — not an even split. See below.
- **AI expense parsing** — describe an expense in plain English (English or
  Hindi/English mix), Gemini extracts `{ name, amount }` pairs server-side
- **Manual entry** — a plain form for when you'd rather not type a sentence
- **Trip vs Family toggle** — keep a one-off trip's expenses separate from
  recurring family expenses; each new expense is tagged with whichever tab
  is active
- **Settlement view** — a greedy debt-simplification algorithm reduces
  "who owes who" down to the minimum number of payments
- **Live refetch** — every mutation (add/delete) refetches from the server
  rather than patching local state, avoiding drift between client and DB

## Receipt splitting, in detail

This is the most technically interesting part of the app, so it gets its own
section. `ReceiptSplitter.jsx` drives the whole flow client-side:

1. Upload or photograph a receipt (`capture="environment"` opens the camera
   directly on mobile). The image is POSTed to the backend's
   `/api/expenses/parse-receipt`, which sends it to Gemini's vision model and
   gets back structured line items plus subtotal/tax/tip.
2. Every field is editable — Gemini gets the occasional item name or price
   wrong, and you shouldn't have to re-photograph a receipt to fix a typo.
3. Each item gets assigned to one or more people (shared items, like a
   starter someone split, get divided evenly across their assignees).
4. The "who owes what" summary allocates tax and tip *proportionally* to
   each person's share of the subtotal, not evenly — someone who ordered a
   $5 side shouldn't owe the same tax as someone who ordered a $40 entrée.
5. Saving persists one `Expense` for the payer's full total — the itemized
   breakdown is real, useful math shown once at split time, but (deliberately)
   doesn't feed into the aggregate Settlement page, which assumes an even
   split. See [What I Learned](#what-i-learned) for why.

## Tech stack

React 19, Vite, React Router 6. No CSS framework — inline styles throughout
(a deliberate simplicity tradeoff for a learning project, see below).

## Architecture

```mermaid
flowchart LR
    User[Browser] -->|HTTPS| FE["React + Vite\n(Netlify)"]
    FE -->|REST / JSON| BE["Spring Boot API\n(Java 21)"]
    BE --> DB[(PostgreSQL 18)]
    BE -->|HTTPS| Gemini["Gemini API\ngemini-2.5-flash-lite"]
```

The frontend never talks to Gemini directly — all AI calls are proxied
through the backend so the API key never reaches the browser. See
[What I Learned](#what-i-learned) for why that wasn't always true.

## Getting started

Requires the [backend](https://github.com/yashika807/splitsmart-backend)
running locally (or deployed) first.

```bash
npm install
cp .env.example .env   # set VITE_API_URL if your backend isn't on localhost:8080
npm run dev
```

Opens on `http://localhost:5173`.

### Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8080` | Base URL of the backend API |

## What I Learned

- **Race conditions from optimistic UI updates.** Early versions patched
  local state directly after add/delete, which drifted from the server
  under rapid actions. Switched to refetching the full expense list after
  every mutation — slower, but correct. A good example of "clever" being
  the wrong tradeoff for a small app.
- **React list keys matter even when things "look" fine.** Using array
  index as a `key` worked visually until the list could reorder — switched
  every list to key by stable `expense.id`.
- **Never let API keys touch the client — the hard way.** A Gemini key got
  committed to git history early on. Fixing it meant revoking the key,
  rewriting history with a fresh orphan branch, and rebuilding the AI
  feature so parsing happens entirely on the backend. `.gitignore` only
  protects future commits, not past ones.
- **Hardcoded `localhost` URLs are a deploy trap.** Everything pointed at
  `http://localhost:8080` directly in component code, which works in dev
  and silently breaks the moment the frontend is deployed anywhere else.
  Centralized it into one `config.js` reading `VITE_API_URL`.
- **LLM output isn't guaranteed structure.** Gemini sometimes wraps JSON in
  markdown fences or returns something that isn't the expected shape at
  all. The first version of the AI-parse flow had no error handling for
  this — a bad response would throw partway through and leave the UI stuck
  on a loading spinner forever.
- **Greedy algorithms are a good fit for debt simplification.** Settling
  N people's balances doesn't need N² transactions — sorting debtors and
  creditors and greedily matching the largest amounts against each other
  gets it down to at most N-1 transactions.
- **Not every state update is safe to write as `setX(x.map(...))`.** Building
  the receipt item-assignment UI, I found a real bug: `toggleAssign` read the
  `items` array from the component closure instead of using the functional
  updater form. Two state updates landing in the same render tick — which I
  first triggered by scripting two rapid clicks in a test, but a fast
  double-tap on a mobile touchscreen could do the same — silently dropped
  one of the two updates instead of applying both. Switching every item/
  people update to `setX(prev => ...)` fixed it. It's the kind of bug that
  passes every manual test where you click slowly, and only shows up under
  real-world timing.
- **An even split isn't the only kind of split.** The existing Settlement
  page assumes everyone owes an equal share of every expense. Itemized
  receipts break that assumption on purpose — someone's fair share should
  depend on what they actually ordered, not a headcount. Rather than bend
  the existing settlement algorithm to fit two incompatible models, I kept
  the itemized math self-contained and documented the seam instead of
  hiding it.

## Roadmap

What's actually done vs. not — no aspirational checkmarks.

- [x] Expense CRUD (add / list / delete)
- [x] AI natural-language expense entry, parsed server-side
- [x] Receipt photo → itemized split with proportional tax/tip
- [x] Debt-simplification settlement view
- [x] Trip vs Family context toggle
- [x] API keys and DB credentials kept out of source control
- [ ] Itemized receipt splits feeding into the aggregate Settlement page
      (currently a separate, self-contained calculation — see
      [Receipt splitting, in detail](#receipt-splitting-in-detail))
- [ ] Backend deployed to a public host — currently local-only
- [ ] User accounts / auth — it's a single shared list, no login
- [ ] Automated tests — none on the frontend yet
- [ ] Input validation (negative/zero amounts, empty names)
- [ ] Backend CORS restricted to the real frontend origin (currently `*`)
- [ ] Custom trip/family names instead of the fixed two-tab toggle
- [ ] Mobile responsive pass
