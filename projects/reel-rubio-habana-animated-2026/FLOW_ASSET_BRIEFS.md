# Rubio–La Habana: Flow asset brief and production handoff

Updated: 2026-10-03  
Status: planning only. No Flow assets have been generated or approved.

## What the latest render proves

The latest visual experiment is on the isolated branch **memorias-cartoon-v6**. Its render run [37129519131](https://github.com/izquierdodavid528-code/Chat-gpt-work-/actions/runs/37129519131) completed successfully at 1080×1920, 30 fps and 60 seconds. That is a technical render check, not approval of the animation.

The inspected MP4 has no audio stream. The workflow skipped the Blender job and the upload to Drive; the video exists as a temporary GitHub Actions artifact. The project configuration also sets audio as optional. Do not call this a finished or delivered master.

A visual sample taken every five seconds, plus review of the Remotion source, shows what changed and what remains weak:

- V6 adds moving clouds, a distant Havana skyline, paper grain, parallax, facial details and a few more expressive motions.
- Most of the visual world is still flat SVG artwork drawn in code. The two main figures recur as small, simple cutouts; their motion relies heavily on repeating bobbing, stepping and mouth/blink loops.
- Several shots still read as layered infographic compositions. A moving camera and textured paper help, but do not replace distinct character acting, authored backgrounds, pose changes, or physical interaction between characters and props.
- The render contains no generated Flow artwork or motion plates and no Blender-rendered 3D shot.
- Small labels and detail should be checked at actual phone size, not judged only from a contact sheet.

Keep V6 as a useful experiment. Keep the approved 60-second baseline on main intact. The next creative test is an isolated **8–12 second opening pilot**. Only expand it after the user approves the look and motion.

## Creative target

Use the broad storytelling grammar the user likes in Memorias de Pez: explain a complex political mechanism through clear illustrated actions, maps and visual metaphors, brisk narrative rhythm, a little visual humor, and a coherent recurring cast. Make original characters, backgrounds, compositions and graphic design; do not reproduce a channel’s exact drawings, characters, signature layouts or branding.

The target is a polished editorial cartoon explainer, not photorealistic synthetic footage and not a stack of moving information cards. Marco Rubio must remain visibly illustrated. Keep verified geography, dates, official names and factual labels in Remotion or sourced assets. Flow should not invent map geometry, document text, logos or policy facts.

## Flow is currently a user-operated handoff

This repository has no Google Flow API, credentials or GitHub Actions step that generates Flow assets. Codex can prepare the shot list, prompts, filenames and acceptance criteria; the user creates and exports the assets in Google Flow. After upload, the existing Drive-to-Remotion workflow can retrieve project assets. Never claim the Flow stage is automated or that an asset exists until the file has been received and checked.

Generate only the first two stills below to establish the look. Do not produce a full batch of scenes yet.

### Image 1 — style frame

In Flow, create one portrait 9:16 image. Use the prompt below as a starting point:

> Create one original portrait 9:16 style frame for a Spanish-language illustrated explainer about Marco Rubio and U.S.–Cuba policy. Show a clearly stylized editorial caricature of Marco Rubio in a navy suit, reacting to a large folded policy paper beside a layered Havana harbor scene. The paper edge, a small tanker silhouette and one red route line form a single readable visual metaphor; keep the route abstract and leave all accurate coastlines, dates and labels for post-production. Art direction: polished hand-drawn 2D cut-paper editorial cartoon, expressive face and body language, confident dark ink outlines with slight hand-made irregularity, layered foreground/midground/background, warm paper texture, restrained navy, sea blue, coral red, mustard and olive palette, soft contact shadows and generous clean space for later captions. One dominant action and one clear focal point, legible on a phone screen. Original design; do not imitate any specific channel’s drawings, characters, layout or branding. No photorealism, no text, letters, logos, flags with altered details, watermark, UI panels or dashboard. One scene only: no collage or storyboard grid.

Save the result in the Flow project as **rubio-styleframe-v1**. If the image is promising, use it as the visual reference for the next still. If the interface offers image editing, refine this same image instead of restarting from an unrelated prompt.

### Image 2 — reusable Rubio character reference

Use the approved style frame as a reference image or ingredient, then generate one clean full-body character reference:

> Create one full-body character reference of the same Marco Rubio caricature shown in the supplied style image. Preserve his recognizable face, hair, skin tone, age, navy suit, white shirt and coral-red tie. Keep the approved hand-drawn cut-paper editorial cartoon style, line weight, colors and proportions. Three-quarter view, neutral standing pose, visible hands and shoes, clear silhouette, expressive but restrained face. Put the figure on a plain warm-ivory background with a small ground shadow so the figure can be separated later; do not fake transparency with a checkerboard. Show only one figure. No text, labels, logos, extra politicians, props, photorealism or watermark. Do not redesign the character.

Save as **rubio-character-master-v1**. This becomes the identity reference. Later poses should reuse it as an ingredient/reference, not regenerate the character from text alone.

### After the look is approved — acting pose and Flow video tests

Flow video is a primary option for motion-led shots in this project, not merely a backup to image assets. Generate short clips for the pilot and compare them with Blender only where a shot needs deterministic 3D control. Use approved character/style images as ingredients where Flow offers that control.

Generate a single full-body pose from the character master:

> Use the supplied Rubio character image as the identity and style anchor. Show the exact same character turning toward a blank paper map and pointing once with his right hand. Preserve his face, hairstyle, suit, colors and body proportions. Give the pose a clear silhouette and a readable hand. Plain warm-ivory background; one character only. Keep the map blank for accurate map graphics to be added later. No text, logos, extra people, photorealism or watermark.

Then, only if the still pose matches, test one short image-to-video shot:

> Animate the supplied illustrated character as one uninterrupted shot in the same hand-drawn cut-paper style. The character looks toward a blank map, raises one hand to point, follows through with a small shoulder turn, then settles. Add one subtle blink, slight jacket and tie follow-through, and a gentle camera push. Keep the same face, clothes, proportions and line style in every frame. Preserve one continuous action with no scene cuts. No speech, lip-sync, sound, text, labels, logos or extra characters. Keep the map blank.

Use the shortest available duration setting. If Flow only offers a longer clip, keep only the useful moment in Remotion. Reject clips that change the face, add fingers/limbs, invent writing, or drift between styles.

#### Video prompt A — Rubio acting beat (image-to-video)

Use the approved **rubio-character-master-v1** or pointing pose as the image ingredient. Choose portrait 9:16 and a short clip duration available in Flow.

> Create a 4–6 second vertical 9:16 animated shot using the supplied illustrated Marco Rubio image as the exact identity and style reference. Preserve the same recognizable face, hairstyle, age, navy suit, coral-red tie, proportions, hand-drawn ink line and cut-paper texture in every frame. One continuous medium-full shot: Rubio studies a blank policy document, looks up with a controlled skeptical expression, turns his shoulders, makes one deliberate pointing gesture toward the blank page, then lets his arm settle with natural follow-through. Add a slight camera push, subtle jacket and tie motion, and one natural blink. Keep the document completely blank for accurate graphics to be added later. Polished editorial 2D cartoon, layered paper depth, warm ivory and muted navy/coral palette. Stable composition and clean silhouette. No cuts, no extra characters, no lip-sync, no speech, no sound, no generated words, numbers, maps, logos or watermark. Do not change identity, clothing, hands or art style.

Filename: **rubio-flow-video-acting-v1.mp4**.

#### Video prompt B — Havana harbor atmosphere / establishing shot (text-to-video or image-to-video)

Use the approved style frame as a visual ingredient if available. Keep political/map facts out of the generated plate.

> Create a 5-second vertical 9:16 establishing shot in the same original hand-drawn cut-paper editorial cartoon style as the supplied reference. A stylized Havana harbor sits in layered foreground, midground and distance: calm blue water ripples, a small generic tanker moves slowly across the harbor, a few clouds drift, and warm light shifts gently across the paper-textured skyline. Make one readable, elegant camera move gliding forward and slightly sideways, with restrained parallax and soft contact shadows. Keep all buildings generic and recognizable only as an illustrated Caribbean harbor atmosphere; no exact map, coastline, named landmark, flags, signage or factual claim. No text, letters, numbers, logos, watermark, collage, cuts, photorealism or sudden object changes. Maintain stable shapes, consistent ink outlines, warm ivory paper, muted navy, sea blue and coral accents.

Filename: **habana-flow-video-establishing-v1.mp4**.

#### Video prompt C — paper mechanism transformation (image-to-video)

If the opening uses the document-to-barrier metaphor, generate this as its own short clip rather than building a Blender set solely for this transition.

> Animate the supplied hand-drawn cut-paper policy-paper illustration into one 4–6 second vertical 9:16 continuous shot. The folded blank paper opens with a crisp physical hinge, its edge rises and transforms into a simple illustrated harbor gate, then stops firmly as a small generic tanker approaches and pauses. Use a single smooth camera move and clear anticipation, unfolding action, impact and settle; layered paper depth, ink outlines, warm paper grain and soft cast shadows. Keep the paper blank, the tanker generic and the gate free of symbols. Maintain the reference art style and stable geometry. No text, map, route line, dates, logos, flags, extra characters, cuts, photorealism or watermark.

Filename: **policy-paper-flow-video-transition-v1.mp4**.

#### Efficient credit use

Use Flow’s current in-product settings/credit estimate to choose model and duration because options and costs can change. Make each test answer one visual question; reuse the approved reference ingredient, keep the action to one beat and revise one prompt dimension at a time. Keep good takes and rejects with clear filenames. The user has credits available, so use this strategy to reduce waste and rework—not to ration away Flow video. If one of these clips works, prefer it over a Blender build for that shot. Keep Blender for any remaining shot that needs exact editable 3D geometry, rigging or a controlled camera path.

## Flow steps

1. Open Google Flow and create a project named **Rubio–La Habana 2026**.
2. Generate the style frame in image mode. Save it to the project; do not generate multiple variants unless the first is unusable.
3. Use that saved image as the reference for the character master. Save both approved images in one Flow collection such as **RUBIO_STYLE_LOCK**.
4. Review both images at phone size and approve the identity/style anchor.
5. Generate the pointing pose, then create the acting video test and whichever pilot plate best serves the storyboard (harbor atmosphere or paper transformation). Flow video can be used directly where the take passes continuity checks; do not require a Blender remake.
6. Download the original full-resolution PNG/JPG and any chosen MP4. Keep the prompt and the Flow asset/project name with the files. Do not use Flow’s clip sequence as the final edit; Remotion owns the 60-second timeline.
7. Upload the files to the configured Drive project folder:

   **Remotion Projects/03 - Reel Rubio Habana Animated 2026/assets/flow/images/**  
   **Remotion Projects/03 - Reel Rubio Habana Animated 2026/assets/flow/video/**

   Suggested filenames: **rubio-styleframe-v1.png**, **rubio-character-master-v1.png**, **rubio-pointing-pose-v1.png**, **rubio-pointing-test-v1.mp4**.

Google Flow’s current help describes creating videos from text, images, ingredients and frames; saving frames for reuse; editing clips; and arranging clips in Scenebuilder. Use Flow for both still-image and video production where it serves the shot. Those features support this handoff, while Remotion remains the final timeline, compositor and editor. The controls and available models can vary by account and region, so use the closest image/reference controls present in the user’s Flow interface.

## Pilot shot routing

For the 8–12 second pilot, write the action and narration beats first, then route each shot:

| Beat | Primary tool | Use |
|---|---|---|
| Verified Florida–Cuba map, route, date and labels | Remotion | Keep geography and factual typography deterministic. |
| Rubio character look, expressions, selected poses and paper-art background plates | Flow images | Build one coherent visual pack and reuse the same reference. |
| Character acting, harbor atmosphere or a paper mechanism transition | Flow video first-class option | Generate a short reference-led clip; use it directly if identity, motion and style stay stable. Remotion trims and composites it. |
| A shot requiring exact spatial geometry, repeatable rigging or deterministic camera animation that Flow cannot hold | Blender complementary option | EEVEE Next, shallow extruded layers, contact shadows, restrained depth of field and a controlled camera move. Render a low-cost preview before the approved final element. |
| Timeline, camera reframing, parallax, match-cuts, labels, subtitles and final mix | Remotion | Keep the edit deterministic and synchronize it to narration. |

Do not default to Blender when a Flow video can achieve the approved shot faster. Use the existing Blender Smart Render contract for the shots where Blender adds necessary deterministic spatial control; do not create a duplicate renderer. Keep any 3D element short and reusable, then composite it in Remotion.

## Acceptance gate before expanding to 60 seconds

The pilot passes only after all of these are true:

- Rubio’s face, wardrobe, silhouette and proportions stay consistent across Flow stills and any clip.
- A character performs a readable action with anticipation, follow-through and a settled end pose; motion does not depend only on zoom or bobbing.
- Foreground, character, props and background occupy distinct layers, with motivated camera movement and transitions.
- The visual idea reads without small paragraphs or Flow-generated text.
- Any map, date, public office or factual claim is accurate and attributable.
- The Flow asset files exist in Drive and are traceable to their prompts.
- Any Blender segment has been visually approved in preview and completes the existing technical checks.
- The 8–12 second Remotion pilot has been watched as a moving clip at phone size. A successful GitHub render is not creative approval.

Only after that review should the opening style be carried into the rest of the 60-second reel, followed by narration timing, captions, sound design and final audio/video QA.

## Official Flow references

- Create videos: https://support.google.com/flow/answer/16353334
- Edit videos and build scenes: https://support.google.com/labs/answer/16935718
- Flow: https://labs.google/fx/tools/flow
- User-selected visual reference: https://www.youtube.com/@MemoriasDePez/videos
