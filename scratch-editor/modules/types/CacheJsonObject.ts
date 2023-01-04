interface CacheJsonObject {
  [spriteName: string]: {
    [costumeFileName: string]: string | number;
    costumesNumber: number;
  };
}

export default CacheJsonObject;
