# HYBRID_ANIMATION_PIPELINE.md

> Canonical creative-production policy for animation projects in this workspace.

## Objective

Produce richer, more fluid animation without turning every reel into a full 3D production or making Blender the render bottleneck.

The workspace uses a **hybrid shot-by-shot pipeline**:

- **ChatGPT / Codex**: creative planning, shot decomposition, code, automation and technical QA.
- **Flow / generative visual tools**: visual development and asset generation.
- **Remotion**: master timeline, 2D/2.5D animation, typography, camera logic, compositing, subtitles, audio and final assembly.
- **Blender**: selective 3D, rigged or spatial animation when it materially improves a shot.
- **GitHub**: code, manifests, prompts, configuration, version history and Actions.
- **Google Drive**: heavy images, video, textures, 3D assets, intermediate renders and final deliveries.

Remotion is the orchestration layer. Flow and Blender are suppliers of reusable visual material, not mandatory render engines for the entire video.

### Flow handoff boundary

Google Flow is currently operated manually by the user. This repository has no Flow API credentials or GitHub Actions generation step. The assistant prepares shot-specific prompts, filenames, framing and acceptance checks; the user generates and exports the chosen files, then uploads them to the project’s Google Drive folder. Verify the files before integrating them. Do not claim the Flow stage is automated or generate assets that have not been supplied.

Start with a small approved style pack. Keep factual geography, dates, official names, map labels and captions in Remotion or sourced media. Use Flow for original illustrations, consistent characters, poses, backgrounds and selected short motion plates.

---

## Core rule: choose the cheapest tool that preserves the intended quality

Before implementing a shot, classify it.

### Tier R — Remotion first

Use Remotion when the shot can be expressed convincingly with:
- SVG/vector animation;
- layered 2.5D parallax;
- camera pans, pushes and reframing;
- masks, reveals and transitions;
- text, charts, maps, routes and UI-like graphics;
- particles or procedural effects that are cheap in React/CSS/canvas;
- image layers generated elsewhere.

Prefer this tier for the majority of a social reel because it previews quickly and is easy to revise.

### Tier F — Flow image asset

Use Flow as an **illustrator / art department**, not only as a video generator.

Good uses:
- character sheets;
- consistent poses and expressions;
- backgrounds;
- props;
- establishing illustrations;
- texture plates;
- foreground/midground/background layers;
- visual references that are later rebuilt or separated;
- style exploration.

Prefer transparent or easily separable assets when possible. Keep the prompt and provenance in the project notes even when the heavy file lives in Drive.

### Tier FV — Flow short motion asset

Use generated video only when organic motion or acting would be disproportionately expensive to reproduce in code or Blender.

Examples:
- cloth/hair-like secondary motion;
- atmospheric movement;
- expressive character acting;
- complex natural motion;
- very short cinematic inserts.

Treat these clips as **shots or plates**, not as the whole editing pipeline. Remotion still owns timing, crop, transitions, overlays, captions and audio.

### Tier B — Blender selective shot

Use Blender when the shot needs one or more of:
- real spatial depth;
- a controlled 3D camera move;
- reusable rigged motion;
- object rotation or perspective that looks weak in 2D;
- deterministic animation that should remain editable;
- 3D lighting/shadows materially important to the idea.

Blender should normally render **a short asset**, not the complete reel.

---

## Blender speed policy

### Default engine

Use **EEVEE Next** by default.

Cycles is an exception. Use it only when a benchmark on the actual shot shows that the visual gain justifies the extra compute.

### Shot budget

Prefer Blender for short segments, usually a few seconds, rather than a continuous 30–90 second master scene.

A Blender segment should have a clear reason to exist. If the same result can be achieved with layered Flow art + Remotion camera/parallax, do that instead.

### Preview before final

For creative iteration:
- reduce resolution;
- reduce frame range;
- render representative frames;
- simplify samples, shadows and expensive effects;
- validate movement before full-quality output.

Only render final-quality frames after the shot is visually approved.

### Reuse motion

When a character/object will recur, build reusable animation clips such as:
- idle;
- blink;
- talking loop;
- point;
- turn;
- walk;
- enter/exit;
- camera orbit;
- object spin.

