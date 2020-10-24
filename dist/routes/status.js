"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _express = _interopRequireDefault(require("express"));

var ec2Meta = _interopRequireWildcard(require("../ec2Meta"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _default(_ref) {
  var {
    s3
  } = _ref;

  var router = _express.default.Router();

  router.get('/s3', /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(function* (req, res) {
      try {
        var buckets = yield s3.listBuckets();
        res.status(500).send({
          error: "Your IAM role can do too much"
        }); // const acl = await s3.getBucketAcl()
        // res.send({buckets, objects, acl})
      } catch (error) {
        // res.status(500).send({error})
        try {
          var objects = yield s3.listObjects();
          res.send({
            objects
          });
        } catch (error) {
          res.status(500).send({
            error
          });
        }
      }
    });

    return function (_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }());
  router.get('/', /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(function* (req, res) {
      var ec2 = {};

      try {
        ec2.ipv4 = yield ec2Meta.ipv4();
        ec2.hostname = yield ec2Meta.hostname();
        ec2.instanceId = yield ec2Meta.instanceId();
        ec2.iam = yield ec2Meta.iam();
      } catch (err) {
        console.log(err);
        ec2 = "error";
      }

      var other = {};
      var data = {
        ec2,
        env: {
          bucket_region: process.env.BUCKET_REGION,
          bucket_name: process.env.BUCKET_NAME,
          app_name: process.env.APP_NAME
        },
        other
      };
      console.log(data);
      res.send(data);
    });

    return function (_x3, _x4) {
      return _ref3.apply(this, arguments);
    };
  }());
  return router;
}