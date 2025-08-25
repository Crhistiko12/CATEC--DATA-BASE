import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase.js';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Se acepta userId en body; si no llega, se usa un valor temporal para la demo
    const { userId } = await request.json().catch(() => ({}));
    const uid = (typeof userId === 'string' && userId.trim()) ? userId.trim() : 'usuario-temporal';

    const { error } = await supabase
      .from('carrito')
      .delete()
      .eq('user_id', uid);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Error inesperado' }), { status: 500 });
  }
};
