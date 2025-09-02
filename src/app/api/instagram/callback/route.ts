import prismaClient from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const code = searchParams.get("code");
  const state = searchParams.get("state"); // logged-in userId passed as state

  if (!code || !state) {
    return NextResponse.json(
      { error: "Missing code or state" },
      { status: 400 }
    );
  }

  try {
    // 1. Exchange code → short-lived token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?` +
        new URLSearchParams({
          client_id: process.env.FB_APP_ID!,
          client_secret: process.env.FB_APP_SECRET!,
          redirect_uri: process.env.NEXT_PUBLIC_FB_REDIRECT_URI!,
          code,
        })
    );
    const tokenData = await tokenRes.json();
    if (tokenData.error) throw new Error(JSON.stringify(tokenData.error));
    const shortLivedToken = tokenData.access_token;

    // 2. Exchange short → long-lived token
    const longTokenRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?` +
        new URLSearchParams({
          grant_type: "fb_exchange_token",
          client_id: process.env.FB_APP_ID!,
          client_secret: process.env.FB_APP_SECRET!,
          fb_exchange_token: shortLivedToken,
        })
    );
    const longTokenData = await longTokenRes.json();
    if (longTokenData.error) throw new Error(JSON.stringify(longTokenData.error));

    const longLivedToken = longTokenData.access_token;
    const expiresIn = longTokenData.expires_in;
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    // 3. Debug permissions (super useful for checking scopes)
    const debugRes = await fetch(
      `https://graph.facebook.com/debug_token?` +
        new URLSearchParams({
          input_token: longLivedToken,
          access_token: `${process.env.FB_APP_ID}|${process.env.FB_APP_SECRET}`,
        })
    );
    const debugData = await debugRes.json();
    console.log("DEBUG: Token permissions", debugData);

    // 4. Get Pages for the user
    const pagesRes = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?access_token=${longLivedToken}`
    );
    const pagesData = await pagesRes.json();
    if (pagesData.error) throw new Error(JSON.stringify(pagesData.error));

    const page = pagesData.data?.[0];
    if (!page) throw new Error("No connected Facebook page found.");

    // 5. Get Instagram account linked to that Page
    const igRes = await fetch(
      `https://graph.facebook.com/v21.0/${page.id}?fields=instagram_business_account&access_token=${longLivedToken}`
    );
    const igData = await igRes.json();
    if (igData.error) throw new Error(JSON.stringify(igData.error));

    const igId = igData.instagram_business_account?.id;
    if (!igId) {
      throw new Error("No Instagram business account linked to this Page.");
    }

    // 6. Save or update IG account in DB
    const saved = await prismaClient.instagramAccount.upsert({
      where: { igId },
      update: {
        accessToken: longLivedToken,
        expiresAt,
        userId: state,
      },
      create: {
        igId,
        accessToken: longLivedToken,
        expiresAt,
        userId: state,
      },
    });
    console.log("DEBUG: Saved IG account in DB", saved);

    // 7. Redirect back to your frontend
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_BASE}/instagram-connected?ig_id=${igId}`;
    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error("IG callback error:", (err as Error).message);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
