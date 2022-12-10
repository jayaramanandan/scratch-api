import get, { AxiosResponse } from "axios";
import FeaturedItems from "../types/featuredItems";

class Scratch {
  public async checkUsernameExists(username: string): Promise<boolean> {
    const { data }: AxiosResponse<any, any> = await get(
      `https://api.scratch.mit.edu/accounts/checkusername/${username}/`
    );
    return data.msg === "username exists";
  }

  public async getFeaturedItems(): Promise<FeaturedItems> {
    const { data }: AxiosResponse<any, any> = await get(
      "https://api.scratch.mit.edu/proxy/featured"
    );
    return data;
  }
}

export default Scratch;
