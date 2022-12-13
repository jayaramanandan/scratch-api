import fetch, { Response } from "node-fetch";

import FeaturedItems from "../types/featuredItems";
import Project from "../types/project";
import {
  ProjectDetails,
  ProjectGeneralDetails,
  ProjectEditorDetails,
} from "../types/projectDetails";
import UserLoginResponse from "../types/userLoginResponse";

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
}

export default Scratch;

const e = {
  extensions: [],
  meta: {
    agent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    semver: "3.0.0",
    vm: "1.2.54",
  },
  monitors: [],
  targets: [
    {
      blocks: {},
      broadcasts: {},
      comments: {},
      costumes: [
        {
          assetId: "cd21514d0531fdffb22204e0ec5ed84a",
          dataFormat: "svg",
          md5ext: "cd21514d0531fdffb22204e0ec5ed84a.svg",
          name: "backdrop1",
          rotationCenterX: 240,
          rotationCenterY: 180,
        },
      ],
      currentCostume: 0,
      isStage: true,
      layerOrder: 0,
      lists: {},
      name: "Stage",
      sounds: [
        {
          assetId: "83a9787d4cb6f3b7632b4ddfebf74367",
          dataFormat: "wav",
          format: "",
          md5ext: "83a9787d4cb6f3b7632b4ddfebf74367.wav",
          name: "pop",
          rate: 48000,
          sampleCount: 1123,
        },
      ],
      tempo: 60,
      textToSpeechLanguage: null,
      variables: { "`jEk@4|i[#Fk?(8x)AV.-my variable": ["my variable", 0] },
      videoState: "on",
      videoTransparency: 50,
      volume: 100,
    },
  ],
};
