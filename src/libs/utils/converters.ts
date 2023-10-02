import { DeepImmutableObject, Vector3 } from 'babylonjs';

export function toVector3(positions: Record<string, string[]>) {
  let result: Record<string, Vector3 | Vector3[]> = {};
  const posKeys = Object.keys(positions);
  const posValuesStr: string[][] = Object.values(positions);
  const posValuesNum = toNumberArray(posValuesStr, []);

  const posValues = posValuesNum.map((value) => {
    let vec: Vector3 | Vector3[];
    if (Array.isArray(value[0])) {
      vec = value.map((arr: DeepImmutableObject<ArrayLike<number>>) =>
        Vector3.FromArray(arr)
      );
    } else {
      vec = Vector3.FromArray(value);
    }
    return vec;
  });
  for (let i = 0; i <= posKeys.length; i++) {
    if (posValues[i]) {
      result[posKeys[i]] = posValues[i];
    }
  }
  return result;
}

export function toNumberArray(
  initArr: string[][] | string[][][],
  resultArr: any[]
): any[] {
  initArr.forEach((arr) => {
    const convertedArr = arr.map((elem) => {
      let arr: number | number[];
      if (typeof elem === 'string') {
        arr = parseFloat(elem);
      } else {
        arr = elem.map((n) => parseFloat(n));
      }
      return arr;
    });
    resultArr.push(convertedArr);
  });
  return resultArr;
}

export function radiansToDegrees(radians: number) {
  return radians * (180 / Math.PI);
}
