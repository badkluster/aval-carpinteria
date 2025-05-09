import { ENV } from "../utils";

export async function obtenerEmpresa() {
  // const accessToken = localStorage.getItem(ENV.JWT.ACCESS);
  try {
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${accessToken}`,
      },
    };

    const url = `${ENV.BASE_API}/empresa`;

    const response = await fetch(url, params);
    const result = await response.json();

    return result;
  } catch (err) {
    return err;
  }
}

export async function crearEmpresa(data) {
  const accessToken = localStorage.getItem(ENV.JWT.ACCESS);

  try {
    const url = `${ENV.BASE_API}/empresa`;
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

export async function actualizarEmpresa(id, data) {
  const accessToken = localStorage.getItem(ENV.JWT.ACCESS);

  try {
    const url = `${ENV.BASE_API}/empresa/${id}`;
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
