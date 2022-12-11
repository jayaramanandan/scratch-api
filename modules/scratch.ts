import fetch from "node-fetch";

import FeaturedItems from "../types/featuredItems";
import getHeaderValue from "./getHeaderValue";

class Scratch {
  private scratchSessionId: string = "";
  private csrfToken: string = "";

  public async checkUsernameExists(username: string): Promise<boolean> {
    const checkUsernameExistsResponse: any = await fetch(
      `https://api.scratch.mit.edu/accounts/checkusername/${username}/`,
      { method: "get" }
    );
    return (await checkUsernameExistsResponse.json()).msg === "username exists";
  }

  public async getFeaturedItems(): Promise<FeaturedItems> {
    const featuredItemsResponse: any = await fetch(
      "https://api.scratch.mit.edu/proxy/featured",
      { method: "get" }
    );
    return await featuredItemsResponse.json();
  }

  public async login(username: string, password: string) {
    if (!this.csrfToken) {
      const { headers }: any = await fetch(
        "https://scratch.mit.edu/csrf_token/",
        {
          method: "get",
        }
      );
      this.csrfToken = getHeaderValue(
        headers.raw()["set-cookie"][1],
        "scratchcsrftoken=",
        ";"
      );
    }

    const loginResponse: any = await fetch(
      "https://scratch.mit.edu/accounts/login/",
      {
        method: "post",
        body: JSON.stringify({ username, password, useMessages: true }),
        headers: {
          cookie: `scratchcsrftoken=${this.csrfToken}`,
          referer: "https://scratch.mit.edu/",
          "x-csrftoken": this.csrfToken,
          "x-requested-with": "XMLHttpRequest",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
        },
      }
    );

    this.scratchSessionId = getHeaderValue(
      loginResponse.headers.raw()["set-cookie"][0],
      `scratchsessionsid="`,
      `";`
    );
    //gets scratch session id
  }
}

export default Scratch;
