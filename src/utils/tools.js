import big from "big.js";

/**
 * 格式化数字，保留几位小数点,不会四舍五入，而是直接截取
 * @param num 原始数字/字符串
 * @param p 保留几位小数点 >=0
 * @returns string
 * */
export const toFixedPoint = (num, p) => {
  if (isNaN(num) || num === null) {
    return "--";
  }
  const str = big(num).toFixed(p + 1);
  return str.slice(0, str.length - 1);
};

/**
 * 格式化数字，自动保留所有小数位数
 * @param num 原始数字/字符串
 * @returns string
 * */
export const toFixedAuto = (num) => {
  return new big(num).toFixed();
};

/**
 * x是否比y大
 * @param x 数1
 * @param y 数2
 * @returns boolean
 */
export const isGt = (x, y) => {
  return new big(x).gt(y);
};

/**
 * x是否比y小
 * @param x 数1
 * @param y 数2
 * @returns boolean
 */
export const isLt = (x, y) => {
  return new big(x).lt(y);
};

/**
 * 除法
 * @param x 被除数
 * @param y 除数
 * @returns string
 */
export const div = (x, y) => {
  return new big(x).div(y);
};

export default {
  toFixedPoint,
  toFixedAuto,
  isGt,
  isLt,
  div,
};
