
var chai = require('chai');

chai.should();

var filesFromTree = require('../lib/files-from-tree');

describe('files-from-tree', function() {
  it('should keep arrays as is', function() {
    var files = [
      'my-file.js',
      'my-file2.js',
      'my-dir/my-file3.js'
    ];
    filesFromTree(files).should.eql(files);
  });

  it('should return strings as an array', function() {
    var file = 'my-file.js';
    filesFromTree(file).should.eql([file]);
  });

  it('should build paths from an object heirarchy', function() {
    var files = {
      'my-dir': {
        'another-dir': [
          'file1.js',
          'file2.js'
        ],
        'third-dir': [
          'file3.js'
        ]
      }
    };
    filesFromTree(files).should.eql([
      'my-dir/another-dir/file1.js',
      'my-dir/another-dir/file2.js',
      'my-dir/third-dir/file3.js'
    ]);
  });

  it('should treat dir `_` as current directory in an object heirarchy', function() {
    var files = {
      'my-dir': {
        'another-dir': [
          'file1.js',
          'file2.js'
        ],
        'third-dir': [
          'file3.js'
        ],
        _: [
          'my-dir-file.md'
        ]
      },
      _: [
        'root-file.txt'
      ]
    };
    filesFromTree(files).should.eql([
      'my-dir/another-dir/file1.js',
      'my-dir/another-dir/file2.js',
      'my-dir/third-dir/file3.js',
      'my-dir/my-dir-file.md',
      'root-file.txt'
    ]);
  });
});
