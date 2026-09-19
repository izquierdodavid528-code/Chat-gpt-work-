import { McpServer } from "@modelcontextprotocol/server";
import { createMcpHandler } from "agents/mcp/server";
import { z } from "zod";

function buildServer(env) {
  const server = new McpServer({
    name: "Radar Global Notify",
    version: "1.0.0",
  });

  server.registerTool(
    "send_notification",
    {
      description:
        "Envía una notificación push al teléfono del usuario mediante ntfy. Úsala para avisar cuando un briefing, informe o automatización importante haya terminado.",
      inputSchema: {
        title: z.string().min(1).max(120),
        message: z.string().min(1).max(1000),
      },
    },
    async ({ title, message }) => {
      if (!env.NTFY_TOPIC) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: "NTFY_TOPIC no está configurado en Cloudflare.",
            },
          ],
        };
      }

      const response = await fetch("https://ntfy.sh", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          topic: env.NTFY_TOPIC,
          title,
          message,
          priority: 4,
          tags: ["satellite"],
        }),
      });

      if (!response.ok) {
        const detail = await response.text();
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `No se pudo enviar la notificación (HTTP ${response.status}): ${detail}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "Notificación enviada correctamente al teléfono.",
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
