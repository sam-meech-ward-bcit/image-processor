"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processImage = processImage;

var _jimp = _interopRequireDefault(require("jimp"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function processImage(_x) {
  return _processImage.apply(this, arguments);
}

function _processImage() {
  _processImage = _asyncToGenerator(function* (imagePath) {
    var composite = yield _jimp.default.read(_path.default.join(__dirname, '../public/jazz.png'));
    composite.flip(true, false) // .posterize(100)
    .resize(200, 200);
    var image = yield _jimp.default.read(imagePath);
    image.flip(true, false).invert().contrast(1).posterize(100).greyscale() // set greyscale
    .pixelate(10).background(0xFF5733).blit(composite, 0, 0);
    return yield image.getBufferAsync(_jimp.default.MIME_JPEG);
  });
  return _processImage.apply(this, arguments);
}