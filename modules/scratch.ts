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
    projectId: string | number
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
        body: JSON.stringify({
          targets: [
            {
              isStage: true,
              name: "Stage",
              variables: {
                "`jEk@4|i[#Fk?(8x)AV.-my variable": ["my variable", 0],
                "K%~eWG1/`(9|5,w21r(,": ["hi", 0],
              },
              lists: {},
              broadcasts: {},
              blocks: {
                "aHanuF?b28C?-PkVaYFy": {
                  opcode: "event_whenflagclicked",
                  next: "abeuguesfsgidrhgdrg",
                  parent: null,
                  inputs: {},
                  fields: {},
                  shadow: false,
                  topLevel: true,
                  x: 255,
                  y: 78,
                },
                abeuguesfsgidrhgdrg: {
                  opcode: "looks_cleargraphiceffects",
                  next: null,
                  parent: "aHanuF?b28C?-PkVaYFy",
                  inputs: {},
                  fields: {},
                  shadow: false,
                  topLevel: false,
                },
              },
              comments: {},
              currentCostume: 0,
              costumes: [
                {
                  name: "backdrop1",
                  dataFormat: "svg",
                  assetId: "cd21514d0531fdffb22204e0ec5ed84a",
                  md5ext: "cd21514d0531fdffb22204e0ec5ed84a.svg",
                  rotationCenterX: 240,
                  rotationCenterY: 180,
                },
              ],
              sounds: [
                {
                  name: "pop",
                  assetId: "83a9787d4cb6f3b7632b4ddfebf74367",
                  dataFormat: "wav",
                  format: "",
                  rate: 48000,
                  sampleCount: 1123,
                  md5ext: "83a9787d4cb6f3b7632b4ddfebf74367.wav",
                },
              ],
              volume: 100,
              layerOrder: 0,
              tempo: 60,
              videoTransparency: 50,
              videoState: "on",
              textToSpeechLanguage: null,
            },
          ],
          monitors: [
            {
              id: "K%~eWG1/`(9|5,w21r(,",
              mode: "default",
              opcode: "data_variable",
              params: {
                VARIABLE: "hi",
              },
              spriteName: null,
              value: 0,
              width: 0,
              height: 0,
              x: 5,
              y: 5,
              visible: true,
              sliderMin: 0,
              sliderMax: 100,
              isDiscrete: true,
            },
          ],
          extensions: [],
          meta: {
            semver: "3.0.0",
            vm: "1.2.54",
            agent:
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
          },
        }), //this is static, make sure it is dynamic
      }
    );

    return "successful";
  }
}

export default Scratch;
