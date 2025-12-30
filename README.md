# EasyBudget Backend - Netlify Functions

Backend para el sistema de deep linking de EasyBudget.

## Despliegue Rápido

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Deploy en Netlify

#### Opción A: Netlify CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

#### Opción B: GitHub + Netlify

1. Crear repositorio en GitHub
2. Push este código
3. Ir a Netlify Dashboard
4. "Add new site" → "Import from Git"
5. Seleccionar el repo
6. Deploy automático

### 3. Configurar Dominio

1. En Netlify Dashboard → Domain settings
2. Add custom domain: `easybudget.xpilasi.com`
3. Netlify configurará automáticamente el CNAME

### 4. Actualizar Archivos de Verificación

**Android - assetlinks.json:**

1. Obtener SHA256 fingerprint:
   ```bash
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```

2. Copiar el SHA256 (sin los dos puntos)

3. Editar `public/.well-known/assetlinks.json` y reemplazar `REEMPLAZAR_CON_TU_SHA256_FINGERPRINT`

**iOS - apple-app-site-association:**

1. Obtener Team ID en https://developer.apple.com/account

2. Editar `public/.well-known/apple-app-site-association` y reemplazar `TEAM_ID`

3. Redeploy después de los cambios:
   ```bash
   netlify deploy --prod
   ```

## Endpoints

### POST /share

Guardar una lista compartida.

**Request:**
```json
{
  "name": "Lista de compras",
  "categoryName": "Supermercado",
  "currency": "$",
  "products": [
    {
      "name": "Leche",
      "price": 2.50,
      "quantity": 2
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "id": "Abc12XyZ",
  "url": "https://easybudget.xpilasi.com/share/Abc12XyZ"
}
```

### GET /share/:id

Obtener una lista compartida.

**Request:**
```
GET https://easybudget.xpilasi.com/share/Abc12XyZ
```

**Response:**
```json
{
  "name": "Lista de compras",
  "categoryName": "Supermercado",
  "currency": "$",
  "products": [...]
}
```

## Verificación

### Verificar archivos de verificación:

```bash
# Android
curl https://easybudget.xpilasi.com/.well-known/assetlinks.json

# iOS
curl https://easybudget.xpilasi.com/.well-known/apple-app-site-association
```

Ambos deben devolver JSON correctamente formateado.

## Storage

- **Netlify Blobs**: Almacenamiento key-value
- **Expiración**: 30 días automático
- **Límites**: Plan gratuito incluye generoso almacenamiento

## Troubleshooting

### Las functions no se ejecutan

- Verificar que `netlify.toml` esté en la raíz
- Verificar que `functions` apunte a `netlify/functions`

### CORS errors

- Los headers CORS ya están configurados en las functions
- Verificar que el dominio esté correcto

### Archivos .well-known no se sirven

- Verificar que estén en `public/.well-known/`
- Verificar configuración de headers en `netlify.toml`
