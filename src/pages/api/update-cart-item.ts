import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase.js';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { itemId, quantity } = await request.json().catch(() => ({}));
    if (!itemId || typeof quantity !== 'number' || !Number.isFinite(quantity) || quantity < 1) {
      return new Response(JSON.stringify({ error: 'Parámetros inválidos' }), { status: 400 });
    }

    const { data, error } = await supabase
      .from('carrito')
      .update({ cantidad: quantity })
      .eq('id', itemId)
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true, item: data }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Error inesperado' }), { status: 500 });
  }
};
