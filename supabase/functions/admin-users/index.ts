import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

  if (req.method !== "POST") return json(405, { error: "POST required" });

  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const authHeader = req.headers.get("Authorization") || "";
  if (!authHeader.startsWith("Bearer ")) return json(401, { error: "Sign in required" });

  const adminClient = createClient(url, serviceKey);
  const token = authHeader.slice(7);
  const { data: { user }, error: authError } = await adminClient.auth.getUser(token);
  if (authError || !user || user.app_metadata?.role !== "admin") {
    return json(403, { error: "Administrator access required" });
  }

  try {
    const body = await req.json();
    const action = body.action;

    if (action === "list") {
      const { data, error } = await adminClient.from("app_users")
        .select("id, username, status, expires_at, created_at").order("created_at", { ascending: false });
      if (error) throw error;
      return json(200, { users: data });
    }

    if (action === "create") {
      const username = String(body.username || "").trim();
      const password = String(body.password || "");
      if (username.length < 3 || username.length > 60 || password.length < 10 || password.length > 128) {
        return json(400, { error: "Invalid username or password length" });
      }
      if (!/^[a-zA-Z0-9_.-]+$/.test(username)) return json(400, { error: "Use letters, numbers, dot, underscore or hyphen in username" });
      const syntheticEmail = `${username.toLowerCase()}@users.akash-tool.invalid`;
      const { data, error } = await adminClient.auth.admin.createUser({
        email: syntheticEmail,
        password,
        email_confirm: true,
        user_metadata: { username },
      });
      if (error) throw error;
      if (body.expires_at) {
        const { error: updateError } = await adminClient.from("app_users")
          .update({ expires_at: body.expires_at }).eq("id", data.user.id);
        if (updateError) throw updateError;
      }
      return json(200, { ok: true, id: data.user.id });
    }

    if (action === "status") {
      if (!["active", "disabled"].includes(body.status)) return json(400, { error: "Invalid status" });
      const { error } = await adminClient.from("app_users").update({ status: body.status }).eq("id", body.id);
      if (error) throw error;
      return json(200, { ok: true });
    }

    if (action === "delete") {
      const { error } = await adminClient.auth.admin.deleteUser(body.id);
      if (error) throw error;
      return json(200, { ok: true });
    }

    return json(400, { error: "Unknown action" });
  } catch (e) {
    return json(400, { error: e?.message || "Operation failed" });
  }
});
