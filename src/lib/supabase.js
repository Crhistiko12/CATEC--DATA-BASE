import { createClient } from '@supabase/supabase-js';

// Configuración inicial del cliente
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función optimizada para obtener el carrito con datos de productos
export async function getCart(userId) {
  const { data, error } = await supabase
    .from('carrito')
    .select(`
      id,
      cantidad,
      productos:producto_id (
        id, 
        nombre, 
        precio,
        descripcion
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching cart:', error);
    return { data: null, error };
  }

  return { data, error: null };
}

// Función para añadir/actualizar items en el carrito
export async function addToCart(userId, productId, quantity = 1) {
  const { data, error } = await supabase
    .from('carrito')
    .upsert(
      {
        user_id: userId,
        producto_id: productId,
        cantidad: quantity
      },
      { onConflict: 'user_id,producto_id' }
    )
    .select()
    .single();

  return { data, error };
}

// Función para eliminar items del carrito
export async function removeFromCart(itemId) {
  const { error } = await supabase
    .from('carrito')
    .delete()
    .eq('id', itemId);

  return { error };
}