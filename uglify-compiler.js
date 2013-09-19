#!/usr/bin/env node
var uglifyJS = require('uglify-js');
var inData = [];
process.stdin.on('data', function(data) {
  inData.push(data);
});
process.stdin.on('end', function(data) {
  inData.push(data || '');
  try {
    var o = JSON.parse(inData.join(''));
  }
  catch(e) {
    process.stderr.write(inData);
    process.stderr.write('Invalid options j data.');
    return process.exit(1);
  }

  /*
    o.source
    o.sourceMap
    o.options
    o.file
    o.originalFile
  */
  try {
    var result = uglifyJS.minify(o.source, {
      fileName: o.originalFile,
      inSourceMap: o.sourceMap,
      outSourceMap: o.file + '.map',
      compress: o.options,
      output: {
        comments: function(node, comment) {
          if (comment.line == 1 && comment.col == 0)
            return true;
          else
            return false;
        }
      },
      fromString: true
    });
    process.stdout.write(JSON.stringify({
      source: result.code,
      sourceMap: result.map
    }));
    process.exit(0);
  }
  catch(e) {
    process.stderr.write(e);
    process.exit(1);
  }
});
process.stdin.resume();