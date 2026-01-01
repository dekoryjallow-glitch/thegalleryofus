import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/route-handler';

/**
 * GET /api/generate/[id]
 * Gibt den Status einer Generation zurück (für Polling)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createRouteHandlerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const generationId = params.id;

    const { data: generation, error } = await supabase
      .from('generations')
      .select('*')
      .eq('id', generationId)
      .eq('user_id', user.id)
      .single();

    if (error || !generation) {
      return NextResponse.json({ error: 'Generation nicht gefunden' }, { status: 404 });
    }

    return NextResponse.json({
      id: generation.id,
      status: generation.status,
      result_url: generation.result_url,
      error_message: generation.error_message,
    });
  } catch (error) {
    console.error('Error fetching generation status:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

