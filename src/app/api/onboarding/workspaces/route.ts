import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ workspaces: [] });
    }

    const { data } = await supabase
      .from("projects")
      .select("id, workspace_name, workspace_slug")
      .eq("user_id", user.id)
      .not("workspace_name", "is", null)
      .order("created_at", { ascending: false });

    const seen = new Set<string>();
    const workspaces = (data ?? [])
      .filter((p) => p.workspace_name && p.workspace_slug)
      .filter((p) => {
        if (seen.has(p.workspace_name as string)) return false;
        seen.add(p.workspace_name as string);
        return true;
      })
      .map((p) => ({
        id: p.id,
        workspace_name: p.workspace_name as string,
        workspace_slug: p.workspace_slug as string,
      }));

    return NextResponse.json({ workspaces });
  } catch {
    return NextResponse.json({ workspaces: [] });
  }
}
