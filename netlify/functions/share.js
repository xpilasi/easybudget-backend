const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  // Solo aceptar POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body);

    // Validar datos
    if (!data.name || !data.products || !Array.isArray(data.products)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid data" }),
      };
    }

    // Generar ID único
    const id = generateId();

    // Guardar en Netlify Blob Storage
    const store = getStore("easybudget-shares");
    await store.set(id, JSON.stringify(data), {
      metadata: {
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
      },
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        success: true,
        id: id,
        url: `https://easybudget.xpilasi.com/share/${id}`,
      }),
    };
  } catch (error) {
    console.error("Error saving share:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};

function generateId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}
