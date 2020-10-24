"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _morgan = _interopRequireDefault(require("morgan"));

var _posts = _interopRequireDefault(require("./routes/posts"));

var _status = _interopRequireDefault(require("./routes/status"));

var _imageUploader = _interopRequireDefault(require("./imageUploader"));

var _imageProcessor = require("./imageProcessor");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _default(_x) {
  return _ref.apply(this, arguments);
}

function _ref() {
  _ref = _asyncToGenerator(function* (params) {
    var app = (0, _express.default)();
    app.use(_express.default.static(_path.default.join(__dirname, '../build')));
    app.use((0, _morgan.default)(':method :url :status :res[content-length] - :response-time ms'));
    app.use(_express.default.json());
    app.use(_express.default.urlencoded({
      extended: false
    }));
    app.use('/api/posts', (0, _posts.default)({
      upload: _imageUploader.default.uploadPosts,
      uploadsDir: _imageUploader.default.fullPostsDir,
      allPosts: _imageUploader.default.allPosts
    }));
    app.use('/api/status', _status.default);
    app.get('/api/appName', (req, res) => {
      res.send({
        name: process.env.APP_NAME || "You didn't setup APP_NAME"
      });
    });
    app.get('/images/posts/:fileKey', /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(function* (req, res, next) {
        try {
          var imagePath = _path.default.join(_imageUploader.default.fullPostsDir, req.params.fileKey);

          var stream = yield (0, _imageProcessor.processImage)(imagePath); // const readStream = fs.createReadStream(imagePath)
          // console.log(imagePath)
          // stream.pipe(res)

          res.send(stream);
        } catch (error) {
          console.log(error);
          res.status(500).send({
            error: JSON.stringify(error)
          });
        }
      });

      return function (_x2, _x3, _x4) {
        return _ref2.apply(this, arguments);
      };
    }());
    app.get('*', (req, res) => {
      res.sendFile(_path.default.join(__dirname, '../build/index.html'));
    });
    return app;
  });
  return _ref.apply(this, arguments);
}