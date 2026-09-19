import { McpServer } from "@modelcontextprotocol/server";
import { createMcpHandler } from "agents/mcp/server";
import { z } from "zod";

function buildServer(env) {
  const server = new McpServer({
    name: "Radar Global Notify",
    version: "1.1.0",
  });

  server.registerTool(
    "send_notification",
    {
      description:
        "Envía una notificación al teléfono del usuario mediante Telegram. Úsala para avisar cuando un briefing, informe o automatización importante haya terminado.",
      inputSchema: {
        title: z.string().min(1).max(120),
        message: z.string().min(1).max(1000),
      },
    },
    async ({ title, message }) => {
      if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: "Faltan TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID en Cloudflare.",
            },
          ],
        };
      }

      const response = await fetch(
        `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            chat_id: env.TELEGRAM_CHAT_ID,
            text: `${title}\n\n${message}`,
          }),
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.ok) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `No se pudo enviar la notificación por Telegram (HTTP ${response.status}).`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "Notificación enviada correctamente por Telegram.",
          },
        ],
      };
    },
  );

  return server;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return Response.json({
        ok: true,
        service: "Radar Global Notify MCP",
        delivery: "telegram",
        mcp: "/mcp",
      });
    }

    if (url.pathname === "/mcp") {
      if (!env.MCP_TOKEN) {
        return new Response("MCP_TOKEN no está configurado", { status: 503 });
      }

      const auth = request.headers.get("Authorization");
      if (auth !== `Bearer ${env.MCP_TOKEN}`) {
        return new Response("Unauthorized", {
          status: 401,
          headers: {
            "WWW-Authenticate": "Bearer",
          },
        });
      }

      return createMcpHandler(() => buildServer(env))(request, env, ctx);
    }

    return new Response("Not found", { status: 404 });
  },
};
