function getHeaderValue(
  value: string,
  valueName: string,
  breakValue: string
): string {
  if (breakValue.length < 1 || breakValue.length > 2)
    throw new Error(
      "Break Value must be maximum length of 2 and minimum length of 1"
    );

  let readerValue: string = "";

  for (let i: number = 0; i < value.length; i++) {
    if (readerValue === valueName) readerValue = "";
    else if (value[i] == breakValue || value[i] + value[i + 1] == breakValue)
      return readerValue;
    readerValue += value[i];
  }
  return "could not find";
}

export default getHeaderValue;
