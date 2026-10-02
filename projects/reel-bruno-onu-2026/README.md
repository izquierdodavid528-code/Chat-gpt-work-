# Reel Bruno ONU 2026

Proyecto vertical 9:16 del Memorial de la Denuncia.

## Drive
- Project folder: `Remotion Projects/01 - Reel Bruno ONU 2026`
- Assets: video fuente, identificador del Memorial, música V2 y efecto de transición
- References: Manual de Identidad + Estrategia Digital
- Notes: prompt maestro
- Renders: salidas finales

## Workflow universal
Ejecutar `Remotion Drive Render` con:

- `project_slug`: `reel-bruno-onu-2026`
- `repo_project_dir`: dejar vacio
- `drive_project_dir`: `01 - Reel Bruno ONU 2026`

## V2
- montaje interno con cambios de encuadre y cortes visuales
- audio de voz continuo para evitar saltos
- música instrumental original y discreta con ducking bajo la voz
- efectos de transición sutiles
- subtítulos retemporizados contra pausas reales del audio
- etiquetas documentales puntuales
- salida separada: `reel-bruno-onu-2026-v2.mp4`

## QA pendiente
No declarar final hasta revisar el MP4 renderizado a velocidad normal, comprobar sincronización de subtítulos, encuadre, balance voz/música, legibilidad y ritmo.


## V3 — visual source policy

Current master-source limitation: the project source is 640x360 / 25 fps.

Until a cleaner official source is available:
- use the source as a native 16:9 documentary window inside the 9:16 master;
- use a subdued blurred/extended background only as spatial fill;
- do not simulate 1080p close-ups by aggressive cropping;
- do not apply aggressive sharpening or AI hallucinated detail;
- keep the original watermark visible if it exists in the source rather than trying to conceal it;
- use typography, attributed data, pacing and sound design to create visual variety.

If the source is upgraded to genuine 720p/1080p or better:
- re-evaluate close/medium crops;
- keep face scale conservative;
- retain the documentary-window option for wide contextual shots.

The V3 creative direction is documented in:
- `CREATIVE_MASTER_PROMPT_V3.md`
- `RESEARCH_BRIEF_V3.md`
- `edit-plan-v3.json`

Production composition:
- `BrunoONUReelV3`

The original V2 composition remains registered for visual A/B comparison.
