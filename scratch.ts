import get, { AxiosResponse } from "axios";

class Scratch {
  public async login(): Promise<boolean> {
    const res: AxiosResponse<any, any> = get("https://scratch.mit.edu/csrf_token/", {
      headers:{
        "Cookie": "_ga=GA1.3.155267336.1670589494; _gid=GA1.3.1776564626.1670589494; permissions=%7B%7D"
      }
    })
    
    console.log(res)
  }
}
