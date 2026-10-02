# Blender GUI en Codespaces

## Estado

**Flujo validado desde Android el 2 de octubre de 2026.**

Blender 4.0 abre correctamente dentro del navegador mediante noVNC.

## 1. Instalar la capa gráfica

```bash
git pull
bash scripts/blender/install-gui.sh
```

## 2. Iniciar Blender gráfico

```bash
bash scripts/blender/start-gui.sh
```

Codespaces detecta el puerto **6080**.

En la pestaña **Ports / Puertos**:

- abrir el puerto 6080;
- mantener visibilidad **Private**;
- si aparece un listado de directorios, entrar en `vnc.html`.

Ruta:

```
/vnc.html
```

## 3. Detener el entorno gráfico

```bash
bash scripts/blender/stop-gui.sh
```

## Componentes

- Xvfb: display virtual.
- Openbox: gestor de ventanas ligero.
- x11vnc: expone el display como VNC.
- noVNC/websockify: convierte VNC a una interfaz usable desde el navegador.
- Mesa llvmpipe: renderizado gráfico por software.

## Notas

- El viewport funciona, pero usa CPU/software rendering.
- Es adecuado para modelado ligero, revisión de escenas, cámaras, materiales y lanzamiento de renders.
- No sustituye una estación con GPU para escenas complejas.
- Los logs quedan en `.blender-gui/logs/`.
- El puerto 6080 ya está declarado en `.devcontainer/devcontainer.json`.

## Comandos rápidos

```bash
# iniciar
bash scripts/blender/start-gui.sh

# detener
bash scripts/blender/stop-gui.sh
```
