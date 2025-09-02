import prismaClient from "@/services/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const code = searchParams.get("code");
  const state = searchParams.get("state"); // logged-in userId passed as state

  if (!code || !state) {
    console.error("DEBUG: Missing required params", { code, state });
    return NextResponse.json(
      { error: "Missing code or state" },
      { status: 400 }
    );
  }

  try {
    // 1. Exchange code for short-lived token
    console.log("DEBUG: Requesting short-lived token with code:", code);
    const tokenRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?` +
        new URLSearchParams({
          client_id: process.env.FB_APP_ID!,
          client_secret: process.env.FB_APP_SECRET!,
          redirect_uri: process.env.NEXT_PUBLIC_FB_REDIRECT_URI!,
          code,
        }),
      { method: "GET" }
    );

    const tokenData = await tokenRes.json();
    console.log("DEBUG: Short-lived token response:", tokenData);

    if (tokenData.error) throw new Error(JSON.stringify(tokenData.error));
    const shortLivedToken = tokenData.access_token as string;

    // 2. Exchange short-lived for long-lived token
    console.log(
      "DEBUG: Requesting long-lived token with short token:",
      shortLivedToken
    );
    const longTokenRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?` +
        new URLSearchParams({
          grant_type: "fb_exchange_token",
          client_id: process.env.FB_APP_ID!,
          client_secret: process.env.FB_APP_SECRET!,
          fb_exchange_token: shortLivedToken,
        }),
      { method: "GET" }
    );

    const longTokenData = await longTokenRes.json();
    console.log("DEBUG: Long-lived token response:", longTokenData);

    if (longTokenData.error)
      throw new Error(JSON.stringify(longTokenData.error));
    const longLivedToken = longTokenData.access_token as string;
    const expiresIn = longTokenData.expires_in as number;

    // 3. Get connected FB Pages
    console.log("DEBUG: Requesting pages with token:", longLivedToken);
    const igRes = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?access_token=${longLivedToken}`,
      { method: "GET" }
    );

    const igData = await igRes.json();
    // console.log("DEBUG: Pages response:", igData);

    if (igData.error) throw new Error(JSON.stringify(igData.error));
    const page = igData.data?.[0];
    if (!page) {
      // console.error("DEBUG: No FB pages linked to this account");
      throw new Error("No connected Instagram account found.");
    }

    // 4. Get Instagram Business account linked to that page
    console.log("DEBUG: Requesting IG business account for page:", page.id);
    const igAccountRes = await fetch(
      `https://graph.facebook.com/v21.0/${page.id}?fields=instagram_business_account&access_token=${longLivedToken}`,
      { method: "GET" }
    );

    const igAccountData = await igAccountRes.json();
    // console.log(
    //   `DEBUG: IG account response for page ${page.id}:`,
    //   igAccountData
    // );

    if (igAccountData.error)
      throw new Error(JSON.stringify(igAccountData.error));
    const igId = igAccountData.instagram_business_account?.id;
    if (!igId) {
      console.error(
        "DEBUG: Page exists but no IG account linked",
        igAccountData
      );
      throw new Error("No Instagram business account linked.");
    }

    // 5. Save/Update IG account in DB
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    console.log("DEBUG: Saving IG account in DB", { igId, state, expiresAt });

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

    console.log("DEBUG: DB save success", saved);

    // 6. Redirect user back
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_BASE}/instagram-connected?ig_id=${igId}`;
    console.log("DEBUG: Redirecting to:", redirectUrl);
    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error("IG callback error:", (err as Error).message || err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
