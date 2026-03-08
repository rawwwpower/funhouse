import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = request.nextUrl.searchParams.get("url");
    if (!url) {
      return NextResponse.json({ error: "URL required" }, { status: 400 });
    }

    const { default: ogs } = await import("open-graph-scraper");
    const { result } = await ogs({ url, timeout: 10000 });

    return NextResponse.json({
      title: result.ogTitle || "",
      description: result.ogDescription || "",
      image: result.ogImage?.[0]?.url || "",
      siteName: result.ogSiteName || "",
      favicon: result.favicon || "",
    });
  } catch (error) {
    console.error("OG fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch OG data" },
      { status: 500 }
    );
  }
}
