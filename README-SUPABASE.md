# 🚀 Guía KukiPets - Supabase

## ✅ Configuración Completada

Tu proyecto ya está correctamente configurado con Supabase. Aquí tienes todo lo que necesitas saber:

## 📁 Estructura de Archivos

```
src/
├── lib/
│   └── supabase.js          # ✅ Cliente configurado + funciones helper
├── pages/
│   ├── supabase.js          # ✅ Corregido - Ejemplos de uso
│   ├── api-example.astro    # 🆕 Página de ejemplos completos
│   └── test-supabase.astro  # ✅ Prueba de conexión
.env                         # ✅ Variables protegidas
.gitignore                   # ✅ Protege .env
```

## 🔧 Funciones Disponibles

### Importar cliente:
```javascript
import { supabase } from '../lib/supabase.js';
```

### Funciones helper:
```javascript
import { getCart, addToCart, removeFromCart } from '../lib/supabase.js';

// Obtener carrito con productos
const { data, error } = await getCart(userId);

// Añadir al carrito
await addToCart(userId, productId, cantidad);

// Eliminar del carrito
await removeFromCart(itemId);
```

## 🛠️ Uso en Páginas Astro

```astro
---
import { supabase } from '../lib/supabase.js';

const { data: productos, error } = await supabase
  .from('productos')
  .select('*');
---

<div>
  {productos?.map(item => (
    <p>{item.nombre} - ${item.precio}</p>
  ))}
</div>
```

## 🔒 Seguridad

- ✅ Credenciales en `.env` (no en código)
- ✅ `.env` protegido en `.gitignore`
- ✅ Uso de variables `PUBLIC_` para cliente
- ❌ NUNCA hardcodear API keys

## 📋 Páginas de Prueba

1. `/test-supabase` - Prueba básica de conexión
2. `/api-example` - Ejemplos completos de uso

## 🚨 Errores Corregidos

- ❌ Credenciales hardcodeadas → ✅ Variables de entorno
- ❌ Fetch manual → ✅ Cliente Supabase oficial
- ❌ .env sin protección → ✅ Añadido a .gitignore
