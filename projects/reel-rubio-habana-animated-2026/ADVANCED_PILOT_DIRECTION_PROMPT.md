# ADVANCED OPENING PILOT — DIRECTION PROMPT V3

Actúa como ingeniero senior de animación programática y director técnico de motion design sobre el proyecto existente `reel-rubio-habana-animated-2026`.

## Baseline protegida

No modificar ni reemplazar `src/Video.tsx` ni la composición `RubioHabanaAnimated`. La v2 aprobada sigue siendo la referencia funcional. Trabajar únicamente sobre la composición aislada `AdvancedOpeningPilot`.

## Objetivo de esta iteración

Elevar el pilot desde una demostración correcta de cámara/parallax a una pieza con mayor dirección artística y sensación de producción, sin añadir dependencias ni recurrir todavía a Blender/Three.

La mejora debe ser visible en tres dimensiones concretas:

1. **Silueta y volumen**
   - Florida, Cuba, Bahamas y el tanker deben leer como objetos ilustrados con capas, espesor, sombras internas y contornos secundarios.
   - Evitar que los elementos parezcan iconos planos pegados sobre el fondo.
   - El tanker debe tener jerarquía de casco, cubierta, tanques, puente, ventanas, sombra y wake coherente.

2. **Foreground y masking**
   - Introducir un plano cercano que ocluya parcialmente la acción y haga inequívoca la profundidad.
   - Usar bandas de agua/papel, máscaras o reveals que reaccionen de forma distinta a la cámara.
   - El foreground no puede ser decoración gratuita: debe reforzar escala, velocidad y continuidad espacial.

3. **Transición física hacia febrero**
   - La etiqueta arancelaria debe seguir comportándose como objeto con masa, cuerda y follow-through.
   - Su aproximación a cámara debe convertirse en una transición motivada.
   - Al final, la superficie roja debe transformarse físicamente en una hoja/calendario preparada para el siguiente beat.
   - No mostrar todavía la fecha `20 FEB` dentro del pilot si el timing narrativo aún no llegó a ese punto.
   - Evitar fade genérico o corte de capítulo.

## Arquitectura

Conservar y reutilizar:
- `SceneCamera`
- `DepthLayer`
- funciones de Bézier
- `ParticleField`
- `ImpactAction`
- timing centralizado

Crear nueva abstracción solo si tiene valor reutilizable. El pilot debe seguir siendo legible como escena dirigida, no convertirse en una biblioteca abstracta.

## Motion principles

- una sola intención principal por beat;
- anticipación antes de acciones fuertes;
- follow-through después del impacto;
- parent/child motion: los barriles heredan el movimiento del tanker;
- cambios de cámara suaves pero con intención editorial;
- microanimación controlada, nunca ruido permanente;
- el route draw, ship travel, oil reveal, tariff mechanism y transición final deben formar una cadena causal;
- evitar movimientos simultáneos sin jerarquía.

## Guardrails visuales y factuales

- no introducir nueva afirmación política mediante metáforas;
- no implicar prohibición absoluta;
- mantener `29 ENE` y `EO 14380` como información de enero;
- no adelantar explícitamente `20 FEB` antes de su beat;
- no usar footage político sintético;
- no agregar voz/SFX/servicios externos.

## Validación

Después de programar:
1. validar composición;
2. renderizar únicamente el pilot;
3. revisar frames tempranos, medios, impacto y transición;
4. comparar contra pilot v2 y baseline v2;
5. corregir problemas de encuadre, escala, legibilidad o profundidad;
6. documentar el QA visual.

La métrica de éxito no es el número de capas ni de interpolaciones. Es que la escena se perciba más dirigida, con mayor masa, profundidad, continuidad y transición editorial.
