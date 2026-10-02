# Blender GUI en Codespaces

Una vez validado Blender headless, puedes intentar la interfaz completa en el navegador usando noVNC.

## 1. Instalar la capa gráfica

```bash
git pull
bash scripts/blender/install-gui.sh
```

## 2. Iniciar Blender gráfico

```bash
bash scripts/blender/start-gui.sh
```

Codespaces debe detectar el puerto **6080**. Ábrelo desde la pestaña **Ports/Puertos** o desde la notificación que aparezca.

La página noVNC suele abrir en:

```
/vnc.html
```

## 3. Detener el entorno gráfico

```bash
bash scripts/blender/stop-gui.sh
```

## Notas importantes

- El renderizado usa **Mesa llvmpipe**, es decir, CPU/software rendering.
- El viewport puede sentirse lento, especialmente desde móvil.
- Para modelado ligero, revisar escenas y lanzar renders es viable.
- Para trabajo 3D pesado, simulaciones o Cycles complejos, esta no es una sustitución real de una GPU.
- Los logs quedan en `.blender-gui/logs/`.
