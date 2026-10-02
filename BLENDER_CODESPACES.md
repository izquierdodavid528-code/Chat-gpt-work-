# Blender en GitHub Codespaces

## Estado validado

**Validado el 2 de octubre de 2026 desde Android.**

Funcionan las dos rutas:

1. **Blender headless** para scripts, automatización y renders por CPU.
2. **Blender con interfaz gráfica en el navegador** mediante Xvfb + Openbox + x11vnc + noVNC/websockify, expuesto por el puerto 6080 de Codespaces.

## Blender headless

Ejemplos:

```bash
blender -b escena.blend -f 1
blender -b escena.blend -a
blender -b --python scripts/crear_escena.py
```

Esto permite:
- crear/modificar escenas con Python;
- importar modelos;
- configurar cámaras, luces y materiales;
- generar fotogramas o animaciones;
- automatizar tareas desde Codex.

Scripts del workspace:

```bash
bash scripts/blender/install.sh
bash scripts/blender/test-headless.sh
```

La prueba genera:

```
out/blender-test.blend
out/blender-test.png
```

## Blender gráfico desde Android

Instalar la capa gráfica:

```bash
bash scripts/blender/install-gui.sh
```

Iniciar:

```bash
bash scripts/blender/start-gui.sh
```

Abrir el puerto **6080** desde Codespaces y entrar en:

```
/vnc.html
```

Detener:

```bash
bash scripts/blender/stop-gui.sh
```

## Arquitectura validada

```
Android
  ↓
GitHub Codespaces
  ↓
Xvfb + Openbox
  ↓
x11vnc
  ↓
noVNC / websockify :6080
  ↓
Blender GUI
```

## Limitaciones

Codespaces estándar no ofrece una GPU dedicada para este flujo. El viewport usa **Mesa llvmpipe**, es decir, renderizado gráfico por CPU.

Consecuencias:
- viable para modelado ligero, revisión de escenas, cámaras, materiales y automatización;
- previews y renders simples funcionan;
- escenas pesadas, Cycles complejo, simulaciones o proyectos con mucha geometría pueden ser lentos;
- para trabajo 3D pesado conviene usar una GPU externa solo cuando sea necesario.

## Regla del workspace

Usar Blender headless para automatización repetible y el GUI remoto para revisión/interacción visual. Guardar proyectos y scripts en GitHub; evitar usar el repositorio como almacén principal de texturas, vídeos o assets pesados.
