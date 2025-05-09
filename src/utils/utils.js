export function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLocaleLowerCase());
}

export function formatToARS(amount) {
  // Intenta convertir el valor a número
  const numericAmount = parseFloat(amount);

  // Verifica si el resultado es NaN (no es un número válido)
  if (isNaN(numericAmount)) {
    return "No es un número válido";
  }

  // Formatea el número en estilo de moneda ARS
  const formattedAmount = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(numericAmount);

  return formattedAmount;
}

export function validatePassword(password) {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (
    password?.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers
    // hasSpecialChar
  ) {
    return true;
  } else {
    return false;
  }
}

export const extractUniqueActivityObjects = (aircrafts) => {
  const activityMap = new Map();

  aircrafts.forEach((aircraft) => {
    aircraft.prices.forEach((price) => {
      const activity = price.typeOfActivityId;
      if (!activityMap.has(activity._id)) {
        activityMap.set(activity._id, activity);
      }
    });
  });

  return Array.from(activityMap.values());
};

export const getDocumentTypeCode = async (formValuess) => {
  switch (formValuess?.tipoSolicitud?.code) {
    case "RENOVACION":
      return "RENOV";
    case "COTIZACION":
      return "COT";
    case "RECVARIAS":
      return "RECL";
    case "SINIESTRO":
      return "SIN";
    case "EMISION":
      return "EMI";
    case "RECEMI":
      return "RECL";
    case "COBRANZA":
      return "COB";
    case "ANULACION":
      return "POL";
    case "ENDOSO":
      return "END";
    default:
      return "VAR";
  }
};
