# NARRATION V3 — source-checked scratch script with measured neural voice

Checked against the primary sources below on 2026-10-03. The script remains 120 words and unchanged. Edge TTS 7.2.8 neural scratch measured 56.640 s at the original MP3 and WAV master; the Remotion MP3 is 56.664 s. No rate acceleration was used. Twelve shot boundaries and phrase captions now follow Edge word timings.

## Scratch script

### 00:00–00:03.4 — Hook
Washington amplió la presión sobre La Habana.

### 00:03.4–00:17.7 — January and February
El 29 de enero se abrió la vía para posibles aranceles a países que suministraran petróleo a Cuba. El 20 de febrero se retiraron esos aranceles; la emergencia y otras medidas siguieron vigentes.

### 00:17.7–00:30.2 — May and Rubio's role
En mayo, la orden habilitó sanciones por vínculos con ciertos sectores o conductas y encargó su aplicación a Estado y Tesoro. Rubio, secretario de Estado, no la firmó.

### 00:30.2–00:37.0 — OFAC designations
En septiembre, OFAC añadió varias entidades a su lista, incluido el Banco Exterior de Cuba.

### 00:37.0–00:50.3 — Finance and travel
Ese mes cambió la licencia general para ciertas transferencias U-turn. También se eliminó la autorización de reuniones profesionales y se acotaron viajes educativos, con excepciones transitorias.

### 00:50.3–01:00 — Attributed close
Washington invoca seguridad nacional; el MINREX denuncia un recrudecimiento del bloqueo.

## Source-check decisions

- EO 14380 created a conditional process for possible extra duties; it did not automatically tariff every oil supplier.
- EO 14389 ended IEEPA duties under listed orders including EO 14380, while other actions and the national emergency remained.
- EO 14404 authorized sanctions under stated criteria and delegated implementation to State and Treasury; it did not automatically block everyone in listed sectors. Rubio was Secretary of State, not the signer.
- OFAC added Banco Exterior de Cuba among multiple entities on 2026-09-03.
- The 2026-09-30 amendments removed the defined U-turn general license, eliminated the professional meetings/conferences authorization, and narrowed educational authorizations. Specific transition/grandfathering terms belong in precise Remotion captions, not compressed narration.
- Attribute both viewpoints: White House states its national-security rationale; MINREX calls the measures a worsening of the blockade.

## Primary sources

- EO 14380 (White House, 2026-01-29): https://www.whitehouse.gov/presidential-actions/2026/01/addressing-threats-to-the-united-states-by-the-government-of-cuba/
- EO 14389 (White House, 2026-02-20): https://www.whitehouse.gov/presidential-actions/2026/02/ending-certain-tariff-actions/
- EO 14404 (White House, 2026-05-01): https://www.whitehouse.gov/presidential-actions/2026/05/imposing-sanctions-on-those-responsible-for-repression-in-cuba-and-for-threats-to-united-states-national-security-and-foreign-policy/
- OFAC designations (2026-09-03): https://ofac.treasury.gov/recent-actions/20260903
- OFAC FAQs 1272–1275 (2026-09-29): https://ofac.treasury.gov/faqs/added/2026-09-29
- FAQ 1272: https://ofac.treasury.gov/faqs/1272
- FAQ 1274: https://ofac.treasury.gov/faqs/1274
- FAQ 1275: https://ofac.treasury.gov/faqs/1275
- MINREX statement carried by Granma (2026-05-07): https://www.granma.cu/cuba/2026-05-07/la-orden-ejecutiva-del-primero-de-mayo-y-las-medidas-de-bloqueo-anunciadas-hoy-incrementan-el-dano-a-la-poblacion-cubana-y-refuerzan-la-amenaza-de-agresion-07-05-2026-16-05-55

## Voice tests and measured timing

Installed Edge TTS 7.2.8 in an isolated work environment. Queried edge-tts --list-voices live; the three sample voices below were present. The identical 30-word excerpt was used for all samples.

| Voice | Measured sample | Notes |
|---|---:|---|
| es-US-AlonsoNeural | 12.624 s | Selected scratch voice; longest measured reading, leaving the most room for breaths and editorial holds. |
| es-MX-JorgeNeural | 11.976 s | Comparison sample. |
| es-ES-AlvaroNeural | 10.944 s | Comparison sample. |

The selected take is a neutral Spanish neural voice at its default rate. It is not a celebrity imitation, trailer read, or political impersonation. Selection is provisional for animatic timing; listen to the linked samples before treating the voice as creatively approved.

Full scratch timing: original Edge MP3 56.640 s; measured master WAV 56.640 s; Remotion MP3 56.664 s. The last spoken word ends at 55.737 s. No text edits or speed changes were made.

The source MP3 is preserved unchanged. The WAV master is mono PCM 24-bit/48 kHz; conservative processing used a 45 Hz high-pass, 1.5:1 light compression, and -18 LUFS / -2 dBTP normalization. No reverb, radio effect, clipping, or aggressive de-essing. The Remotion MP3 is 48 kHz mono at 192 kb/s. Word boundaries were captured from Edge TTS and used for the phrase SRT and the 12 cut points in SHOT_MATRIX.md.

Pronunciation audit notes: La Habana, Rubio, OFAC, Banco Exterior de Cuba, U-turn, and MINREX are in the spoken draft. IEEPA is intentionally not spoken in this short script; the acronym belongs in exact on-screen explanatory labels/captions. Verify the audible rendering of OFAC, U-turn, and MINREX during the voice listen-through before final voice approval.

## Primary audio assets

- Original: assets/audio/narration-scratch-v1-original.mp3
- Master WAV: assets/audio/narration-scratch-v1-master.wav
- Remotion master MP3: assets/audio/narration-scratch-v1-master.mp3
- Phrase captions: assets/audio/narration-scratch-v1-captions.srt
- Identical voice samples: assets/audio/voice-tests/
