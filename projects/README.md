# Proyectos

Cada proyecto independiente debe usar una carpeta propia:

```
projects/<project-slug>/
```

Para Remotion, partir de `projects/_template-remotion/`.

Estructura recomendada:

```
projects/<project-slug>/
  README.md
  package.json
  package-lock.json
  src/
    index.ts
    Root.tsx
    Video.tsx
  public/
  out/
```

- `src/`: código.
- `public/`: assets locales pequeños o sincronizados temporalmente desde Drive.
- `out/`: renders; no debe convertirse en almacenamiento permanente.
- `README.md`: objetivo, fuentes, composición, resolución, FPS, duración y estado del proyecto.

Los archivos grandes deben mantenerse fuera de GitHub siempre que sea posible.
