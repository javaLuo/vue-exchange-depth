import big from "big.js";
big.RM = 0;

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

  return new big(num).toFixed(p);
};

/**
 * 格式化数字，自动保留所有小数位数
 * @param num 原始数字/字符串
 * @returns string
 * */
export const toFixedAuto = (num) => {
  if (isNaN(num) || num === null) {
    return "--";
  }

  return new big(num).toFixed();
};

// 保留N位有效数字
export const toPrecision = (num, n) => {
  if (isNaN(num) || num === null) {
    return "--";
  }
  return big(num).toPrecision(n);
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

// 除法
export const div = (x, y) => {
  return new big(x).div(y);
};

// 加法
export const add = (x, y) => {
  return new big(x).plus(y);
};

// 转字符串
export const toStr = (num) => {
  return new big(num).toString();
};

export default {
  toFixedPoint,
  toFixedAuto,
  toPrecision,
  toStr,
  isGt,
  isLt,
  div,
  add,
};
