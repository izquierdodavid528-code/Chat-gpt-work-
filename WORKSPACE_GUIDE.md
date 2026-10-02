# ChatGPT Work - workspace automatizado

Este repositorio funciona como workspace central para proyectos multimedia creados desde ChatGPT/Codex y trabajados desde Android mediante GitHub Codespaces.

## Arquitectura

- **GitHub**: codigo, historial, configuracion y automatizaciones.
- **Codespaces / VS Code Web**: entorno Linux remoto interactivo.
- **Remotion Studio**: previsualizacion visual de composiciones en el puerto 3000.
- **Blender GUI**: interfaz completa de Blender via noVNC en el puerto 6080.
- **Google Drive**: assets grandes y renders.
- **GitHub Actions**: renders reproducibles y tareas autonomas.
- **ChatGPT/Codex**: planificacion, edicion, codigo y mantenimiento.

## Arranque automatico de Codespaces

Al crear o reconstruir el Codespace, `.devcontainer/devcontainer.json` ejecuta:

```bash
bash scripts/workspace/bootstrap.sh
```

El bootstrap:
- prepara todos los proyectos Remotion;
- usa `npm ci` cuando hay lockfile;
- instala rclone 1.75.1;
- puede restaurar rclone automaticamente si existe el secreto de Codespaces `RCLONE_CONFIG_B64`;
- instala Blender si falta;
- instala la capa grafica Xvfb/Openbox/x11vnc/noVNC si falta.

## Crear proyectos

### Remotion

```bash
npm run project:new -- mi-proyecto
```

Opcionalmente indicar carpeta de Drive:

```bash
npm run project:new -- mi-proyecto "02 - Mi proyecto"
```

Esto copia `projects/_template-remotion`, actualiza package.json, package-lock.json y project.config.json e instala dependencias reproducibles.

### Blender

```bash
npm run blender:new -- mi-escena
```

## Abrir herramientas visuales

### Remotion Studio

```bash
npm run studio -- mi-proyecto
```

Abrir el puerto 3000 de Codespaces.

### Blender

```bash
npm run blender:open -- mi-escena
```

Si la escena aun no tiene archivo .blend, se genera primero en modo headless. Luego se abre Blender en el puerto 6080 mediante noVNC.

Mantener el puerto 6080 como **Private**.

## Drive desde Codespaces

Descargar assets:

```bash
npm run drive:pull -- mi-proyecto
```

Subir renders locales:

```bash
npm run drive:push-render -- mi-proyecto
```

Para que esto funcione sin autenticacion manual en cada Codespace, crear un secreto de Codespaces llamado `RCLONE_CONFIG_B64` con el mismo contenido seguro usado por el workflow. Nunca guardar ese valor en archivos del repositorio.

## Renders automaticos

### Remotion

Workflow: `Remotion Drive Render`

Con proyectos que incluyen `project.config.json`, normalmente basta indicar:

```text
project_slug: mi-proyecto
repo_project_dir: vacio
drive_project_dir: vacio
```

El workflow resuelve la carpeta de Drive desde los metadatos del proyecto.

Entorno fijado:
- Ubuntu 24.04
- Node 20.20.2
- npm 10.8.2
- rclone 1.75.1
- Remotion 4.0.530
- Chrome Headless Shell 149.0.7790.0
- dependencias npm mediante package-lock.json + npm ci

Cada render guarda `render-environment.txt`.

### Blender

Workflow: `Blender Drive Render`

Toma el proyecto, descarga sus assets desde Drive, ejecuta Blender en headless, sube `out/` a Drive y conserva artifact de GitHub Actions.


## Progreso de render de Blender

Todos los renders nuevos de Blender pasan por `scripts/blender/render-with-progress.py`.

Durante una animacion se genera:

```text
<proyecto>/out/render-progress.json
```

El archivo informa:
- estado: starting, rendering, completed, cancelled o failed;
- frame actual;
- frames totales;
- porcentaje completado;
- tiempo transcurrido;
- ETA estimada;
- fecha/hora de la ultima actualizacion.

En GitHub Actions, el workflow publica ese JSON en Drive aproximadamente cada 30 segundos:

```text
Remotion Projects/<carpeta-del-proyecto>/renders/render-progress.json
```

Esto permite consultar el avance desde ChatGPT sin esperar a que termine el job. La estimacion restante es orientativa porque distintos frames pueden tardar tiempos diferentes.

Nota: los jobs que ya estaban ejecutandose antes de incorporar este sistema no pueden mostrar porcentaje retroactivamente. Solo aplica a renders iniciados con la version nueva del workspace.

## Crear proyectos desde GitHub sin terminal

Workflow: `Create Workspace Project`

Inputs:
- project_slug
- project_type: remotion o blender
- drive_project_dir opcional

El workflow crea la estructura, actualiza metadatos y hace commit automaticamente.

## Estructura

```text
projects/
  _template-remotion/
  _template-blender/
  <proyecto>/
    project.config.json
    ...
```

Los archivos grandes no deben vivir en GitHub.

- codigo y configuracion -> GitHub
- assets grandes -> Google Drive
- previews locales -> Codespaces
- renders definitivos -> Drive + artifact Actions

## Comandos principales

```bash
npm run workspace:setup
npm run project:new -- slug
npm run studio -- slug
npm run drive:pull -- slug
npm run drive:push-render -- slug

npm run blender:new -- slug
npm run blender:render -- slug
npm run blender:open -- slug
npm run blender:start
npm run blender:stop
npm run blender:test
```

## Criterio de finalizacion

Un proyecto no se considera terminado hasta que:
- abre correctamente en su herramienta visual;
- compila o genera escena sin errores;
- el render termina con codigo 0;
- el archivo de salida existe;
- el entorno de render queda registrado;
- el resultado fue revisado visualmente;
- el render final esta respaldado en Drive y/o GitHub Actions.
