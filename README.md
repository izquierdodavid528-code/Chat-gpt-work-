# ChatGPT Work Multimedia Studio

For any new ChatGPT/Codex session working on multimedia projects, **read [STUDIO_CONTEXT.md](STUDIO_CONTEXT.md) first**.

The reusable production architecture, Blender render contract, Drive/GitHub division of responsibilities, and canonical workflows are documented in:
- `STUDIO_CONTEXT.md` — concise cross-chat state and operating rules.
- `WORKSPACE_GUIDE.md` — detailed workspace documentation.
- `.github/workflows/blender-smart-render.yml` — canonical audited Blender final render.
- `.github/workflows/blender-workspace-selftest.yml` — infrastructure regression test.

---

## Radar Global Notify MCP

Servidor MCP remoto para enviar notificaciones push desde Workspace Agents de ChatGPT a Android mediante ntfy.

## Variables secretas requeridas en Cloudflare

- `NTFY_TOPIC`: el tema privado de ntfy del usuario.
- `MCP_TOKEN`: una clave larga y aleatoria usada como Bearer token.

No guardes ninguno de esos secretos en GitHub.

## Endpoint

Después del despliegue:

```
https://radar-global-notify.<tu-subdominio>.workers.dev/mcp
```

En ChatGPT, conecta el MCP con **Token de acceso o clave de API** y esquema **Portador (Bearer)**.

## Herramienta

`send_notification(title, message)`
