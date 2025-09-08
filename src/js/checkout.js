import { supabase } from "../lib/supabase.js";

/**
 * Procesa el checkout a partir del carrito de un usuario.
 * Pasos:
 * 1) Leer items del carrito (con datos de producto)
 * 2) Crear orden en tabla "orders"
 * 3) Crear items en tabla "order_items"
 * 4) Vaciar carrito del usuario
 * 5) Incrementar contador de popularidad/ventas de cada producto (si existe la columna)
 *
 * @param {Object} params
 * @param {string} params.userId - ID del usuario (requerido)
 * @param {Object} [params.customer] - Info de cliente opcional { name, email, phone }
 * @param {Object} [params.shipping] - Info de envío opcional { address, city, notes }
 * @returns {Promise<{orderId: string|number, order:number|object}>}
 */
export async function processCheckout({ userId, customer = {}, shipping = {}, selectedProductIds = [] }) {
  if (!userId) throw new Error("processCheckout: userId es requerido");

  // 1) Obtener carrito con datos de producto
  const { data: cart, error: cartErr } = await supabase
    .from("carrito")
    .select(
      `id, cantidad,
       producto_id,
       productos:producto_id (
         id, nombre, precio, descripcion
       )`
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (cartErr) throw new Error(`No se pudo leer el carrito: ${cartErr.message}`);
  if (!cart || cart.length === 0) throw new Error("Tu carrito está vacío");

  // Filtrado por selección (si se proporcionó)
  let cartToUse = cart;
  const selected = Array.isArray(selectedProductIds) ? selectedProductIds.filter(Boolean) : [];
  if (selected.length > 0) {
    cartToUse = cart.filter((c) => selected.includes(c.producto_id));
    if (cartToUse.length === 0) {
      throw new Error("No seleccionaste productos para comprar");
    }
  }

  const items = cartToUse.map((c) => {
    const prod = c.productos || {};
    const price = Number(prod.precio || 0);
    const qty = Number(c.cantidad || 1);
    return {
      producto_id: c.producto_id || prod.id,
      nombre: prod.nombre,
      precio_unitario: price,
      cantidad: qty,
      subtotal: price * qty,
    };
  });
  const total = items.reduce((s, it) => s + it.subtotal, 0);

  // 2) Crear orden
  const orderPayloadEN = {
    user_id: userId,
    total_amount: total,
    status: "pendiente",
    customer_name: customer.name || null,
    customer_email: customer.email || null,
    customer_phone: customer.phone || null,
    shipping_address: shipping.address || null,
    shipping_city: shipping.city || null,
    shipping_notes: shipping.notes || null,
  };
  // Variante columnas en español (fallback)
  const orderPayloadES = {
    user_id: userId,
    total: total,
    estado: "pendiente",
    cliente_nombre: customer.name || null,
    cliente_email: customer.email || null,
    cliente_telefono: customer.phone || null,
    envio_direccion: shipping.address || null,
    envio_ciudad: shipping.city || null,
    envio_notas: shipping.notes || null,
  };
  // Variante mínima ES: solo columnas cliente_* + user_id
  const orderPayloadESMin = {
    user_id: userId,
    cliente_nombre: customer.name || null,
    cliente_email: customer.email || null,
    cliente_telefono: customer.phone || null,
  };

  let orderCreated = null;
  let orderErr = null;
  // Intento 1: columnas EN
  {
    const { data, error } = await supabase
      .from("orders")
      .insert(orderPayloadEN)
      .select()
      .single();
    orderCreated = data; orderErr = error || null;
  }
  // Si falla, intento 2: columnas ES
  if (orderErr) {
    const { data, error } = await supabase
      .from("orders")
      .insert(orderPayloadES)
      .select()
      .single();
    orderCreated = data; orderErr = error || null;
  }
  // Si sigue fallando, intento 3: columnas ES mínimas
  if (orderErr) {
    const { data, error } = await supabase
      .from("orders")
      .insert(orderPayloadESMin)
      .select()
      .single();
    orderCreated = data; orderErr = error || null;
  }

  if (orderErr) throw new Error(`No se pudo crear la orden: ${orderErr.message}`);
  const orderId = orderCreated.id;

  // 3) Crear items de la orden
  const orderItemsPayload = items.map((it) => ({
    order_id: orderId,
    producto_id: it.producto_id,
    cantidad: it.cantidad,
    precio_unitario: it.precio_unitario,
    subtotal: it.subtotal,
  }));

  const { error: itemsErr } = await supabase
    .from("order_items")
    .insert(orderItemsPayload);

  if (itemsErr) throw new Error(`No se pudieron crear los items: ${itemsErr.message}`);

  // 4) Vaciar carrito (solo seleccionados si aplica)
  let clearErr = null;
  if (selected.length > 0) {
    const { error } = await supabase
      .from("carrito")
      .delete()
      .eq("user_id", userId)
      .in("producto_id", selected);
    clearErr = error || null;
  } else {
    const { error } = await supabase
      .from("carrito")
      .delete()
      .eq("user_id", userId);
    clearErr = error || null;
  }

  if (clearErr) {
    // No aborta el checkout, pero lo registramos
    console.warn("No se pudo vaciar el carrito tras checkout:", clearErr);
  }

  // 5) Incrementar popularidad / ventas por producto (si existe la columna)
  // Implementación segura: leer valor actual y actualizar con (+ cantidad)
  try {
    for (const it of items) {
      const { data: prodRow, error: readErr } = await supabase
        .from("kukipets-productos")
        .select("id, popularidad")
        .eq("id", it.producto_id)
        .single();
      if (readErr || !prodRow) continue;
      const current = Number(prodRow.popularidad || 0);
      const inc = Number(it.cantidad || 1);
      await supabase
        .from("kukipets-productos")
        .update({ popularidad: current + inc })
        .eq("id", it.producto_id);
    }
  } catch (e) {
    console.warn("No se pudo actualizar popularidad/ventas:", e);
  }

  // Emitir evento para actualizar contadores del header (si usas localStorage también)
  try {
    window.dispatchEvent(new Event("kukipets:cart-updated"));
  } catch {}

  return { orderId, order: orderCreated };
}

/**
 * Utilidad: Lee carrito desde localStorage (para mostrar contadores) y lo sincroniza.
 * No afecta a Supabase. Útil para mantener tu header en sync tras checkout.
 */
export function clearLocalCart() {
  try {
    localStorage.setItem("kukipets_cart", "[]");
    window.dispatchEvent(new Event("kukipets:cart-updated"));
  } catch {}
}
