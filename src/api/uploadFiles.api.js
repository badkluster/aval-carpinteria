import { ENV } from "../utils";

export async function createUploadFile(file) {
  try {
    const contentType = file.type;
    const nameFile = file.name;

    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const url = `${ENV.BASE_API}/uploadFile?name=${nameFile}&contentType=${contentType}`;

    const responsePromise = await fetch(url, params);
    const response = await responsePromise.json();

    const { signedUrl } = response.data;

    await fetch(signedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": `${contentType}`,
      },
    });

    const urlData = signedUrl;
    const result = urlData.split("?");

    return { state: "ok", url: result[0] };
  } catch (err) {
    return err;
  }
}

export async function createUploadFiles(files, dataBody, tokened) {
  const token = localStorage.getItem(ENV.JWT.ACCESS);

  try {
    let uploadedFiles = [];

    if (token) {
      for (const file of files) {
        const contentType = file.type;
        const nameFile = file.path;
        const fileExtension = nameFile.split(".").pop();
        const documentType = dataBody.typeDocument;
        let body = dataBody;

        body.size = file.size || "";
        body.archiveType = fileExtension || "";

        const params = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify(body),
        };

        const url = `${ENV.BASE_API}/files?name=${nameFile}&contentType=${contentType}&documentType=${documentType}`;

        const responsePromise = await fetch(url, params);
        const response = await responsePromise.json();

        const { signedUrl } = response.data; // Recibe la URL del archivo

        // Subir el archivo a S3
        await fetch(signedUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": `${contentType}`,
          },
        });

        const urlData = signedUrl;
        const result = urlData.split("?");
        // Guardar el nombre y la URL del archivo en el array
        uploadedFiles.push({
          name: nameFile,
          url: result[0], // URL de S3
        });
      }

      return uploadedFiles; // Devuelve un array de los archivos subidos con nombre y URL
    } else {
      // similar tokened logic (omitted for brevity)
      return uploadedFiles;
    }
  } catch (err) {
    console.error("Error uploading files:", err);
    return [];
  }
}
