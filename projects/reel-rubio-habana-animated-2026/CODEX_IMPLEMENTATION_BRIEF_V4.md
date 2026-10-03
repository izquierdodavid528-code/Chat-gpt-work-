# CODEX IMPLEMENTATION BRIEF — V4

Actúa como ingeniero sénior de Remotion y director técnico de animación narrativa. Trabaja sobre el repositorio existente; genera código real, renderízalo y corrígelo a partir de la revisión visual.

## Estado comprobado

- Repositorio: `izquierdodavid528-code/Chat-gpt-work-`
- Proyecto: `projects/reel-rubio-habana-animated-2026`
- Rama aislada: `advanced-opening-pilot-v1`
- `main` conserva el rough cut aprobado de 60 segundos y no se toca.
- El opening avanzado actual es la composición `AdvancedOpeningPilot`, 330 frames / 11 segundos.
- Render más reciente del piloto: GitHub Actions `37092909668`; validación técnica exitosa.
- La V3 ya usa cámara compartida, parallax por profundidad, rig Bézier del petrolero, movimiento secundario y transición física de etiqueta a papel/calendario.
- El piloto sigue siendo una ilustración vectorial esquemática. La validación verde acredita render y entrega, no que la dirección artística ya sea suficientemente potente.

## Objetivo

Desarrolla el siguiente piloto narrativo a partir del puente físico ya creado: extiende la secuencia hacia la acción de febrero y haz que la escena se perciba claramente más dirigida, inmersiva y memorable que la V3. No agregues movimiento por cantidad. Cada beat debe tener una intención legible y una consecuencia visual.

La propuesta del usuario describe el tema como “Marco Rubio y la versión económica con trabuco”. Los archivos del proyecto no definen quién es esa segunda figura ni la función exacta de la sátira. Antes de asignarle identidad, parecido o papel político, consulta la descripción que dé el usuario. Si esa información no está disponible, implementa el resto del piloto y deja el personaje como rig reutilizable configurable; no inventes una persona real ni hechos.

## Dirección visual

- Mantén la animación explicativa ilustrada: objetos y personajes actúan, chocan, transforman y alteran el espacio.
- Aumenta la lectura de escala y profundidad con una cámara común, planos con oclusión real, cambios de encuadre motivados y transiciones físicas entre objetos.
- Lleva el mapa más allá del aspecto de iconos planos: mejora siluetas, jerarquía de costa y capas de agua; integra el petrolero con la ruta, la escala y el foreground.
- Conserva anticipación, impacto, follow-through y movimiento secundario subordinado a la acción principal.
- Extiende la transición al beat de febrero mediante una causa y un efecto claros; el nuevo beat debe salir del objeto/calendario del cierre actual.
- Mantén el texto en etiquetas breves y fechas necesarias.

Evita tarjetas, dashboards, diapositivas, composición de plantilla, fades genéricos, adornos sin función, sacudidas continuas y acumulación de interpolaciones que no añada actuación. No copies dibujos ni una firma visual de otro canal.

## Arquitectura y rendimiento

- Reutiliza `SceneCamera`, `DepthLayer`, las funciones de Bézier, `ParticleField` y los primitivos físicos cuando aporten valor.
- Mantén los datos estáticos de geometría y timing fuera del render por frame; centraliza los beats en una configuración legible.
- Deriva la orientación de los objetos móviles de su trayectoria; relaciona la animación secundaria con el movimiento de su objeto padre.
- Mantén partículas deterministas y solo cuando comuniquen velocidad, escala o atmósfera.
- Divide escena y rig en componentes comprensibles. Evita abstraer una biblioteca general para una sola toma.
- No agregues dependencias, Three.js, Blender, footage sintético, voz, subtítulos ni servicios pagados en este piloto.
- Mantén el render determinista a 1080×1920 y 30 fps.

## Trabajo y QA

1. Lee el código, la estrategia, las fuentes verificadas, el storyboard y el QA de V3 antes de editar.
2. Conserva la composición base y trabaja únicamente en `AdvancedOpeningPilot`.
3. Implementa el siguiente beat y ajusta la duración/configuración del piloto y su validación.
4. Valida las composiciones; usa `npm run render:pilot:validation` o la solicitud de render de GitHub Actions.
5. Revisa visualmente apertura, entrada, acción, impacto y puente final; crea una hoja de contacto y compara con V3 y con el rough cut V2.
6. Corrige cualquier encuadre cortado, objeto pequeño, lectura confusa, salto de cámara o transición que se perciba como fade.
7. Actualiza el QA visual y `PRODUCTION_STATUS.md` con el SHA/run real. Distingue siempre éxito técnico de aprobación creativa.
8. No integres el piloto en `main` ni reemplaces el MP4 aprobado sin instrucciones explícitas.

## Entrega esperada

Código modular, eficiente y editable; una composición piloto renderizada que prolongue la gramática visual hacia febrero; QA visual honesto con frames representativos; y una explicación concisa de qué mejoró, qué limitación queda y cómo ejecutar el render completo con `npm run render:pilot`.
