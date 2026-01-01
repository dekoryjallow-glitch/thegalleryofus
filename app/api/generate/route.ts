import { NextResponse } from "next/server";
import Replicate from "replicate";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/generate/route.ts:7',message:'POST /api/generate started',data:{hasRequest:!!req,url:req.url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  try {
    // Prüfe ob Request Body lesbar ist
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/generate/route.ts:9',message:'Parsing FormData',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    const formData = await req.formData();
    const file1 = formData.get("selfie1") as File;
    const file2 = formData.get("selfie2") as File;
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/generate/route.ts:10',message:'FormData parsed',data:{hasFile1:!!file1,hasFile2:!!file2,file1Name:file1?.name,file2Name:file2?.name,file1Size:file1?.size,file2Size:file2?.size},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    if (!file1 || !file2) {
      return NextResponse.json({ error: "Missing files" }, { status: 400 });
    }

    console.log("[API Generate] Files received:", { file1Name: file1.name, file1Size: file1.size, file2Name: file2.name, file2Size: file2.size });

    // Supabase Admin Client für Uploads (nutzt Service Role Key für Bypass von RLS Policies)
    let supabase;
    try {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/generate/route.ts:20',message:'Creating Supabase admin client',data:{hasUrl:!!process.env.NEXT_PUBLIC_SUPABASE_URL,hasServiceKey:!!process.env.SUPABASE_SERVICE_ROLE_KEY},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      supabase = createAdminClient();
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/generate/route.ts:23',message:'Supabase admin client created',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      console.log("[API Generate] Supabase admin client created");
    } catch (supabaseError: any) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/generate/route.ts:25',message:'Supabase admin client creation failed',data:{error:supabaseError?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      console.error("[API Generate] Error creating Supabase client:", supabaseError);
      throw new Error(`Supabase client error: ${supabaseError.message}`);
    }

    // Prüfe ob Replicate API Token vorhanden ist
    if (!process.env.REPLICATE_API_TOKEN) {
      console.error("[API Generate] REPLICATE_API_TOKEN is not set!");
      throw new Error("REPLICATE_API_TOKEN environment variable is not set");
    }

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
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/generate/route.ts:61',message:'Starting image uploads',data:{timestamp},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      url1 = await uploadFile(file1, `uploads/${timestamp}_1.jpg`);
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/generate/route.ts:63',message:'First image uploaded',data:{url1:url1?.substring(0,100)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      url2 = await uploadFile(file2, `uploads/${timestamp}_2.jpg`);
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/generate/route.ts:65',message:'Both images uploaded successfully',data:{url1:url1?.substring(0,100),url2:url2?.substring(0,100)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      console.log("[API Generate] Both images uploaded successfully:", { url1, url2 });
    } catch (uploadError: any) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/generate/route.ts:67',message:'Image upload failed',data:{error:uploadError?.message,stack:uploadError?.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      console.error("[API Generate] Image upload failed:", uploadError);
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }

    // 2. Replicate Call
    // Nano-Banana Pro unterstützt Multi-Image Fusion über image_input Array-Parameter.
    // Kann bis zu 14 Bilder kombinieren und Konsistenz von bis zu 5 Personen beibehalten.
    // E006 Fehler deutet darauf hin, dass Replicate die Supabase-URLs nicht lesen kann.
    const replicateInput: any = {
      image_input: [url1, url2],  // Array ist erforderlich (bestätigt durch 422 Fehler)
      prompt: `You are a minimalist stencil artist in the style of Banksy.

TASK: Create a 'Split-Face' Continuous Line Drawing merging the two people from the input images into ONE single face shape.

1. COMPOSITION - "THE SPLIT":
- Do NOT draw two separate heads. Draw ONE centered face.
- The LEFT half of this face must be the features of Person 1 (from first image).
- The RIGHT half of this face must be the features of Person 2 (from second image).
- Merge them vertically down the middle using a loose, abstract continuous line. It does not need to be anatomically perfect, but artistically fused.
- ZOOM: Close-up on the face only. No necks, no shoulders, no bodies. Just the facial features floating in white space.

2. STYLE - "BANKSY MINIMALISM":
- Use only ONE single, fluid black line. Extremely abstract and sparse.
- Reduce features to the absolute minimum: just the eye shape, a hint of the nose, and the mouth line.
- TEXTURE: Add slight 'stencil spray' splatter or drip effects near the edges of the line to give it that street-art grit.

3. COLOR ACCENT:
- The drawing is Black & White.
- Add EXACTLY ONE bold, graffiti-style splash of color (e.g., a bright red heart or a gold spray streak) right where the two faces merge/kiss in the center.

4. EXCLUSIONS:
- No shading. No grey. No realism. No full bodies. No two separate circles for heads.`
    };

    let prediction;
    try {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/generate/route.ts:101',message:'Calling Replicate API',data:{model:'google/nano-banana-pro',imageInputCount:replicateInput.image_input.length,promptLength:replicateInput.prompt.length,hasReplicateToken:!!process.env.REPLICATE_API_TOKEN},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      console.log("[API Generate] Calling Replicate API with model: google/nano-banana-pro");
      console.log("[API Generate] Replicate input:", { image_input_count: replicateInput.image_input.length, prompt_length: replicateInput.prompt.length });
      prediction = await replicate.predictions.create({
        model: "google/nano-banana-pro",
        input: replicateInput,
      });
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/generate/route.ts:109',message:'Replicate prediction created',data:{predictionId:prediction?.id,status:prediction?.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      console.log("[API Generate] Replicate prediction created successfully:", { id: prediction.id, status: prediction.status });
    } catch (replicateError: any) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/generate/route.ts:111',message:'Replicate API error',data:{error:replicateError?.message,status:replicateError?.status,statusCode:replicateError?.statusCode},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      console.error("[API Generate] Replicate API error:", replicateError);
      throw new Error(`Replicate API error: ${replicateError.message || replicateError.toString()}`);
    }

    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/generate/route.ts:115',message:'Returning success response',data:{generationId:'nano-banana-pro-image-input',replicateId:prediction.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    return NextResponse.json({ 
      generationId: "nano-banana-pro-image-input", 
      replicateId: prediction.id 
    });

  } catch (error: any) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/generate/route.ts:120',message:'Error caught in POST handler',data:{error:error?.message,errorName:error?.name,stack:error?.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C,D'})}).catch(()=>{});
    // #endregion
    console.error("[API Generate] ERROR:", error);
    console.error("[API Generate] Error stack:", error.stack);
    console.error("[API Generate] Error name:", error.name);
    return NextResponse.json({ 
      error: error.message || "Internal server error",
      errorName: error.name,
    }, { status: 500 });
  }
}
