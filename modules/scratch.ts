import fetch, { Response } from "node-fetch";

import FeaturedItems from "../types/FeaturedItems";
import Project from "../types/Project";
import {
  ProjectDetails,
  ProjectGeneralDetails,
  ProjectEditorDetails,
} from "../types/ProjectDetails";
import UserLoginResponse from "../types/UserLoginResponse";

import getHeaderValue from "./getHeaderValue";

class Scratch {
  private scratchSessionId: string = "";
  private csrfToken: string = "";
  private userToken: string = "";

  public async checkUsernameExists(username: string): Promise<boolean> {
    const checkUsernameExistsResponse: Response = await fetch(
      `https://api.scratch.mit.edu/accounts/checkusername/${username}/`,
      { method: "get" }
    );
    return (await checkUsernameExistsResponse.json()).msg === "username exists";
  }

  public async getFeaturedItems(): Promise<FeaturedItems> {
    const featuredItemsResponse: Response = await fetch(
      "https://api.scratch.mit.edu/proxy/featured",
      { method: "get" }
    );
    return await featuredItemsResponse.json();
  }

  public async login(username: string, password: string) {
    if (!this.csrfToken) {
      const { headers }: Response = await fetch(
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

    if (this.csrfToken == "could not find") {
      throw new Error("Failed to login");
    }

    const loginResponse: Response = await fetch(
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
    if (this.scratchSessionId == "could not find") {
      throw new Error("Failed to login");
    }

    const userLoginData: UserLoginResponse[] = await loginResponse.json();
    this.userToken = userLoginData[0].token;
  }

  public async getProjects(): Promise<Project[]> {
    const projectsResponse: Response = await fetch(
      "https://scratch.mit.edu/site-api/projects/all/",
      {
        method: "get",
        headers: { cookie: `scratchsessionsid="${this.scratchSessionId}"` },
      }
    );

    return await projectsResponse.json();
  }

  public async getProjectDetails(
    projectId: number | string
  ): Promise<ProjectDetails> {
    const projectGeneralDetailsResponse: Response = await fetch(
      `https://api.scratch.mit.edu/projects/${projectId}/`,
      {
        method: "get",
        headers: { "x-token": this.userToken },
      }
    );
    const projectGeneralDetails: ProjectGeneralDetails =
      await projectGeneralDetailsResponse.json();

    const projectEditorDetailsResponse: Response = await fetch(
      `https://projects.scratch.mit.edu/${projectId}?token=${projectGeneralDetails.project_token}`,
      {
        method: "get",
      }
    );
    const projectEditorDetails: ProjectEditorDetails =
      await projectEditorDetailsResponse.json();

    return { projectGeneralDetails, projectEditorDetails };
  }

  public async saveProject(
    projectId: string | number,
    saveJson: any
  ): Promise<"successful" | "fail"> {
    const saveProjectResponse: Response = await fetch(
      `https://projects.scratch.mit.edu/${projectId}/`,
      {
        method: "put",
        headers: {
          cookie: `scratchsessionsid="${this.scratchSessionId}"; scratchcsrftoken=${this.csrfToken}`,
          origin: "https://scratch.mit.edu",
          referer: "https://scratch.mit.edu/",
          "content-type": "application/json",
        },
        body: JSON.stringify(saveJson), //this is static, make sure it is dynamic
      }
    );

    return saveProjectResponse.ok ? "successful" : "fail";
  }
}

export default Scratch;
