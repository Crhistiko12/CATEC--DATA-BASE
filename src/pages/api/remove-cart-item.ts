import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase.js';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { itemId } = await request.json().catch(() => ({}));
    if (!itemId) {
      return new Response(JSON.stringify({ error: 'Falta itemId' }), { status: 400 });
    }

    const { error } = await supabase
      .from('carrito')
      .delete()
      .eq('id', itemId);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Error inesperado' }), { status: 500 });
  }
};
