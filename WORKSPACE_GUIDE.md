# ChatGPT Work - patrón de trabajo

Este repositorio funciona como workspace central para proyectos de ChatGPT/Codex ejecutados en GitHub Codespaces desde Android.

## Arquitectura

- **GitHub**: código, historial, configuración y automatizaciones.
- **Codespaces**: entorno Linux remoto para desarrollo, Remotion, FFmpeg, Python y herramientas de línea de comandos.
- **Google Drive**: materiales grandes, fuentes y renders finales cuando el workflow de Drive esté configurado.
- **GitHub Actions**: renders reproducibles y tareas que no necesitan mantener abierto el Codespace.
- **ChatGPT/Codex**: edición, automatización y mantenimiento del código.
- **Remotion Studio**: previsualización visual e interacción con las composiciones desde el navegador.

## Regla principal

Cada trabajo nuevo debe vivir en:

```
projects/<project-slug>/
```

No mezclar dos proyectos dentro de la misma carpeta.

## Patrón Remotion

Para un proyecto nuevo:

1. Copiar `projects/_template-remotion/` a `projects/<project-slug>/`.
2. Cambiar el nombre del paquete, el ID de la composición y el nombre del archivo de salida.
3. Instalar dependencias dentro de la carpeta del proyecto:
   ```bash
   cd projects/<project-slug>
   npm install
   ```
4. Validar:
   ```bash
   npm run compositions
   ```
5. Abrir Remotion Studio:
   ```bash
   npm run start
   ```
6. Render local:
   ```bash
   npm run render
   ```

El puerto estándar del Studio es **3000** y ya está declarado en `.devcontainer/devcontainer.json`.

## Assets y archivos grandes

No usar GitHub como almacén principal de vídeos pesados.

Preferencias:
- código y assets pequeños -> GitHub;
- vídeos/fotos/audio grandes -> Drive;
- renders -> Drive y/o artefactos de GitHub Actions.

El workflow `.github/workflows/remotion-drive-render.yml` sigue el patrón:
- código: `projects/<project-slug>`;
- assets: `Drive/Remotion Projects/<project-slug>/assets`;
- salida: `Drive/Remotion Projects/<project-slug>/renders`.

## Versionado

Los proyectos Remotion deben mantener versiones fijadas. El patrón actual usa:
- Node 20.20.2
- npm 10.8.2
- Remotion 4.0.530

No actualizar dependencias de un proyecto en producción sin probar primero `npm run compositions` y `npm run render`.

## Criterio de finalización

Un proyecto se considera terminado solo cuando:
- la composición abre en Remotion Studio;
- `npm run compositions` termina sin error;
- `npm run render` termina con código 0;
- el archivo de salida existe y no está vacío;
- el resultado visual fue revisado.

## Blender

Codespaces puede ejecutar Blender en **modo headless** por línea de comandos y scripts de Python. Es útil para generar escenas, automatizar Blender y renderizar por CPU.

El editor gráfico completo de Blender dentro de Codespaces requiere una capa remota adicional (X11/VNC/noVNC) y normalmente trabaja sin GPU. Por eso se considera experimental y no debe ser la ruta principal hasta validarlo.

Véase `BLENDER_CODESPACES.md`.
