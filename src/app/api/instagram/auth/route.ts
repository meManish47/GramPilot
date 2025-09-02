import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const authUrl =
    `https://www.facebook.com/v21.0/dialog/oauth?` +
    new URLSearchParams({
      client_id: process.env.FB_APP_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_FB_REDIRECT_URI!,
      state: userId, // pass your userId to identify later
      scope: [
        "pages_show_list",
        "pages_manage_posts",
        "pages_read_engagement",
        "instagram_basic",
        "instagram_manage_insights",
        "instagram_content_publish",
      ].join(","),
      response_type: "code",
    });

  return NextResponse.redirect(authUrl);
}
