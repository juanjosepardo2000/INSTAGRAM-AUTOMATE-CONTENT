# carousel

Generate carousel copy and render a ready-to-use JSON spec + captions using the Aura design system.

## Trigger

Use this skill when the user asks to create a carousel, reel copy, slide deck, or Instagram/LinkedIn content series.

## Inputs

Collect these before proceeding. If the user passed arguments, parse them. If any are missing, ask for all of them in a single message — never ask one at a time.

- **topic** — the angle or concept for this carousel
- **icp** — one sentence describing the target audience
- **offer** — what the CTA leads to (name, price, URL, or comment keyword)
- **voice** — 2-3 adjectives describing tone (e.g. "direct, warm, builder-focused")

---

## Execution

Work through every step in order. Show reasoning inline — do not skip or summarize steps.

---

### STEP 1 — EXTRACT THE TENSION

From the topic, identify and output:

- **Core frustration**: what problem or gap does this hit?
- **Proof point**: a specific result that anchors the value. Must include a number (time saved, money earned, output count).
- **Trigger moment** — label the one that fits:
  - A) Someone told them they need a skill they don't have
  - B) They're doing something by hand that a tool could do
  - C) They saw someone else get a result and thought "I could never do that"

---

### STEP 2 — HOOK SELECTION

Write 3 hook options. For each, score against all 3 gates:

| Gate | Question |
|------|----------|
| G1 | Would someone with zero technical background instantly understand the value? |
| G2 | Is a specific number present (time, money, output count)? |
| G3 | Does missing out feel costly, or does the outcome feel achievable? |

Mark each gate **PASS** or **FAIL**. Only hooks that pass all 3 are eligible.

Auto-select the strongest passing hook. If none pass all 3, rewrite until one does — do not proceed until a hook passes.

The selected hook must be splittable into 2-3 short segments (~12 chars each) for the cover slide layout.

---

### STEP 3 — FORMAT SELECTION

Pick exactly one format based on topic + hook:

| Format | When to use |
|--------|-------------|
| **TUTORIAL** | Step-by-step how-to. Hook is instructional. |
| **MEMBER WIN** | Transformation story. Hook names a before/after result. |
| **LIST** | Hook contains a number. Topic is enumerable. |
| **TOOL DROP** | New tool, feature, or release. Hook announces a new capability. |

State the chosen format and one-line reason.

---

### STEP 4 — WRITE SLIDE COPY

Follow the narrative arc: **Hook → Pain → Steps/Items → Proof → Bridge → CTA**

#### Copy rules — enforce on every single slide:

- Headlines: **7 words max** on all non-cover slides
- Body: **1 sentence max**. If 2 are needed, the headline is doing too little.
- **One idea per slide** — never two claims
- **Plain English always** — no jargon, no unexplained acronyms
- **Specific numbers mandatory** on any result-claim slide
- **Present tense** for outcomes ("are building," "have shipped")
- **Never use em dashes**
- **Slide 2 must be self-contained** — no references to a community, group, or "inside" that a cold viewer wouldn't understand

#### Slide jobs by format

**TUTORIAL format (8 slides):**
1. Hook. Cover only. No body.
2. The specific end result. One sentence making it real.
3. STEP 1. 4-word headline. Terminal or action word. One sentence payoff.
4. STEP 2. Same structure.
5. STEP 3. Same structure.
6. Proof. Specific number as headline. One sentence outcome.
7. Bridge. Urgency or identity. No price. Member/community count only.
8. CTA. Fixed: comment keyword to get the offer.

**LIST format (8+ slides):**
1. Hook. Cover only. No body.
2. Why this list matters now. One sentence, no references.
3-N. One item per slide. Short headline + one sentence.
N+1. Proof. Number as headline.
N+2. Bridge. Urgency or identity.
N+3. CTA. Comment keyword.

**MEMBER WIN format (8 slides):**
1. Hook. Cover only. No body.
2. The before state. Specific and relatable.
3. The moment of change. What they did or decided.
4. First result. Number required.
5. What changed beyond the number.
6. The method or system behind it.
7. Bridge. How many others are doing this.
8. CTA. Comment keyword.

**TOOL DROP format (7 slides):**
1. Hook. Cover only. No body.
2. What problem this tool solves. One sentence.
3. Key feature 1. Headline + one sentence.
4. Key feature 2. Same.
5. Key feature 3. Same.
6. Proof or use case. Number required.
7. CTA. Where to get it or learn more.

---

### STEP 5 — OUTPUT JSON SPEC

After writing copy, output a complete JSON spec using this exact schema:

