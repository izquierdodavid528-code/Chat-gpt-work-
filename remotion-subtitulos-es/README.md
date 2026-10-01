# Remotion – subtítulos en español

Proyecto de prueba para un flujo **Remotion-only**.

## Regla del flujo

Este proyecto debe renderizarse con Remotion. Si falta un asset, una dependencia o el entorno no puede ejecutar Remotion, el proceso debe fallar explícitamente. **No se permite sustituir el render por FFmpeg u otro motor y presentarlo como equivalente.**

## Especificaciones

- Resolución: 640×360
- FPS: 60
- Duración del master: 127.658667 s
- Composición: `SpanishSubtitles`
- Duración Remotion: 7660 frames (~127.67 s)
- Video base esperado: `public/input.mp4`
- Salida: `out/subtitulos-es.mp4`

## Ejecutar localmente

```bash
npm install
npm run compositions
npm run start
```

## Renderizar con Remotion

```bash
npm run render
```

El comando usa `npx remotion render` a través del binario instalado en `node_modules`.

## Render en GitHub Actions

El workflow **Remotion render** puede ejecutarse manualmente desde la pestaña **Actions**.

Puede obtener el video de dos formas:

1. Si `public/input.mp4` está dentro del proyecto, lo usa directamente.
2. Si no está, puedes indicar una URL descargable en el campo `video_url`.

Si no existe el MP4 y tampoco se proporciona una URL, el workflow falla antes de renderizar.

Cuando Remotion termina correctamente, GitHub publica el MP4 como artefacto `remotion-subtitulos-es`.

## Política de validación

Un resultado se considera válido solo cuando:

- `npm run compositions` reconoce `SpanishSubtitles`;
- el asset de video existe;
- `npm run render` termina con código 0;
- `out/subtitulos-es.mp4` existe y no está vacío;
- GitHub Actions puede subir ese archivo como artefacto.

El archivo `subtitulos_es.ass` se conserva únicamente como referencia editable; el render principal se realiza desde el componente React/Remotion.
