import { supabase } from "../lib/supabase.js";

export async function getCurrentUserId() {
  try {
    const { data } = await supabase.auth.getUser();
    return data?.user?.id || null;
  } catch {
    return null;
  }
}

export async function getOrderById(orderId) {
  if (!orderId) throw new Error("orderId es requerido");

  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (orderErr) throw new Error(orderErr.message);

  const { data: items, error: itemsErr } = await supabase
    .from("order_items")
    .select(
      `id, order_id, producto_id, cantidad, precio_unitario, subtotal,
       producto:kukipets-productos!order_items_producto_id_fkey (id, nombre, precio)`
    )
    .eq("order_id", orderId);

  if (itemsErr) throw new Error(itemsErr.message);

  return { order, items };
}

export async function listOrders({ status } = {}) {
  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

export async function updateOrderStatus(orderId, status) {
  if (!orderId) throw new Error("orderId es requerido");
  const valid = ["pendiente", "enviado", "entregado", "cancelado"];
  if (!valid.includes(status)) throw new Error("Estado inválido");

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getOrderItems(orderId) {
  const { data, error } = await supabase
    .from("order_items")
    .select(
      `id, order_id, producto_id, cantidad, precio_unitario, subtotal,
       producto:kukipets-productos!order_items_producto_id_fkey (id, nombre, precio)`
    )
    .eq("order_id", orderId)
    .order("id");
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteOrder(orderId) {
  if (!orderId) throw new Error("orderId es requerido");
  // Primero borrar items
  const { error: itemsErr } = await supabase
    .from("order_items")
    .delete()
    .eq("order_id", orderId);
  if (itemsErr) throw new Error(itemsErr.message);

  // Luego borrar la orden
  const { error: orderErr } = await supabase
    .from("orders")
    .delete()
    .eq("id", orderId);
  if (orderErr) throw new Error(orderErr.message);

  return true;
}
