import { ENV } from "../utils";

export async function obtenerListaProductos(page, limit, filters = {}) {
  const accessToken = localStorage.getItem(ENV.JWT.ACCESS);
  try {
    let queryParams = `page=${page}&limit=${limit}`;
    Object.keys(filters).forEach((key) => {
      queryParams += `&${encodeURIComponent(key)}=${encodeURIComponent(
        JSON.stringify(filters[key])
      )}`;
    });
    const url = `${ENV.BASE_API}/producto?${queryParams}`;
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await fetch(url, params);
    const result = await response.json();
    return result;
  } catch (err) {
    return err;
  }
}

export async function obtenerFiltrosDisponiblesParaProductos() {
  try {
    const url = `${ENV.BASE_API}/obtenerFiltrosDisponiblesParaProductos`;
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, params);
    const result = await response.json();
    return result;
  } catch (err) {
    return err;
  }
}

export async function obtenerListaCatalogoProductos(
  page = 1,
  limit = 10,
  filters = {}
) {
  try {
    // Construcción de los parámetros de la URL
    const queryParams = new URLSearchParams();

    if (page) queryParams.append("page", page);
    if (limit) queryParams.append("limit", limit);

    // Agregar filtros dinámicamente
    Object.keys(filters).forEach((key) => {
      queryParams.append(key, JSON.stringify(filters[key]));
    });

    const url = `${
      ENV.BASE_API
    }/listCatalogoProductos?${queryParams.toString()}`;

    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Llamada a la API
    const response = await fetch(url, params);
    if (!response.ok)
      throw new Error(`Error: ${response.status} - ${response.statusText}`);

    const result = await response.json();
    return result;
  } catch (err) {
    console.error("Error al obtener la lista de productos del catálogo:", err);
    throw err; // O maneja el error como prefieras
  }
}

export async function crearProducto(data) {
  const accessToken = localStorage.getItem(ENV.JWT.ACCESS);

  try {
    const url = `${ENV.BASE_API}/producto`;
    const params = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, params);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.msg || "Error al crear el registro");
    }

    return result;
  } catch (error) {
    throw error;
  }
}

export async function actualizarProducto(id, data) {
  const accessToken = localStorage.getItem(ENV.JWT.ACCESS);

  try {
    const url = `${ENV.BASE_API}/producto/${id}`;
    const params = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, params);
    const result = await response.json();

    if (response.status !== 200) throw result;

    return result;
  } catch (error) {
    throw error;
  }
}

export async function incrementarInteraccion(id) {
  const accessToken = localStorage.getItem(ENV.JWT.ACCESS);

  try {
    const url = `${ENV.BASE_API}/incrementarInteraccion/${id}`;
    const params = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, params);
    const result = await response.json();

    if (response.status !== 200) throw result;

    return result;
  } catch (error) {
    throw error;
  }
}

export async function obtenerProductoporID(id) {
  const accessToken = localStorage.getItem(ENV.JWT.ACCESS);

  try {
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
    };

    const url = `${ENV.BASE_API}/producto/${id}`;

    const response = await fetch(url, params);
    const result = await response.json();

    return result;
  } catch (err) {
    return err;
  }
}

export async function eliminarProducto(id) {
  const accessToken = localStorage.getItem(ENV.JWT.ACCESS);

  try {
    const url = `${ENV.BASE_API}/producto/${id}`;

    const params = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await fetch(url, params);
    const result = await response.json();

    if (response.status !== 200) throw result;

    return result;
  } catch (error) {
    throw error;
  }
}

export async function eliminarImagenProducto(id, imagen) {
  const accessToken = localStorage.getItem(ENV.JWT.ACCESS);

  try {
    const url = `${ENV.BASE_API}/deleteImagenProducto`;

    const params = {
      method: "PUT",
      body: JSON.stringify({
        productId: id,
        imageName: imagen,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await fetch(url, params);
    const result = await response.json();

    if (response.status !== 200) throw result;

    return result;
  } catch (error) {
    throw error;
  }
}

export async function eliminarPdfProducto(id, pdf) {
  const accessToken = localStorage.getItem(ENV.JWT.ACCESS);

  try {
    const url = `${ENV.BASE_API}/deletePdfProducto`;

    const params = {
      method: "PUT",
      body: JSON.stringify({
        productId: id,
        pdfName: pdf,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await fetch(url, params);
    const result = await response.json();

    if (response.status !== 200) throw result;

    return result;
  } catch (error) {
    throw error;
  }
}

export async function obtenerProductosPorCategoria(categoryId) {
  try {
    const url = `${ENV.BASE_API}/listProductosByCategory?categoryId=${categoryId}`;
    const response = await fetch(url);
    const result = await response.json();
    return result;
  } catch (err) {
    return err;
  }
}
