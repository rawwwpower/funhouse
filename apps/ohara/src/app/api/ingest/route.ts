import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { processIngest } from "@/lib/ingest/pipeline";
import { z } from "zod/v4";

const IngestSchema = z.object({
  item_type: z.enum(["link", "image", "pdf", "screenshot", "note", "file"]),
  url: z.string().url().optional(),
  content: z.string().optional(),
  file_path: z.string().optional(),
  file_type: z.string().optional(),
  file_size: z.number().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = IngestSchema.parse(body);

    const result = await processIngest(user.id, parsed);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Ingest error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
