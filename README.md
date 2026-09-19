# Radar Global Notify MCP

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
