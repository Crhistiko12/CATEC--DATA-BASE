// ✅ Usando el cliente Supabase configurado correctamente
import { supabase, getCart } from '../lib/supabase.js';

// Ejemplo 1: Obtener todos los items del carrito (método directo)
async function obtenerCarrito() {
    const { data, error } = await supabase
        .from('carrito')
        .select('*');
    
    if (error) {
        console.error('Error al obtener carrito:', error);
        return;
    }
    
    console.log('Carrito (método directo):', data);
}

// Ejemplo 2: Usar la función optimizada del helper
async function obtenerCarritoOptimizado(userId = 1) {
    const { data, error } = await getCart(userId);
    
    if (error) {
        console.error('Error al obtener carrito optimizado:', error);
        return;
    }
    
    console.log('Carrito (con productos):', data);
}

// Ejecutar ejemplos
obtenerCarrito();
obtenerCarritoOptimizado();