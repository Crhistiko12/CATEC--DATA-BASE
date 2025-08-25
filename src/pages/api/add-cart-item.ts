import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase.js';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { userId, productId, quantity } = await request.json().catch(() => ({}));

    const uid = (typeof userId === 'string' && userId.trim()) ? userId.trim() : 'usuario-temporal';
    const pid = typeof productId === 'number' ? productId : parseInt(productId);
    const qty = (typeof quantity === 'number' && Number.isFinite(quantity) && quantity > 0) ? quantity : 1;

    if (!pid || !Number.isFinite(pid)) {
      return new Response(JSON.stringify({ error: 'productId inválido' }), { status: 400 });
    }

    // Verificar si ya existe el item
    const { data: existing, error: selError } = await supabase
      .from('carrito')
      .select('*')
      .eq('user_id', uid)
      .eq('producto_id', pid)
      .maybeSingle();

    if (selError) {
      return new Response(JSON.stringify({ error: selError.message }), { status: 500 });
    }

    if (existing) {
      const newQty = (existing.cantidad || 0) + qty;
      const { error: updError } = await supabase
        .from('carrito')
        .update({ cantidad: newQty })
        .eq('id', existing.id);

      if (updError) {
        return new Response(JSON.stringify({ error: updError.message }), { status: 500 });
      }

      return new Response(JSON.stringify({ ok: true, id: existing.id, cantidad: newQty }), { status: 200 });
    } else {
      const { data: inserted, error: insError } = await supabase
        .from('carrito')
        .insert({ user_id: uid, producto_id: pid, cantidad: qty })
        .select()
        .single();

      if (insError) {
        return new Response(JSON.stringify({ error: insError.message }), { status: 500 });
      }

      return new Response(JSON.stringify({ ok: true, id: inserted.id, cantidad: inserted.cantidad }), { status: 200 });
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Error inesperado' }), { status: 500 });
  }
};
