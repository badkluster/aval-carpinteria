import { ENV } from "../utils";

export function getDocumentsBySolicitud(id) {
  const accessToken = localStorage.getItem(ENV.JWT.ACCESS);

  const url = `${ENV.BASE_API}/documentMaster?owner=${id}`;

  const params = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  return fetch(url, params)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err.message;
    });
}

export function deleteDocument(id) {
  const accessToken = localStorage.getItem(ENV.JWT.ACCESS);

  const url = `${ENV.BASE_API}/documentMaster/${id}`;

  const params = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  return fetch(url, params)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err.message;
    });
}
