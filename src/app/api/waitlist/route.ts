import { NextResponse } from "next/server";

import { waitlistSchema } from "@/lib/schemas/waitlist";
import { getSupabaseClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = waitlistSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          success: false,
          message: fieldErrors.email?.[0] ?? "Invalid payload",
        },
        { status: 422 }
      );
    }

    const supabase = getSupabaseClient();
    const email = parsed.data.email.trim().toLowerCase();
    const metadata = {
      referer: request.headers.get("referer") ?? undefined,
      userAgent: request.headers.get("user-agent") ?? undefined,
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
    };

    const { error } = await supabase.from("waitlist_submissions").insert({
      email,
      source: "landing",
      metadata,
    });

    if (error) {
      if (error.code === "23505") {
        await supabase
          .from("waitlist_submissions")
          .update({ metadata })
          .eq("email", email);

        return NextResponse.json({
          success: true,
          message: "You’re already on the list—hang tight for updates.",
          alreadyExists: true,
        });
      }

      console.error("Supabase waitlist insert failed", error);
      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to save your waitlist request. Please try again shortly.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "You’re on the list. See you soon.",
    });
  } catch (error) {
    console.error("Waitlist submission failed", error);
    return NextResponse.json(
      {
        success: false,
        message: "Unexpected error while processing request",
      },
      { status: 500 }
    );
  }
}
