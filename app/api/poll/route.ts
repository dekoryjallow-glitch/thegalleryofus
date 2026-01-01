import { NextResponse } from "next/server";
import Replicate from "replicate";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  try {
    const prediction = await replicate.predictions.get(id);
    
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/poll/route.ts:19',message:'[API Poll] Full prediction response',data:{id:id,status:prediction.status,hasOutput:!!prediction.output,outputType:typeof prediction.output,completedAt:prediction.completed_at,fullPrediction:JSON.stringify(prediction).substring(0,2000)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    console.log(`[API Poll] ID: ${id}, Status: ${prediction.status}, Has output: ${!!prediction.output}, Output type: ${typeof prediction.output}`);
    console.log(`[API Poll] Completed at: ${prediction.completed_at || 'null'}, Started at: ${prediction.started_at || 'null'}`);
    
    // Vollständige Prediction-Response loggen für Debugging
    const fullPredictionStr = JSON.stringify(prediction, null, 2);
    console.log(`[API Poll] Full prediction response:`, fullPredictionStr);
    
    if (prediction.output) {
      console.log(`[API Poll] ✅ Output value:`, prediction.output);
      console.log(`[API Poll] Output JSON: ${JSON.stringify(prediction.output)}`);
    } else {
      console.log(`[API Poll] ⚠️ OUTPUT IS NULL - Full prediction keys:`, Object.keys(prediction));
      if (prediction.error) {
        console.log(`[API Poll] ⚠️ ERROR FIELD PRESENT:`, prediction.error);
      }
      if (prediction.urls) {
        console.log(`[API Poll] ⚠️ URLS FIELD PRESENT:`, prediction.urls);
      }
    }
    
    // WICHTIG: Prüfe auch, ob completed_at gesetzt ist (bedeutet Generierung ist fertig)
    if (prediction.completed_at && !prediction.output) {
      console.log(`[API Poll] ⚠️ WARNING: completed_at is set (${prediction.completed_at}) but output is null. Status: ${prediction.status}`);
      console.log(`[API Poll] This might indicate the output is in a different field or the prediction failed`);
      if (prediction.error) {
        console.log(`[API Poll] ⚠️ Prediction has error field:`, prediction.error);
      }
      if (prediction.urls) {
        console.log(`[API Poll] ⚠️ Checking urls field for alternative output:`, prediction.urls);
      }
    }
    
    return NextResponse.json(prediction);
  } catch (pollError: any) {
    console.error(`[API Poll] Error for ID ${id}:`, pollError.message);
    throw pollError;
  }
}
