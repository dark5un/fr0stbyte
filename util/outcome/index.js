'use strict';

exports.build = function (record, success, errors, errfor) {
  return {
    record: record ? record : {},
    success: success ? success : false,
    errors: errors ? errors : [],
    errfor: errfor ? errfor : {}
  };
};
