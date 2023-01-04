function getStringNumber(text: string) {
  let stringNumber: number = 0;
  for (let char of text) stringNumber += char.charCodeAt(0);

  return stringNumber;
}

export default getStringNumber;