```json
{
  "meta": {
    "topic": "",
    "format": "",
    "hook": "",
    "icp": "",
    "voice": "",
    "offer": "",
    "generated_at": ""
  },
  "design": {
    "system": "aura",
    "palette": {
      "background": "#faf6f1",
      "ink": "#2f2c49",
      "ink_soft": "#6f6a89",
      "accent_primary": "#9d7cc4",
      "accent_secondary": "#f3d49a",
      "glow": "#c8f0d8",
      "surface_veil": "rgba(255,252,248,0.82)"
    },
    "typography": {
      "display": "Fraunces",
      "body": "Hanken Grotesk"
    },
    "cover_gradient": "linear-gradient(180deg,#8fcddf 0%,#a6ddd5 16%,#f3d49a 36%,#c6d1c3 52%,#fcca8b 70%,#fdb881 86%,#b1cda5 100%)",
    "slide_aspect_ratio": "9:16",
    "radius": "22px",
    "glow_shadow": "0 12px 48px -8px rgba(247,159,147,0.28)"
  },
  "slides": [
    {
      "index": 1,
      "type": "cover",
      "layout": "center_stack",
      "background": "grad_aura",
      "headline_segments": [],
      "body": null,
      "badge": null,
      "image_prompt": null
    }
  ],
  "captions": {
    "primary": "",
    "hooks": [],
    "hashtags": []
  }
}
```

#### Slide types and their fields:

- **cover** — `headline_segments` (array of 2-3 short strings), no body
- **pain** — `headline` (string), `body` (string)
- **step** — `headline` (string), `step_number` (int), `body` (string), `badge` (e.g. "Step 1")
- **list_item** — `headline` (string), `item_number` (int), `body` (string)
- **proof** — `headline` (string, the number), `body` (string)
- **bridge** — `headline` (string), `body` (string)
- **cta** — `headline` (string), `keyword` (string), `offer` (string), `body` (string)

#### image_prompt field:

For slides that benefit from a visual (cover, proof, bridge), populate `image_prompt` with a prompt using the Aura visual language:

- Pure atmosphere, no text, no UI elements, no labels
- Aura palette (sky blue, mint, gold, peach, coral, rose, lavender, indigo pastels)
- Glowing figure or abstract scene — no hard shadows, everything emits light
- Subtle film grain, soft gradients, 9:16 format
- Adapt scene to slide content — cover gets the full lotus/aura scene, proof gets an orb or radiant geometry, bridge gets a warm atmospheric landscape

#### Image generation — automatic provider fallback

After outputting the JSON spec, generate each image automatically — never stop and ask, just execute:

1. Check Higgsfield credits via the `mcp__balance` tool
2. **If credits > 0** → use `mcp__generate_image` with `model: nano_banana_pro`, `aspect_ratio: 9:16`, `resolution: 2k` for each slide that has an `image_prompt`
3. **If credits = 0** → run `python3 scripts/generate_image.py --prompt "<image_prompt>" --output images/slide_<N>.png --provider pollinations` for each slide that has an `image_prompt`

Create the `images/` directory if it does not exist. Report the provider used and the output path or URL for each image.

---

### STEP 6 — CAPTIONS

Write three caption variants for the primary post:

- **Hook caption** — opens with the hook, 3-4 lines, ends with "Comment [KEYWORD] to get [OFFER]"
- **Story caption** — narrative opening, 4-5 lines, same CTA
- **Short caption** — 1-2 punchy lines + CTA

Add 10-15 relevant hashtags as an array. No banned/overused tags (#love, #instagood, etc.).

---

## Output format

Deliver in this order:

1. Step 1 analysis (tension, proof point, trigger)
2. Step 2 hook scoring table + selected hook
3. Step 3 format decision
4. Step 4 slide copy (readable format, numbered)
5. Step 5 full JSON spec in a code block
6. Step 6 captions in a code block

---

## Design system reference

The Aura design system is defined in `aura-design-system.md` at the repo root. Key tokens:

```
--grad-aura: linear-gradient(180deg,#8fcddf 0%,#a6ddd5 16%,#f3d49a 36%,#c6d1c3 52%,#fcca8b 70%,#fdb881 86%,#b1cda5 100%)
--grad-dawn: radial-gradient(120% 90% at 50% 35%,#ffd9c6 0%,#fed0bf 45%,#fb9095 100%)
--grad-figure: linear-gradient(180deg,#9d7cc4 0%,#7477c3 55%,#6797bc 100%)
--mist: #faf6f1
--ink: #2f2c49
--ink-soft: #6f6a89
--glow-mint: #c8f0d8
--radius-md: 22px
--radius-pill: 999px
--font-display: Fraunces
--font-body: Hanken Grotesk
```

Visual rules:
- Light instead of shadow — depth from glowing halos, not dark drop shadows
- No flat backgrounds — always a gradient field
- Soft geometry — generous radius, rounded shapes
- Film grain overlay at 6% opacity, mix-blend-mode overlay
- Breathing rhythm — slow, looping, sine-curve motion
