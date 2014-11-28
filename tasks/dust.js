/*
 * dustjs-concat
 *
 *
 * Copyright (c) 2014 Luke Chapman
 * Licensed under the MIT license.
 */

'use strict';

var dust = require('dustjs-linkedin');

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('dust', 'Dust JS compiler and concat for creating a single file of templates to load into a client side app.', function () {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      separator: '\n\n'
    });

    // Iterate over all specified file groups.
    this.files.forEach(function (file) {
      // Concat specified files.
      var src = file.src.filter(function (filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function (filepath) {
        // Read file source.
        return 'dust.loadSource(' + dust.compile(grunt.file.read(filepath)) + ')';
      }).join(grunt.util.normalizelf(options.separator));

      // Handle options.
      src = 'require([\'dust\'], function (dust) {\n' + src + '\n});';

      // Write the destination file.
      grunt.file.write(file.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + file.dest + '" created.');
    });
  });

};
