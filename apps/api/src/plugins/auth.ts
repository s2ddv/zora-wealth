import fp from "fastify-plugin";
import { createClient } from "@supabase/supabase-js";
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    userId: string | null;
    authId: string | null;
  }
}

const PUBLIC_ROUTES = ["/v1/health", "/v1/market", "/v1/wallet"];

function isPublicRoute(url: string): boolean {
  return PUBLIC_ROUTES.some((route) => url.startsWith(route));
}

export default fp(async (app: FastifyInstance) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  app.decorateRequest("userId", null);
  app.decorateRequest("authId", null);

  if (!supabaseUrl || !supabaseServiceKey) {
    app.log.warn(
      "Supabase credentials not configured. Auth plugin will be skipped. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
    return;
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  app.addHook("onRequest", async (request: FastifyRequest, reply: FastifyReply) => {
    if (isPublicRoute(request.url)) return;

    const token = request.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      const devUserId = process.env.DEV_USER_ID;
      const allowDevAuth = process.env.NODE_ENV !== "production";

      if (allowDevAuth && devUserId) {
        const user = await app.prisma.user.findUnique({ where: { id: devUserId } });
        if (user) {
          request.userId = user.id;
          request.authId = user.authId;
          return;
        }
      }

      return reply
        .status(401)
        .send({ error: "Missing or invalid authorization header" });
    }

    try {
      const { data, error } = await supabaseAdmin.auth.getUser(token);
      if (error || !data.user) {
        return reply.status(401).send({ error: "Invalid or expired token" });
      }

      const user = await app.prisma.user.upsert({
        where: { authId: data.user.id },
        update: {
          email: data.user.email || `user-${data.user.id}@supabase.local`,
        },
        create: {
          authId: data.user.id,
          email: data.user.email || `user-${data.user.id}@supabase.local`,
        },
      });

      request.userId = user.id;
      request.authId = user.authId;
    } catch (err) {
      app.log.error(err);
      return reply.status(401).send({ error: "Authentication failed" });
    }
  });
});