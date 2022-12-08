import fetch from "node-fetch";

class Scratch {
  public async getProjects(): Promise<any> {
    const res = await fetch("https://scratch.mit.edu/site-api/projects/all/", {
      headers: { method: "GET" },
    });
    return;
  }
}

export default Scratch;
