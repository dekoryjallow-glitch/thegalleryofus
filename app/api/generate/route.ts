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
      prompt: `STYLE REFERENCE: 
Banksy street art stencil graffiti with heavy spray paint texture and soft edges.

SUBJECT & COMPOSITION:
Create a minimalist black-and-white stencil portrait of TWO FACES positioned intimately close together:
- Person 1 (left side, from first input image): Face in profile or three-quarter view, angled toward the right
- Person 2 (right side, from second input image): Face in profile or three-quarter view, angled toward the left
- The two faces are LEANING TOWARD EACH OTHER with FOREHEADS GENTLY TOUCHING
- Their NOSES DO NOT TOUCH – keep visible gap
- Their LIPS DO NOT TOUCH – maintain clear separation (intimate but not kissing)
- The heads create a unified, balanced composition suggesting connection and intimacy

SPATIAL LAYOUT:
- Aspect Ratio: 1:1 square (1024x1024 pixels = 40x40cm print size)
- Light beige/cream background (#F5F5DC or #E8E4D8) – CLEAN and MINIMAL
- Both faces positioned HEAD-TO-HEAD in the center of the canvas
- Close-up framing: Focus on faces only (from top of head to upper neck/shoulder suggestion). No full bodies.
- Balanced white space around the composition (10-15% margin on all sides)

FACIAL EXPRESSION (CRITICAL – Defines the emotional tone):
- Both faces show SUBTLE, GENTLE CONTENTMENT
- Lips: SLIGHTLY upturned at the corners – a soft, natural smile (NOT a grin, NOT teeth showing)
- The smile is BARELY VISIBLE but clearly present – think "inner peace" not "posing for camera"
- Eyes: Can be closed (meditative) or half-open (relaxed) – avoid wide-open intense stare
- Overall expression conveys: Safety, belonging, calm happiness, being at peace with each other
- Facial muscles relaxed – no tension in jaw, forehead, or around eyes
- The emotion should feel AUTHENTIC and INTIMATE, not performed or exaggerated

FACIAL FEATURES:

LEFT FACE (Person 1):
- Profile or three-quarter view showing one eye, eyebrow, nose, lips
- Hair: Flowing, textured strokes with volume (adapt to input image – long, short, curly, straight)
- Eye: Soft, relaxed expression – can be gently closed or half-lidded
- Mouth: Subtle smile – corners slightly lifted, natural and peaceful
- Soft facial features: delicate jawline, relaxed natural expression
- Overall mood: Content, at ease, gently happy

RIGHT FACE (Person 2):
- Profile or three-quarter view mirroring the left face's angle
- Hair: Textured strokes adapting to input image
- Facial hair (if applicable): Bold black spray-filled areas for beard/mustache
- Eye: Soft, relaxed expression matching Person 1
- Mouth: Subtle smile – corners slightly lifted, mirroring the gentle contentment
- Facial features adapted to input image
- Overall mood: Peaceful, grounded, quietly joyful

LINE & TEXTURE (CRITICAL – Defines the Banksy look):
- Black spray-painted outlines with HEAVY STENCIL TEXTURE
- Edges are NOT sharp – they have SOFT OVERSPRAY/BLEEDING like real spray paint through a stencil
- Lines are NOT continuous – they break, fade, and have organic gaps
- Vary spray intensity: Darker/denser in core areas (eyes, lips, hair shadows), lighter/mistier at edges
- Add subtle GRADIENT FADE at hair edges and outer contours (spray dissipating into air)
- The smile should be captured through subtle line curvature – minimal but clear

FACIAL SKIN AREA (CRITICAL – Keep Clean):
- The FACIAL SKIN (cheeks, forehead, chin, nose area) must be CLEAN WHITE/BEIGE
- NO color washes, NO gradient fills, NO spray texture INSIDE the face
- Face contours are defined by BLACK LINES ONLY – the interior stays clean background color
- Think: Stencil cut-out where the face shape is negative space, not filled with texture
- AVOID: Muddy grey washes, gradient shading, or "watercolor-like" effects on skin
- The face should have CRISP contrast: black outlines + clean light background inside

SPRAY EFFECTS (Essential for authenticity – BUT KEEP FACES CLEAN):
- Moderate overspray haze AROUND face edges ONLY (hair, jawline, shoulders, outer perimeter)
- NO SPRAY TEXTURE INSIDE THE FACIAL AREA (cheeks, forehead, chin, nose) – keep skin clean
- MINIMAL black dots: 3-5 small dots placed close to the faces but NOT on the face itself
- Subtle spray mist connecting the two faces OUTSIDE the face contours (like shared atmosphere)
- DRIPS: 2-4 vertical paint drips falling from organic points (hair tips, chin LINE, eyebrows) – drips should come FROM lines, not appear as random gradient washes
- IMPORTANT: Keep the background CLEAN and face interiors CLEAN – spray effects concentrated around hair, shoulders, outer edges only

BACKGROUND CLEANLINESS (CRITICAL):
- The beige/cream background should be MOSTLY CLEAN with minimal texture
- Spray effects (dots, splatter, mist) should be concentrated AROUND THE FACES ONLY, not inside them
- Avoid scattered random dots or splatter across the empty background areas
- The focus should be on the faces with clean negative space surrounding them
- Think: "Gallery-ready clean canvas with focused spray art subject"

COLOR:
- Pure black and white only
- NO color accents (keep the raw streetart authenticity)
- NO grey gradient washes or color bleeds in facial areas
- Background: Light beige/cream (#F5F5DC or #E8E4D8) – CLEAN and MINIMAL
- Face interiors: Same clean background color (no fills, no washes)

POSITIONING DETAILS:
- The two faces feel naturally positioned, as if captured mid-moment
- FOREHEADS touch gently – this is the primary connection point
- NOSES do not touch – maintain visible gap
- LIPS clearly separated – creates anticipation without kissing
- Their angles create visual tension and intimacy
- Hair from both sides can slightly overlap or flow toward each other

MOOD & ATMOSPHERE:
- Intimate and romantic through proximity and composition
- EMOTIONAL CORE: Quiet happiness, contentment, feeling safe and at home with each other
- Urban streetart aesthetic with deep emotional authenticity
- Clean, gallery-worthy presentation
- The composition feels balanced, meditative, peaceful, and gently joyful
- This is the feeling of "being together is enough" – no performance, just presence

CRITICAL EXCLUSIONS:
- NO KISSING – lips must not touch, noses must not touch
- ONLY FOREHEADS touch
- NO wide smiles or grins – keep it subtle and natural
- NO teeth showing – lips stay together with gentle upward curve
- NO exaggerated expressions – everything stays soft and authentic
- NO COLOR GRADIENTS OR WASHES IN FACIAL AREAS (cheeks, chin, forehead, nose)
- NO muddy grey fills inside face contours
- NO watercolor-like bleeding effects on skin
- NO spray texture inside the face – only around it
- NO vertical split down the middle (these are two separate positioned heads, not a split-face)
- NO mockups, frames, canvas textures, or wall backgrounds
- NO realistic shading or gradients (only spray paint density variations OUTSIDE faces)
- NO grey tones except as spray overspray effect around faces (never inside)
- NO full bodies, torsos, or clothing details
- NO color accents
- NO excessive background splatter – keep background CLEAN with spray effects concentrated around faces only

OUTPUT SPECIFICATIONS:
- Format: PNG (high-resolution)
- Dimensions: 1024x1024 pixels (for 40x40cm print at 300 DPI)
- Color mode: Black + Light Beige background
- Clean, flat digital file ready for professional printing
- No embedded mockup, frame, or texture overlay`
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
