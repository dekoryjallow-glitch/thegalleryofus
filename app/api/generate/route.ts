import { NextResponse } from "next/server";
import Replicate from "replicate";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  console.log("[API Generate] POST request started");
  try {
    // Prüfe ob Request Body lesbar ist
    console.log("[API Generate] Parsing FormData...");
    const formData = await req.formData();
    const file1 = formData.get("selfie1") as File;
    const file2 = formData.get("selfie2") as File;
    console.log("[API Generate] FormData parsed");

    if (!file1 || !file2) {
      return NextResponse.json({ error: "Missing files" }, { status: 400 });
    }

    console.log("[API Generate] Files received:", { file1Name: file1.name, file1Size: file1.size, file2Name: file2.name, file2Size: file2.size });

    // Supabase Admin Client für Uploads (nutzt Service Role Key für Bypass von RLS Policies)
    let supabase;
    try {
      console.log("[API Generate] Creating Supabase admin client...");
      supabase = createAdminClient();
      console.log("[API Generate] Supabase admin client created");
    } catch (supabaseError: any) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'app/api/generate/route.ts:25', message: 'Supabase admin client creation failed', data: { error: supabaseError?.message }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'B' }) }).catch(() => { });
      // #endregion
      console.error("[API Generate] Error creating Supabase client:", supabaseError);
      throw new Error(`Supabase client error: ${supabaseError.message}`);
    }

    // Prüfe ob Replicate API Token vorhanden ist
    const replicateToken = process.env.REPLICATE_API_TOKEN;
    if (!replicateToken) {
      console.error("[API Generate] REPLICATE_API_TOKEN is not set!");
      throw new Error("REPLICATE_API_TOKEN environment variable is not set");
    }
    console.log("[API Generate] REPLICATE_API_TOKEN is set (length:", replicateToken.length, ")");

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
    console.log("[API Generate] Replicate client created");

    // 1. Upload Bilder zu Supabase und hole öffentliche URLs
    // HINWEIS: E006 Fehler bedeutet, dass Replicate die URLs nicht lesen kann.
    // Mögliche Ursachen: URLs sind nicht öffentlich, CORS, oder Supabase Storage Einstellungen
    const timestamp = Date.now();
    const uploadFile = async (file: File, path: string) => {
      try {
        console.log(`[API Generate] Uploading file to path: ${path}`);
        const { error } = await supabase.storage.from("selfies").upload(path, file);
        if (error) {
          console.error(`[API Generate] Upload error for ${path}:`, error);
          throw error;
        }
        const { data } = supabase.storage.from("selfies").getPublicUrl(path);
        console.log(`[API Generate] Upload successful, public URL: ${data.publicUrl}`);
        return data.publicUrl;
      } catch (uploadError: any) {
        console.error(`[API Generate] Upload failed for ${path}:`, uploadError);
        throw uploadError;
      }
    };

    let url1, url2;
    try {
      console.log("[API Generate] Starting image uploads...");
      url1 = await uploadFile(file1, `uploads/${timestamp}_1.jpg`);
      console.log("[API Generate] First image uploaded");
      url2 = await uploadFile(file2, `uploads/${timestamp}_2.jpg`);
      console.log("[API Generate] Both images uploaded successfully");
      console.log("[API Generate] Public URLs:", { url1, url2 });
    } catch (uploadError: any) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'app/api/generate/route.ts:67', message: 'Image upload failed', data: { error: uploadError?.message, stack: uploadError?.stack }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'D' }) }).catch(() => { });
      // #endregion
      console.error("[API Generate] Image upload failed:", uploadError);
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }

    // 2. Replicate Call
    // Nano-Banana Pro unterstützt Multi-Image Fusion über image_input Array-Parameter.
    // Kann bis zu 14 Bilder kombinieren und Konsistenz von bis zu 5 Personen beibehalten.
    // E006 Fehler deutet darauf hin, dass Replicate die Supabase-URLs nicht lesen kann.
    const replicateInput: any = {
      image_input: [url1, url2],
      width: 1024,
      height: 1024,
      prompt: `You are a minimalist stencil artist in the style of Banksy.

TASK: Create a clean digital 'Split-Face' Continuous Line Drawing merging the two people from the input images into ONE single face shape.

1. COMPOSITION - "THE SPLIT":
- ASPECT RATIO: 1:1 Square (1024x1024). 
- OUTPUT: A flat, 2D digital art file on a PURE WHITE BACKGROUND (#FFFFFF).
- Do NOT draw two separate heads. Draw ONE centered face.
- The LEFT half of this face must be the features of Person 1 (from first image).
- The RIGHT half of this face must be the features of Person 2 (from second image).
- Merge them vertically down the middle using a loose, abstract continuous line.
- ZOOM & MARGINS: Ensure there is enough white space/margin around the face. Close-up on the face only. No necks, no shoulders, no bodies. Just the facial features floating in white space.

2. STYLE - "BANKSY MINIMALISM":
- Use only ONE single, fluid black line. Extremely abstract and sparse.
- Reduce features to the absolute minimum: just the eye shape, a hint of the nose, and the mouth line.
- TEXTURE: Add slight 'stencil spray' splatter or drip effects near the edges of the line.

3. COLOR ACCENT:
- The drawing is Black & White.
- Add EXACTLY ONE bold, graffiti-style splash of color (e.g., a bright red heart or a gold spray streak) right where the two faces merge/kiss in the center.

4. CRITICAL EXCLUSIONS (DO NOT GENERATE):
- NO MOCKUPS, NO FRAMES, NO CANVAS TEXTURE.
- NO WALLS, NO INTERIOR SETTINGS, NO SHADOWS, NO REALISTIC LIGHTING.
- NO SHADING, NO GREY, NO REALISM.
- The output must be a clean, digital image file ready for professional printing.`
    };

    let prediction;
    try {
      console.log("[API Generate] Calling Replicate API with model: google/nano-banana-pro");
      console.log("[API Generate] Replicate input payload:", JSON.stringify(replicateInput, null, 2));

      prediction = await replicate.predictions.create({
        model: "google/nano-banana-pro",
        input: replicateInput,
      });

      console.log("[API Generate] Replicate prediction created successfully:", { id: prediction.id, status: prediction.status });
    } catch (replicateError: any) {
      console.error("[API Generate] Replicate API error details:", {
        message: replicateError.message,
        status: replicateError.status,
        statusCode: replicateError.statusCode,
        stack: replicateError.stack
      });
      throw new Error(`Replicate API error: ${replicateError.message || replicateError.toString()}`);
    }

    return NextResponse.json({
      generationId: "nano-banana-pro-image-input",
      replicateId: prediction.id
    });

  } catch (error: any) {
    console.error("[API Generate] FINAL ERROR:", error);
    return NextResponse.json({
      error: error.message || "Internal server error",
      errorName: error.name,
    }, { status: 500 });
  }
}
