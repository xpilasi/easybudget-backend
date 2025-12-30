const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  // Solo aceptar GET
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const id = event.queryStringParameters.id;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing id parameter" }),
      };
    }

    // Obtener de Netlify Blob Storage
    const store = getStore("easybudget-shares");
    const data = await store.get(id, { type: "text" });

    if (!data) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Share not found or expired" }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: data,
    };
  } catch (error) {
    console.error("Error getting share:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
