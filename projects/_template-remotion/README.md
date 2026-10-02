# Template Remotion

Plantilla base para nuevos proyectos del workspace.

## Crear un proyecto

1. Duplica esta carpeta con un nuevo slug dentro de `projects/`.
2. Cambia:
   - `name` en `package.json`;
   - `TemplateVideo` por el ID real de la composición;
   - resolución, FPS y duración en `src/Root.tsx`;
   - nombre del archivo de salida en el script `render`.
3. Ejecuta:
   ```bash
   npm install
   npm run compositions
   npm run start
   ```
4. Cuando esté listo:
   ```bash
   npm run render
   ```

No guardar vídeos pesados en el repositorio. Usar Drive para assets y renders cuando corresponda.
