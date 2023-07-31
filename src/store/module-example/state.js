import { secureStorage } from "src/utils/secureStorage.js";
export default function () {
  return {
    local: secureStorage.getItem("token") !== null,
    logged: false,
    Token:""
  }
}