Store reusable heavy renders/assets in Drive. Store the rig/script/configuration in GitHub when practical.

### Transparent elements

When Blender is only supplying a character/object/effect, prefer an alpha-capable image sequence or another verified alpha workflow so Remotion can composite it over 2D backgrounds.

Do not render a full background in Blender when Remotion can supply it more cheaply.

### Existing Smart Render remains canonical

Final Blender work must continue to use:
- one deterministic master;
- pinned Blender version;
- EEVEE where appropriate;
- verified parallel rendering only when the scene is safe;
- baked stateful simulations;
- frame completeness checks;
- fidelity gate;
- recovery from compatible master/frame artifacts.

Do not create a second Blender render infrastructure for the hybrid workflow.

---

## Asset lifecycle

### 1. Story beat

Define what must visibly happen. Avoid designing around a tool.

### 2. Shot plan

For every meaningful beat, choose one primary source:

`remotion` | `flow-image` | `flow-video` | `blender` | `sourced-media`

A shot may combine sources, but one should be the dominant production method.

### 3. Asset brief

For every non-Remotion asset record:
- purpose;
- shot/scene ID;
- desired duration;
- framing/aspect ratio;
- style;
- transparency requirement;
- expected motion;
- source prompt or generation notes;
- whether it is reusable.

### 4. Cheap validation

Before expensive generation/render:
- use proxy images;
- rough keyframes;
- low-res Blender previews;
- temporary placeholders.

Approve timing and composition first.

### 5. Final asset

Generate/render only the asset actually needed.

### 6. Remotion integration

Remotion owns:
- final editorial timing;
- speed ramps/crops when safe;
- camera and 2.5D movement;
- transitions;
- text and subtitles;
- global effects;
- audio;
- final delivery.

### 7. QA

Verify:
- visual continuity;
- character/style consistency;
- no dead frames;
- no unintended hard cuts;
- correct aspect ratio and FPS;
- alpha edges where relevant;
- asset provenance;
- audio sync and delivery gates.

---

## Recommended Drive layout

Heavy files remain outside GitHub.

```text
Remotion Projects/<project>/
  assets/
    flow/
      images/
      video/
    blender/
      source/
      previews/
      renders/
    sourced/
    audio/
  renders/
  delivery/
```

GitHub keeps the code, prompts, scene scripts and lightweight manifests that explain how those assets are used.

---

## Character workflow

For recurring illustrated characters, prefer a reusable visual pack over generating a new unrelated image for every shot.

Useful components:
- neutral pose;
- 3/4 pose;
- profile;
- several expressions;
- blink/open eyes;
- mouth states when needed;
- hands/arms or gesture variants;
- foreground occlusion elements;
- shadow or ground contact layer.

Remotion can animate these through transforms, masks and swaps. Blender is reserved for motion that genuinely benefits from a rig or 3D perspective.

For real public figures, avoid deceptive photorealistic synthetic footage. Use clearly illustrative/stylized representations or authentic sourced media when factual authenticity matters.

---

## Decision examples

### Talking illustrated character

First choice: Flow character pack + Remotion facial/pose animation.

Use Blender only if body rotation, perspective or reusable rigged acting materially improves the result.

### Map or geopolitical explainer

Remotion for map, routes and labels.
Flow for illustrated landmarks/characters/props.
Blender for a short 3D globe, vehicle, mechanism or transition when needed.

### Dramatic object transformation

Remotion if 2D morph/mask/scale is convincing.
Blender if the transformation requires spatial rotation, lighting or camera depth.

### Atmospheric establishing shot

Flow image + Remotion layered parallax first.
Flow video if genuine organic motion is important.
Blender only if the shot needs deterministic 3D camera geometry.

---

## Production target

A typical animated social reel should not be measured by a fixed percentage, but the expected pattern is:

- Remotion remains the dominant timeline/compositing engine.
- Flow supplies much of the visual richness.
- Blender supplies a smaller number of high-value shots and reusable motion elements.

If Blender becomes responsible for most frames, re-evaluate whether the project actually needs a 3D-first pipeline.

---

## Final principle

Do not ask one tool to be the whole studio.

**Flow creates visual richness. Blender creates spatial or rigged motion where it matters. Remotion turns those pieces into a coherent, editable, synchronized film.**
