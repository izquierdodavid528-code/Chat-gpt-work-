# ANIMATION STRATEGY — Rubio / La Habana 2026

## Creative reset

This project replaces the cancelled slide-style reel.

Target language: original illustrated explainer animation. The reference is the broad grammar of modern animated geopolitical explainers: moving maps, drawn objects, visual metaphors, character/object acting, camera moves and transformation-based transitions. Do not copy another channel's exact drawings, palette, characters or signature look.

## Non-negotiable rule

Every important narration beat must cause a visible action.

Bad:
- a card appears saying "FINANCE";
- a paragraph fades in;
- a static portrait sits inside a box.

Good:
- money follows a route through banks and hits a barrier;
- a customs gate drops across a trade route;
- a calendar flips and physically changes the mechanism;
- an OFAC stamp marks an illustrated bank;
- a conference badge loses its authorization tag;
- the next scene grows out of an object in the previous scene.

## Visual grammar

- 2D vector / SVG as primary engine.
- Warm paper background with subtle texture.
- Thick, slightly imperfect dark outlines.
- Muted navy, coral red, mustard, warm ivory and sea blue.
- Objects have simple squash, overshoot and secondary motion.
- Camera pushes, pans and match-cuts; avoid hard slide-to-slide cuts.
- Text limited to dates, short labels and essential names.
- No dashboard layouts.
- No fake documentary footage.
- No synthetic photorealistic political figures.
- Political figures appear only as clearly illustrated/graphic representations or authentic sourced media.

## Pacing

- Visual event every 0.7–1.5 seconds.
- One main visual idea at a time.
- A scene can contain multiple beats but should never become a static information panel.
- Use visual callbacks: red barrier, paper documents, stamped icons, routes.

## Production architecture

This project now follows the repository-wide hybrid animation policy in `HYBRID_ANIMATION_PIPELINE.md`.

Remotion:
- master timeline and scene timing;
- 2D/2.5D camera, parallax and compositing;
- procedural maps/routes;
- masks, transitions and subtitles;
- final assembly and audio.

Flow / generative visual tools:
- character pose/expression packs;
- illustrated backgrounds and props;
- foreground/midground/background plates;
- selective short motion assets only when organic acting/movement would be expensive to recreate.

Blender:
- selective short shots or reusable motion elements where real depth, perspective, rigging or camera movement materially improves the story;
- default to EEVEE Next;
- preview cheaply before final rendering;
- use the existing Smart Render contract for final Blender assets;
- never become a dependency for the entire reel unless the creative direction is explicitly changed to 3D-first.

External/authentic assets:
- use when authenticity matters;
- licensing/provenance documented.

### Shot-routing rule

For future upgrades, classify every shot as `R`, `F`, `FV`, `B` or `S` before implementation. If the current Remotion-native version feels visually basic, first diagnose whether the limitation is the asset, pose, timing, layering, camera or transition. Escalate to Flow or Blender only for the specific weakness instead of rebuilding the entire reel.

## Factual posture

Neutral explanatory treatment.
- U.S. government rationales are attributed.
- Cuban government characterizations are attributed.
- Presidential orders are not attributed to Marco Rubio as signer.
- Do not imply a mechanism remained unchanged after it was amended or withdrawn.
