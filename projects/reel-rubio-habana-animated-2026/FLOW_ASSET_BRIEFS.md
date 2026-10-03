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

### After the look is approved — one acting pose and one optional motion test

Generate a single full-body pose from the character master:

> Use the supplied Rubio character image as the identity and style anchor. Show the exact same character turning toward a blank paper map and pointing once with his right hand. Preserve his face, hairstyle, suit, colors and body proportions. Give the pose a clear silhouette and a readable hand. Plain warm-ivory background; one character only. Keep the map blank for accurate map graphics to be added later. No text, logos, extra people, photorealism or watermark.

Then, only if the still pose matches, test one short image-to-video shot:

> Animate the supplied illustrated character as one uninterrupted shot in the same hand-drawn cut-paper style. The character looks toward a blank map, raises one hand to point, follows through with a small shoulder turn, then settles. Add one subtle blink, slight jacket and tie follow-through, and a gentle camera push. Keep the same face, clothes, proportions and line style in every frame. Preserve one continuous action with no scene cuts. No speech, lip-sync, sound, text, labels, logos or extra characters. Keep the map blank.

Use the shortest available duration setting. If Flow only offers a longer clip, keep only the useful moment in Remotion. Reject clips that change the face, add fingers/limbs, invent writing, or drift between styles.

## Flow steps

1. Open Google Flow and create a project named **Rubio–La Habana 2026**.
2. Generate the style frame in image mode. Save it to the project; do not generate multiple variants unless the first is unusable.
3. Use that saved image as the reference for the character master. Save both approved images in one Flow collection such as **RUBIO_STYLE_LOCK**.
4. Review the two images at phone size. Keep the image generation stage separate from video generation.
5. Once the character is consistent, generate the single pointing pose. Test a video only if the still pose is approved.
6. Download the original full-resolution PNG/JPG and any chosen MP4. Keep the prompt and the Flow asset/project name with the files. Do not use Flow’s clip sequence as the final edit; Remotion owns the 60-second timeline.
7. Upload the files to the configured Drive project folder:

   **Remotion Projects/03 - Reel Rubio Habana Animated 2026/assets/flow/images/**  
   **Remotion Projects/03 - Reel Rubio Habana Animated 2026/assets/flow/video/**

   Suggested filenames: **rubio-styleframe-v1.png**, **rubio-character-master-v1.png**, **rubio-pointing-pose-v1.png**, **rubio-pointing-test-v1.mp4**.

Google Flow’s current help describes creating videos from text, images, ingredients and frames; saving frames for reuse; editing clips; and arranging clips in Scenebuilder. Those features support this handoff, while Remotion remains the final editor. The controls and available models can vary by account and region, so use the closest image/reference controls present in the user’s Flow interface.

## Pilot shot routing

For the 8–12 second pilot, write the action and narration beats first, then route each shot:

| Beat | Primary tool | Use |
|---|---|---|
| Verified Florida–Cuba map, route, date and labels | Remotion | Keep geography and factual typography deterministic. |
| Rubio character look, expressions, selected poses and paper-art background plates | Flow images | Build one coherent visual pack and reuse the same reference. |
| One short character acting moment, only if it remains consistent | Flow video | Treat as a single insert; trim and composite in Remotion. |
| One 2–3 second camera move through layered paper geography or a transforming harbor/bank set | Blender, only if it adds clear depth | EEVEE Next, shallow extruded layers, contact shadows, restrained depth of field and a controlled camera move. Render a low-cost preview before the approved final element. |
| Timeline, camera reframing, parallax, match-cuts, labels, subtitles and final mix | Remotion | Keep the edit deterministic and synchronize it to narration. |

Do not put every shot in Blender. Build only the one hero move that gains real spatial depth; use the existing Blender Smart Render contract and do not create a duplicate renderer. Keep the 3D element short and reusable, then composite it in Remotion.

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
