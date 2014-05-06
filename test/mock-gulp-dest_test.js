
var chai = require('chai'),
    File = require('vinyl'),
    path = require('path'),
    should = chai.should();

var mockGulpDest = require('../.');

describe('mock-gulp-dest', function() {
  describe('executed with a gulp or vinyl-fs instance', function() {
    it('should replace `dest` function on target', function() {
      var destFunc = function dest () {};
      var gulpMock = {dest: destFunc};
      mockGulpDest(gulpMock);
      gulpMock.dest.should.be.a('function');
      gulpMock.dest.should.not.equal(destFunc);
    });

    it('should be able to restore `dest` function on target', function() {
      var destFunc = function dest () {};
      var gulpMock = {dest: destFunc};
      var mock = mockGulpDest(gulpMock);
      mock.restore();
      gulpMock.dest.should.equal(destFunc);
    });
  });

  describe('cwd()', function() {
    it('should default to process.cwd() if cwd is not explicitly set', function() {
      var gulpMock = {dest: function () {}};
      var mock = mockGulpDest(gulpMock);
      should.not.exist(mock.cwd());
      gulpMock.dest('./test/');
      mock.cwd().should.equal(process.cwd());
    });

    it('should return given cwd when explicitly set', function() {
      var gulpMock = {dest: function () {}};
      var mock = mockGulpDest(gulpMock);
      should.not.exist(mock.cwd());
      gulpMock.dest('./test/', {cwd: __dirname});
      mock.cwd().should.equal(__dirname);
      mock.cwd().should.not.equal(process.cwd());
    });
  });

  describe('basePath()', function() {
    it('should return path for destination folder resolved from cwd', function() {
      var gulpMock = {dest: function () {}};
      var mock = mockGulpDest(gulpMock);
      should.not.exist(mock.basePath());
      gulpMock.dest('./test/');
      mock.basePath().should.equal(path.join(process.cwd(), 'test'));
      gulpMock.dest('./test/', {cwd: __dirname});
      mock.basePath().should.equal(path.join(__dirname, 'test'));
    });
  });

  describe('assertDestContains()', function() {
    it('should not throw an error if destination contains expected files', function(done) {
      var gulpMock = {dest: function () {}};
      var mock = mockGulpDest(gulpMock);
      var stream = gulpMock.dest('./test/');

      var file = new File({
        cwd: process.cwd(),
        base: process.cwd() + '/templates',
        path: process.cwd() + '/templates/test-file.js',
        contents: new Buffer('test')
      });

      stream.on('finish', function () {
        should.not.throw(function () {
          mock.assertDestContains('test-file.js');
        });
        done();
      });

      stream.write(file);

      stream.end();
    });

    it('should throw an error if destination does not contain given files', function(done) {
      var gulpMock = {dest: function () {}};
      var mock = mockGulpDest(gulpMock);
      var stream = gulpMock.dest('./test/');

      var file = new File({
        cwd: process.cwd(),
        base: process.cwd() + '/templates',
        path: process.cwd() + '/templates/test-file.js',
        contents: new Buffer('test')
      });

      stream.on('finish', function () {
        should.throw(function () {
          mock.assertDestContains('non-existing-test-file.js');
        });
        done();
      });

      stream.write(file);

      stream.end();
    });
  });

  describe('assertDestNotContains()', function() {
    it('should not throw an error if the destination does not contain certain files', function(done) {
      var gulpMock = {dest: function () {}};
      var mock = mockGulpDest(gulpMock);
      var stream = gulpMock.dest('./test/');

      var file = new File({
        cwd: process.cwd(),
        base: process.cwd() + '/templates',
        path: process.cwd() + '/templates/test-file.js',
        contents: new Buffer('test')
      });

      stream.on('finish', function () {
        should.not.throw(function () {
          mock.assertDestNotContains('non-existing-test-file.js');
        });
        done();
      });

      stream.write(file);

      stream.end();
    });

    it('should throw an error if the destination does contain given files', function(done) {
      var gulpMock = {dest: function () {}};
      var mock = mockGulpDest(gulpMock);
      var stream = gulpMock.dest('./test/');

      var file = new File({
        cwd: process.cwd(),
        base: process.cwd() + '/templates',
        path: process.cwd() + '/templates/test-file.js',
        contents: new Buffer('test')
      });

      stream.on('finish', function () {
        should.throw(function () {
          mock.assertDestNotContains('test-file.js');
        });
        done();
      });

      stream.write(file);

      stream.end();
    });
  });

});
