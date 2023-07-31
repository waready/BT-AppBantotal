import http from "../utils/http.js";
import { secureStorage } from "../utils/secureStorage.js";
var prefijo = process.env.VUE_APP_API_PREFIJO;
var version = process.env.VUE_APP_API_VERSION;

class AuthServices {
  constructor() { }

  static checkIfHasToken() {
    return secureStorage.getItem("token") !== null;
  }

  static async login(username = "", password = "") {
    try {
      let user = {
        Btinreq: {
          Requerimiento: 1,
          Device: 1,
          Token: "?",
          Usuario: username,
          //Canal: "BTVISION"
          Canal: "BTDIGITAL"
        },
        UserId: username,
        UserPassword: password
      };
      var res = await http.post(
        "com.dlya.bantotal." + prefijo + "_Authenticate_" + version + "?Execute",
        user);
      AuthServices.saveAccessToken(res.data.SessionToken);
      return {
        success: true,
        data: res.data,
        message: ""
      };
    } catch (e) {
      return {
        success: false,
        message: "Error en la autenticacion: " + e
      };
    } finally {
      //
    }
  }

  static async register(email = "", password = "", fullname = "", name = "") {
    let user = {
      email,
      password,
      fullname,
      name,
      grant_type: process.env.VUE_APP_GRANT_TYPE,
      client_id: process.env.VUE_APP_CLIENT_ID,
      client_secret: process.env.VUE_APP_CLIENT_SECRET,
      scope: process.env.VUE_APP_SCOPE
    }
    var res = await http.post("register", { user });
    AuthServices.saveAccessToken(res.data);
  }

  static saveAccessToken(tokenResponse) {
    secureStorage.setItem(
      "token",
      `${tokenResponse.type} ${tokenResponse.token}`
    );
    http.defaults.headers["Authorization"] = secureStorage.getItem("token");
  }

  static removeToken() {
    localStorage.clear();
    sessionStorage.clear();
  }

  static logout() {
    AuthServices.removeToken();
  }
}

export default AuthServices;
export { AuthServices };