# RESEARCH BRIEF V3 — REEL BRUNO ONU 2026

Fecha: 2026-10-02

## Discurso identificado

- Orador: Bruno Eduardo Rodríguez Parrilla.
- Cargo: Ministro de Relaciones Exteriores de Cuba.
- Evento: Debate General de la 81.ª Asamblea General de las Naciones Unidas.
- Fecha: 26 de septiembre de 2026.
- Lugar: Nueva York.
- Duración del material fuente del proyecto: ~20:17.
- El evento completo de UN Web TV localizado corresponde al Día 5 del Debate General de la 81.ª sesión.

## Fuentes consultadas

Fuentes primarias/institucionales:
- General Debate of the 81st Session / Cuba.
- UN Web TV — Day 5 General Debate, 81st Session.
- United Nations General Assembly 81st Session pages.

Fuentes secundarias usadas solo para contexto/descubrimiento:
- EFE.
- WLRN.
- AP/Al Jazeera coverage where relevant.

Notas:
- Las transcripciones automáticas o resúmenes secundarios no sustituyen la escucha del audio original para subtítulos ni selección final.
- Toda afirmación política controvertida se mantiene atribuida al orador/discurso.

## Estado del proyecto existente

V2:
- 1080×1920
- 30 fps
- H.264
- AAC 48 kHz estéreo
- duración ~38.5 s

Fuente actual:
- 640×360
- 25 fps
- AAC 44.1 kHz
- duración ~1217 s

Conclusión técnica:
la fuente 640×360 limita de forma real el close-up vertical. El V3 debe buscar una señal oficial de mayor resolución antes del master público. Si no se obtiene, usar composición inteligente en ventana y evitar oversharpening.

## Auditoría visual V2

Fortalezas:
- identidad coherente;
- subtítulos legibles;
- crop vertical funcional;
- audio continuo;
- ventana documental útil;
- branding claro;
- render técnico correcto.

Debilidades que impiden un salto de nivel:
- intro institucional demasiado larga para un feed competitivo;
- logo demasiado dominante;
- prácticamente un único fragmento continuo;
- poca progresión narrativa;
- ritmo visual uniforme;
- motion funcional pero no memorable;
- no hay diseño de datos;
- no hay contraste fuerte de silencio/sonido;
- no demuestra aún integración Blender + Remotion;
- el payoff final es débil frente al potencial del discurso.

## Mapa del discurso

Ventanas aproximadas — verificar IN/OUT sobre audio:
- ~00:50–02:00: derecho internacional / uso de la fuerza.
- ~02:00–04:00: presión económica y referencia a contenedores.
- ~06:00–08:00: impacto humano descrito por el orador.
- ~08:00–09:00: respuesta a caracterización de Cuba como “Estado fallido”.
- ~12:00–13:00: “Cuba no es una amenaza…”.
- ~13:00–16:00: disposición al diálogo / relaciones comerciales.
- ~20:00–fin: cierre / “ley de la selva”.

## Momentos candidatos

### A — Hook / cierre
“La ley de la selva no puede ser el futuro de la humanidad.”

Uso:
- cold open;
- reprise en payoff final.

Razón:
- breve;
- universal;
- visualmente compatible con una desaceleración final;
- no necesita una explicación extensa para funcionar como frase de apertura.

### B — Derecho internacional
Pasaje inicial sobre expansionismo, agresión, uso de la fuerza y soberanía.

Uso:
- capítulo 1.

Ventaja:
- permite comparar directamente V2 vs V3 porque el V2 ya usa esa zona.

### C — Dato atribuido
Referencia a más de 7.000 contenedores retenidos en puertos, según el discurso.

Uso:
- capítulo 2;
- AttributedDataCard.

Regla:
presentar siempre como cifra citada por el orador, no como verificación editorial independiente.

### D — Diálogo
Declaración de disposición a dialogar con Estados Unidos sobre diferencias bilaterales y mantener relaciones comerciales.

Uso:
- capítulo 3.

Razón:
- introduce contraste;
- evita un montaje unidimensional;
- permite bajar ritmo antes del payoff.

## Hallazgos sobre reels / short-form

### Vertical y safe zones
La guía de Meta para Reels favorece creatividades 9:16 con audio y elementos clave dentro de safe zones. Las cifras publicadas por Meta provienen principalmente de campañas/ads y no deben asumirse como garantía orgánica, pero el principio de diseño es aplicable.

Aplicación:
- 1080×1920;
- centro de interés en tercio medio/superior;
- no colocar texto crítico en el borde derecho ni en la franja inferior ocupada por UI.

### Hook
La evidencia y la práctica de short-form convergen en que los primeros segundos son críticos.

Aplicación:
- cold open con contenido, no logo;
- texto contextual mínimo;
- entregar una promesa visual/semántica desde el primer beat.

### Ritmo
Más cortes no equivalen automáticamente a mayor comprensión.

Aplicación:
- abrir rápido;
- estabilizar en el cuerpo;
- ralentizar el cierre;
- cada corte debe responder a información, gesto, énfasis o capítulo.

### Captions
Práctica dominante y requisito de accesibilidad:
- captions sincronizados;
- máximo dos líneas;
- legibilidad móvil;
- revisión manual;
- no cubrir rostro ni UI.

No usar karaoke constante como muleta de retención.

## Concepto V3 seleccionado

**EL PULSO DE LA SALA**

Forma:
microdocumental editorial premium de 58–68 s.

Arco:
cold open final → contexto → principio → consecuencia → diálogo → payoff final.

Motores:
- Blender: opener/motion pack breve.
- Remotion: master editorial, captions, mezcla y audio.
- GitHub Actions: render + QA.
- Drive: assets + delivery.

## Criterios de éxito

El V3 debe superar al V2 en:
- hook primeros 3 s;
- claridad mute;
- arco narrativo;
- variedad de escala;
- diseño de información;
- diseño sonoro;
- integración Blender;
- ritmo;
- atribución;
- QA técnico.

Después de publicar, evaluar:
- retención a 3 s;
- retención a 10 s;
- porcentaje visto;
- finalización;
- replays;
- compartidos;
- guardados.

No usar likes aislados como medida principal.
