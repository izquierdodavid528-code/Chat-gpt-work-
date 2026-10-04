# GENERATIVE_SCENE_WORKFLOW.md

> Canonical workflow for AI-assisted animated/editorial video projects in this workspace.
> Read together with `HYBRID_ANIMATION_PIPELINE.md` and `STUDIO_CONTEXT.md`.

## Core production model

Do not ask one tool to be the whole studio.

- **Google Vids / Gemini video tools / Flow**: primary scene-generation department for organic motion, character acting, living environments, physical transformations, bridge shots and visually rich animated plates.
- **Remotion**: director, deterministic compositor, editor and delivery engine. It owns the master timeline, factual overlays, captions, exact maps/dates/names, masks, crops, multi-layer assembly, audio, synchronization, color matching, QA and final render.
- **Blender**: exception path for deterministic 3D geometry, exact camera paths, reusable rigs, perspective, lighting or simulations that generative video cannot hold reliably.
- **GitHub**: code, prompts, manifests, status, version history and Actions.
- **Google Drive**: heavy media and deliveries.
- **ChatGPT / Codex / Work**: planning, implementation, QA, orchestration and documentation.

The creative default is now:

`story/narration -> full animatic -> short creative pilot -> targeted generated scenes -> Remotion compositing -> QA -> scale approved language to full film`

Not:

`Remotion draws everything -> add more effects -> hope it feels cinematic`.

## What Remotion should and should not do

### Remotion SHOULD own
- final timing and frame-accurate sequencing;
- narration synchronization;
- phrase captions and safe areas;
- exact dates, legal/policy names, labels and attribution;
- maps, routes and deterministic diagrams;
- crops, masks, mattes and split-screen composition;
- layering generated clips as background / foreground / inserts;
- parallax and camera treatment when driven by good visual plates;
- overlays, color matching, grain and global finishing;
- music, SFX, ducking and loudness;
- render automation and delivery QA.

### Remotion SHOULD NOT be the default organic animation engine for
- human acting;
- complex gestures;
- fluid environmental movement;
- believable physical object interaction;
- cinematic camera motion that depends on scene understanding;
- rich transformations that become SVG/card/line animation;
- long sections whose only motion is scale + fade + wipe + route stroke.

If a shot reads like a moving infographic when it should feel like a scene, reassess the tool before adding more effects.

## Shot routing

Classify every meaningful shot as one of:

- `GSCENE` — generated animated scene, usually Vids/Flow;
- `GELEMENT` — generated moving element/plate to composite;
- `R` — deterministic Remotion shot;
- `HYBRID` — generated scene/element + deterministic Remotion composition;
- `B` — Blender;
- `S` — authentic sourced media.

### Prefer GSCENE / GELEMENT when the value is
- character acting or gesture;
- living background;
- water, crowds, cloth, smoke or other organic motion;
- object handling;
- physical transformation;
- camera move through a scene;
- expressive bridge between environments;
- depth or atmosphere that is expensive to fake programmatically.

### Prefer R when the value is
- factual precision;
- typography;
- maps;
- dates;
- timelines;
- routes;
- charts;
- exact UI/data representation;
- captions;
- deterministic timing.

### Prefer B when the shot requires
- rigid geometry that must remain exact across frames;
- controlled 3D perspective;
- exact reusable camera paths;
- rigged animation;
- simulation;
- stable object continuity that generative video repeatedly breaks.

## Full animatic before polishing

Before expensive scene generation:

1. lock a source-checked narration draft;
2. obtain a real scratch voice and real duration;
3. build the complete film as an animatic;
4. verify story, timing, readability and factual scope;
5. keep missing visuals as explicit placeholders;
6. do not disguise placeholders with pseudo-final SVG scenes.

The animatic proves the movie works. It is not the visual finish.

## Creative pilot gate

Before rebuilding a full 30-90 second film, select one representative **8-15 second** fragment.

The fragment should include the hardest combination of:
- character/action;
- visual information;
- transition;
- generated footage;
- Remotion overlays/compositing.

Create a professional-motion pilot first.

### Pilot acceptance test

The new fragment must feel like a category change, not the same animatic with extra effects.

Judge:
- depth;
- internal motion;
- visual continuity;
- acting;
- camera;
- transition motivation;
- compositing richness;
- scene-to-scene physical connection;
- readability at phone size.

If the pilot does not clearly beat the baseline, stop and redesign. Do not scale a weak language to 60 seconds.

## Generative asset policy

Generation is user-operated unless an explicitly connected tool is available and authorized.

