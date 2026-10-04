# HYBRID_ANIMATION_PIPELINE.md

> Canonical tool-routing policy for animation projects in this workspace.
> For execution details and pilot/continuity rules, also read `GENERATIVE_SCENE_WORKFLOW.md`.

## Objective

Produce visually rich, professional animation without forcing one tool to solve every problem.

The studio uses a hybrid pipeline:

- **ChatGPT / Codex / Work** — planning, coding, orchestration, QA and documentation.
- **Google Vids / Gemini video tools / Flow** — primary generative scene and motion department for organic visual work.
- **Remotion** — master timeline, deterministic compositing, factual graphics, captions, audio, synchronization, QA and final assembly.
- **Blender** — selective deterministic 3D, rigid geometry, rigging, perspective, lighting and simulations.
- **GitHub** — source, prompts, manifests, status, history and Actions.
- **Google Drive** — heavy assets, intermediates and deliveries.

## Core rule

Choose the tool that best preserves the intended quality and editability.

Do not default to Remotion merely because a motion can be programmed.
Do not default to generative video merely because it looks richer.
Do not default to Blender merely because it is powerful.

The intended production pattern is:

`narration/story -> full animatic -> 8-15s creative pilot -> approved visual language -> targeted asset generation -> Remotion composition -> QA -> final master`

## Tool roles

### Google Vids / Gemini video tools / Flow

Use as the main scene-generation department when a shot depends on:
- character acting;
- gestures;
- organic movement;
- environmental life;
- camera motion through a scene;
- physical object interaction;
- cinematic inserts;
- transformations;
- bridge shots;
- animated backgrounds/foreground plates.

Use references aggressively for continuity.

Generated clips may be full scenes or partial plates. They do not have to fill the full frame.

Keep exact text, maps, dates, official names, attribution and captions out of generated pixels.

### Remotion

Remotion is the director/compositor/editor.

It owns:
- master timeline and frame-accurate timing;
- narration sync;
- captions;
- exact maps/routes/dates/names;
- masks, crops and mattes;
- layered composition;
- deterministic diagrams;
- color matching and global treatment;
- music/SFX/mix;
- render automation and delivery QA.

Use Remotion-native animation when deterministic graphic motion is the point.

Do not use repeated SVG cards, scale/fade, generic wipes or route strokes as substitutes for scene animation.

### Blender

Use Blender when generative video cannot reliably preserve:
- rigid geometry;
- exact architecture;
- controlled 3D perspective;
- reusable rigs;
- exact camera paths;
- lighting;
- stateful simulation.

Default to EEVEE Next.
Use short approved shots or reusable elements, not the whole reel unless the project is genuinely 3D-first.
Use the existing Smart Render infrastructure; do not invent a second Blender pipeline.

## Shot routing

For each meaningful beat choose:

`GSCENE` | `GELEMENT` | `R` | `HYBRID` | `B` | `S`

Where:
- GSCENE = generated animated scene;
- GELEMENT = generated motion plate/element;
- R = deterministic Remotion;
- HYBRID = generated visual + Remotion factual/compositing layer;
- B = Blender;
- S = authentic sourced media.

Do not route by habit. Route by the visual job.

## Asset-generation policy

Generative tools are a manual user handoff unless a connected authorized tool is available.

For every requested asset define:
- shot ID;
- filename;
- exact references;
- duration;
- first frame;
- final frame;
- single main action;
- previous/next continuity;
- forbidden elements;
- Remotion overlays to add later;
- acceptance criteria.

Generate only the minimum assets needed for the current gate.

## Continuity policy

Generated motion must be judged for:
- character identity;
- wardrobe;
- camera axis;
- prop stability;
- furniture/architecture stability;
- start/end-frame compatibility;
- object persistence;
- absence of ghosting/morph drift.

Rigid repeated structures are a known generative weakness.
If targeted editing cannot stabilize them quickly, move the rigid component to Blender/Remotion instead of consuming repeated generations.

## Pilot-first policy

Do not visually rebuild 60 seconds before the language is proven.

Pick 8-15 representative seconds and make them excellent.

Only scale the approach when:
- full-speed playback is clearly stronger than the baseline;
- continuity works;
- the generated/Remotion division feels natural;
- the user approves the language.

Technical PASS alone does not authorize scale-up.

## Audio and captions

Narration governs the timeline.

Use a real scratch/final voice before detailed timing.
Captions are phrase-level, safe-area aware and deterministic.
Music/SFX support visible actions and never bury narration.

## QA

Separate:
- TECHNICAL;
- AUDIO TECHNICAL;
- FACTUAL;
- CREATIVE;
- FINAL.

A render that compiles is not a creative pass.
Frame checks do not replace full-speed review.

## Storage

GitHub:
- code;
- prompts;
- lightweight manifests;
- config;
- status;
- QA notes.

Drive:
- generated stills/video;
- audio;
- Blender assets/renders;
- final deliveries.

## Final principle

**Generative tools create convincing scenes. Remotion directs and assembles the film. Blender protects deterministic 3D/geometry when generative motion drifts.**
