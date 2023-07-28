import http  from "./utils/http.js";

class ApiService {
  static async getUser() {
    return (await http.get("api/user")).data;
  }
  static async getCategorias(){
    return (await http.get("categorias")).data;
  }
  static async CreatePost(params){
    return (await http.post("scp-items", params )).data; 
  }
  static async GetPosts(){
    return (await http.get("scp-items")).data;
  }
}

export default ApiService;