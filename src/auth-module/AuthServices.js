import http from "../utils/http.js";
import { secureStorage } from "../utils/secureStorage.js";


class AuthServices {
  constructor() {}

  static checkIfHasToken() {
    return secureStorage.getItem("token") !== null;
  }

  static async login(email = "", password = "") {
    let user = {
      email,
      password,
      grant_type: process.env.VUE_APP_GRANT_TYPE,
      client_id: process.env.VUE_APP_CLIENT_ID,
      client_secret: process.env.VUE_APP_CLIENT_SECRET,
      scope: process.env.VUE_APP_SCOPE
    }
    var res = await http.post("login", {user});
    AuthServices.saveAccessToken(res.data);
    if(res){
      return res.data;
    }
  }

  static async register(email = "", password = "", fullname="", name="") {
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
    var res = await http.post("register", {user});
    AuthServices.saveAccessToken(res.data);
  }

  static saveAccessToken(tokenResponse) {
    secureStorage.setItem(
      "token",
      `${tokenResponse.type} ${tokenResponse.token}`
    );
    // Calcula expiración (si tu backend no la envía)
    const expiresInMs = 1 * 60 * 60 * 1000; // 2 horas
    const expiresAt = Date.now() + expiresInMs;
    secureStorage.setItem("expires_at", expiresAt);
  
    http.defaults.headers["Authorization"] = secureStorage.getItem("token"); 
  }

  static isTokenExpired() {
    const expiresAt = secureStorage.getItem("expires_at");
    if (!expiresAt) return true;
    return Date.now() > parseInt(expiresAt, 10);
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
