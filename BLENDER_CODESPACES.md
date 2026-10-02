# Blender en GitHub Codespaces

## Qué sí es viable

Blender puede ejecutarse en Codespaces por línea de comandos, sin interfaz gráfica:

```bash
blender -b escena.blend -f 1
blender -b escena.blend -a
```

También puede ejecutar scripts Python:

```bash
blender -b --python scripts/crear_escena.py
```

Esto permite:
- crear/modificar escenas con Python;
- importar modelos;
- configurar cámaras, luces y materiales;
- generar fotogramas o animaciones;
- automatizar tareas desde Codex.

## Limitación principal

Codespaces estándar es una máquina Linux remota orientada a desarrollo. Normalmente no dispone de GPU para Blender.

El editor gráfico completo requiere una capa de escritorio remoto, por ejemplo:
- Xvfb;
- un gestor de ventanas ligero;
- x11vnc;
- noVNC/websockify.

Eso puede exponer Blender en una pestaña del navegador, pero con renderizado por software y rendimiento limitado, especialmente desde móvil.

## Estrategia recomendada

1. Usar Codespaces + Blender headless para automatización y pruebas.
2. Renderizar previews pequeños por CPU.
3. Mantener modelos y texturas grandes en Drive u otro almacenamiento externo.
4. Para escenas pesadas, usar GPU externa solo cuando sea necesario.

No instalar una capa gráfica permanente hasta comprobar primero que Blender headless funciona correctamente en el Codespace.
