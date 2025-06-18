const SERVER_IP =
  process.env.REACT_APP_API_URL || "https://aval-backend.onrender.com";

export const ENV = {
  BASE_PATH: process.env.BASE_PATH || `${SERVER_IP}`,
  BASE_API: process.env.BASE_API || `${SERVER_IP}/api`,
  API_ROUTES: {
    REGISTER: "auth/register",
    LOGIN: "auth/login",
    REFRESH_ACCESS_TOKEN: "auth/refresh_access_token",
    USER_ME: "user/me",
    USER: "user",
    USERS: "users",
    MENU: "menu",
  },
  JWT: {
    ACCESS: "accessTokenCA",
    REFRESH: "refreshTokenCA",
  },
  LOCALSTORAGE: {
    USER: "user",
    USERID: "userid",
    USERNAME: "displayName",
    TOKEN_NOTIFICATION: "tokenNotification",
  },
  THEME_COLORS: {
    GRIS: "#62625d",
    AZUL: "#1954A5",
    CELESTE: "#4C8FE2",
    SECONDARY: "rgb(9, 113, 151)",
    DISABLED_TEXT: "#a9a9a9",
    TEXT: "#ffff",
    DISABLED: "#d3d3d3",
    DANGER: "rgb(203,88,88)",
    VERDE: "#008f39",
    VERDE_SUAVE: "#ebf3e7",
    BLANCO: "#fff",
    MARRON: "#8B5E3C",
  },
};

export const ACTION_BUTTONS = {
  EDIT: "edit",
  EDITCOMPLETE: "editComplete",
  EMAIL: "email",
  WHATSAPP: "whatsApp",
  PHONECALL: "phoneCall",
  FOLLOWUP: "followUp",
  NEWTASK: "newTask",
  DELETE: "delete",
  CANCEL: "cancel",
  DOWNLOAD: "download",
  DESVINCULATE: "desvinculate",
  VIEWPROFILE: "viewProfile",
  VINCULATE: "vinculate",
  SENDBYEMAIL: "sendByEmail",
  SEEDETAIL: "seeDetail",
  CLONAR: "clonar",
  CLOSE: "close",
  SAVE: "save",
  COMPLETEACTIVITY: "completeActivity",
  ACTIVITY: "activity",
};

export const WHATSAPP_NUMBER = "5492216274033";
