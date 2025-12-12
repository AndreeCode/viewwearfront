# Sistema de Base de Datos de Prendas

Este proyecto utiliza un sistema simple de base de datos basado en archivos de texto para almacenar las prendas.

## 📁 Estructura de Archivos

```
data/
  └── garments.txt         # Base de datos de prendas (formato JSON Lines)
public/
  ├── garments/            # Imágenes de prendas personalizadas
  └── uploads/             # Imágenes temporales de usuarios
```

## 📝 Formato de la Base de Datos

El archivo `data/garments.txt` utiliza el formato **JSON Lines** (un objeto JSON por línea).

### Ejemplo de registro:
```json
{"id":"s1","name":"Polo Blanco Clásico","category":"shirts","image":"/white-polo-shirt.png","isCustom":false}
```

### Campos:
- **id**: Identificador único de la prenda
- **name**: Nombre descriptivo de la prenda
- **category**: Categoría (`shirts`, `pants`, `shoes`, `jackets`)
- **image**: Ruta a la imagen (relativa a `/public`)
- **isCustom**: Boolean que indica si es una prenda agregada por el usuario

## 🔧 API Endpoints

### GET `/api/garments`
Obtiene todas las prendas de la base de datos.

**Respuesta:**
```json
{
  "garments": [
    {"id":"s1","name":"Polo Blanco","category":"shirts","image":"/white-polo.png","isCustom":false},
    ...
  ]
}
```

### POST `/api/upload`
Sube una imagen y opcionalmente la registra como prenda.

**Parámetros (FormData):**
- `file`: Archivo de imagen (requerido)
- `isGarment`: "true" para guardar como prenda
- `garmentName`: Nombre de la prenda (si isGarment=true)
- `garmentCategory`: Categoría de la prenda (si isGarment=true)

**Respuesta:**
```json
{
  "success": true,
  "url": "/garments/1234567890_camisa.jpg"
}
```

## 💾 Funciones de Base de Datos (`lib/db.ts`)

### `getAllGarments()`
Lee todas las prendas del archivo.

### `addGarment(garment)`
Agrega una nueva prenda al archivo.

### `deleteGarment(id)`
Elimina una prenda por su ID.

### `getGarmentsByCategory(category)`
Filtra prendas por categoría.

## 🚀 Uso en el Frontend

```typescript
// Cargar todas las prendas
const response = await fetch('/api/garments')
const { garments } = await response.json()

// Agregar una prenda
const formData = new FormData()
formData.append('file', file)
formData.append('isGarment', 'true')
formData.append('garmentName', 'Camisa Azul')
formData.append('garmentCategory', 'shirts')

await fetch('/api/upload', {
  method: 'POST',
  body: formData
})
```

## 🎨 Responsividad

La aplicación está completamente optimizada para dispositivos móviles, tablets y desktop:

- **Móvil**: Layout de una columna, botones táctiles grandes
- **Tablet**: Layout de 2 columnas adaptativo
- **Desktop**: Layout completo con 3-5 columnas

### Clases CSS Responsivas
```css
/* Contenedor responsivo */
.container-responsive

/* Grid adaptativo */
.grid-responsive

/* Botones táctiles (min 44x44px) */
.touch-target

/* Textos responsivos */
.text-responsive-lg
.text-responsive-md

/* Espaciado adaptativo */
.section-padding
```

## 📱 Breakpoints
- **xs**: < 640px (móvil)
- **sm**: 640px - 768px (móvil grande)
- **md**: 768px - 1024px (tablet)
- **lg**: 1024px - 1280px (desktop)
- **xl**: > 1280px (desktop grande)

## ⚠️ Notas Importantes

1. **Persistencia**: Los datos se guardan en archivos de texto, no en una base de datos tradicional
2. **Concurrencia**: No hay manejo de concurrencia; para producción considera usar una BD real
3. **Imágenes**: Las imágenes se guardan en `public/garments/` y son accesibles públicamente
4. **Límites**: No hay límite de prendas, pero considera el rendimiento con muchos registros
5. **Backup**: Haz copias de seguridad de `data/garments.txt` regularmente

## 🔐 Seguridad

- Las imágenes son validadas antes de subirse
- Tamaño máximo de archivo: 10MB
- Solo se aceptan formatos de imagen
- Los nombres de archivo se sanitizan automáticamente
