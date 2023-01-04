import { createHash } from "crypto";

function md5Convert(text: string): string {
  return createHash("md5").update(text).digest("hex");
}

export default md5Convert;
