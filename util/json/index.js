'use strict';

exports.isJSON = function (value) {
  try {
    JSON.stringify(value);
    return true;
  } catch (ex) {
    return false;
  }
};

exports.isJSONString = function (value) {
  try {
    if (typeof value === "string") {
      JSON.parse(value);
    }
    return true;
  } catch (ex) {
    return false;
  }
};
