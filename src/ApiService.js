import http from "src/utils/http.js";

// var version = process.env.VUE_APP_API_VERSION;
class ApiService {

  // inventario
  static async GetInventarios(data){
    return (await http.get("inventarios", {params:data} )).data;
  }

  static async SetInventario(id ,data){
    return (await http.put(`inventarios/${id}`, data)).data;
  }

  static async CreateInventario(data){
    return (await http.post("inventarios", data)).data;
  }

  static async DeleteInventario(id){
    return (await http.delete(`inventarios/${id}`)).data;
  }

// Sistemas
  static async GetSistemas(data){
    return (await http.get("sistemas", {params:data})).data;
  }

  static async SetSistemas(id ,data){
    return (await http.put(`sistemas/${id}`, data)).data;
  }

  static async CreateSistemas(data){
    return (await http.post("sistemas", data)).data;
  }

  static async DeleteSistemas(id){
    return (await http.delete(`sistemas/${id}`)).data;
  }

// Paices
  static async GetPaises(data){
    return (await http.get("paises", {params:data})).data;
  }

  static async SetPaises(id ,data){
    return (await http.put(`paises/${id}`, data)).data;
  }

  static async CreatePaises(data){
    return (await http.post("paises", data)).data;
  }

  static async DeletePaises(id){
    return (await http.delete(`paises/${id}`)).data;
  }

// Areas
  static async GetAreasFuncionales(data){
    return (await http.get("areas", {params:data})).data;
  }

  static async SetAreasFuncionales(id ,data){
    return (await http.put(`areas/${id}`, data)).data;
  }

  static async CreateAreasFuncionales(data){
    return (await http.post("areas", data)).data;
  }

  static async DeleteAreasFuncionales(id){
    return (await http.delete(`areas/${id}`)).data;
  }
}

export default ApiService;