For every requested generated asset, provide:
- shot ID;
- filename;
- duration;
- aspect ratio;
- exact reference assets;
- whether this is NEW generation or EDIT of an existing clip;
- one principal action;
- desired first frame;
- desired final frame;
- continuity requirement with previous/next shot;
- forbidden text/logos/factual content;
- what Remotion adds later;
- acceptance criteria.

Generate the minimum number of assets necessary to answer a creative question.

Do not request broad batches before the pilot establishes the visual language.

## Continuity rules for generative video

### Character continuity
Lock:
- identity;
- face;
- age;
- proportions;
- hairstyle;
- wardrobe;
- palette;
- linework/material style.

Reuse approved references.

### Scene continuity
Carry at least one anchor across the cut:
- same prop;
- same furniture;
- same frame shape;
- same camera direction;
- same foreground object;
- same final/start frame;
- same spatial axis.

### Rigid-object warning

Generative video often drifts on:
- furniture partitions;
- windows/doors;
- architecture;
- machinery;
- signs;
- repeated small objects.

If exact geometry matters, do NOT keep regenerating blindly.

After one or two targeted edit attempts:
- freeze the object as a static/generated plate and animate around it in Remotion; or
- rebuild the rigid part in Blender/Remotion; or
- use the generated clip only for the organic component.

Do not hide geometry drift with wipes, crossfades or motion blur.

## Scene composition strategy

A generated clip does not need to fill the whole 1080x1920 frame.

Remotion may use it as:
- background;
- masked character plate;
- cropped insert;
- foreground element;
- animated texture;
- transition element;
- picture-in-picture scene;
- partial environment;
- matte source.

Prefer hybrid compositions when exact information and organic motion coexist.

## Factual-content rule

Never depend on generative pixels for:
- exact political/legal claims;
- dates;
- names;
- maps/borders;
- official labels;
- institutional attribution;
- captions;
- logos unless intentionally sourced and verified.

Generate blank signs/panels where exact labels will be composited later.

## Transition rule

Do not use a transition to hide incompatible scenes.

Prefer:
- object continuation;
- match shape;
- match motion;
- camera continuation;
- foreground occlusion;
- physical transformation;
- carried line/route only when motivated by the scene.

Generic wipes/fades are fallback editorial devices, not the visual language.

## Agent/quota efficiency policy

Long agent runs are justified only when they create durable output.

A Work/Codex run should normally end with one or more of:
- code change;
- rendered test;
- validated asset integration;
- documentation update;
- clear blocker requiring user action.

Avoid repeated 20-60 minute audit loops after state is already known.

### Stop conditions
Stop and ask the user only when:
- a manual generator asset is required;
- credentials/access are missing;
- a destructive action is required;
- a genuine creative fork needs approval.

Do not stop for routine implementation choices.

### When a run appears stuck
Check external evidence first:
- branch commits;
- GitHub Actions;
- artifacts;
- Drive delivery when relevant.

If durable output is already complete, stop the Work run rather than waiting indefinitely for repetitive review.

## Prompt hierarchy

Each project should have:

1. **Stable master protocol** — repository-wide rules; rarely changes.
2. **Project status** — current factual state and latest stable checkpoint.
3. **Current task prompt** — short instruction for the next gate.

Do not paste a new giant master prompt at every turn.

A phase-specific prompt never replaces the master protocol unless explicitly stated.

## Branch policy

- `main`: stable infrastructure and approved production baseline.
- `animatic/*`: timing/story/audio working branches.
- `pilot/*`: isolated creative experiments.
- Never merge a creative pilot merely because technical QA passes.
- Keep the stable master/animatic recoverable at all times.

## QA gates

Track separately:

- **TECHNICAL PASS** — codec, fps, dimensions, render, files.
- **AUDIO TECHNICAL PASS** — loudness, peak, sync, stream integrity.
- **FACTUAL PASS** — claims, attribution, dates, labels.
- **CREATIVE PASS** — movement, continuity, acting, visual language, full-speed playback.
- **FINAL PASS** — only after all required gates pass.

Frame sampling can find defects. It cannot replace watching the complete motion at normal speed.

## End-of-stage handoff

At every meaningful checkpoint update:
- `PRODUCTION_STATUS.md`;
- shot matrix if timing/routing changed;
- prompt/asset notes if manual generation is pending;
- commit and render/run IDs;
- explicit PASS/HOLD state;
- next gate.

A future chat should be able to resume from those files without reconstructing the conversation.

## Final principle

**Generate scenes where scene understanding matters. Compose deterministically where truth, timing and precision matter. Use Blender when geometry must not drift. Prove the visual language in a short pilot before scaling it.**
