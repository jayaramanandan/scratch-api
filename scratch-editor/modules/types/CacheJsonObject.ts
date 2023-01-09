interface CacheJsonObject {
  [spriteName: string]:
    | {
        [fileName: string]: string;
      }
    | number;

  length: number;
}

export default CacheJsonObject;
