import { ENV } from "../utils";

export async function obtenerListaHeaders() {
  // const accessToken = localStorage.getItem(ENV.JWT.ACCESS);
  try {
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${accessToken}`,
      },
    };

    const url = `${ENV.BASE_API}/header`;

    const response = await fetch(url, params);
    const result = await response.json();

    return result;
  } catch (err) {
    return err;
  }
}

export async function crearHeader(data) {
  const accessToken = localStorage.getItem(ENV.JWT.ACCESS);

  try {
    const url = `${ENV.BASE_API}/header`;
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

export async function actualizarHeader(id, data) {
  const accessToken = localStorage.getItem(ENV.JWT.ACCESS);

  try {
    const url = `${ENV.BASE_API}/header/${id}`;
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

export async function obtenerHeaderporID(id) {
  const accessToken = localStorage.getItem(ENV.JWT.ACCESS);

  try {
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
    };

    const url = `${ENV.BASE_API}/header/${id}`;

    const response = await fetch(url, params);
    const result = await response.json();

    return result;
  } catch (err) {
    return err;
  }
}

export async function eliminarHeader(id) {
  const accessToken = localStorage.getItem(ENV.JWT.ACCESS);

  try {
    const url = `${ENV.BASE_API}/header/${id}`;

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

export async function obtenerRegistrosActivos() {
  // const accessToken = localStorage.getItem(ENV.JWT.ACCESS);
  try {
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${accessToken}`,
      },
    };

    const url = `${ENV.BASE_API}/obtenerRegistrosActivos`;

    const response = await fetch(url, params);
    const result = await response.json();

    return result;
  } catch (err) {
    return err;
  }
}
