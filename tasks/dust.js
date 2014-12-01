/*
 * grunt-dustjs-concat
 *
 *
 * Copyright (c) 2014 Luke Chapman
 * Licensed under the MIT license.
 */

'use strict';

var dust = require('dustjs-linkedin');
var path = require('path');

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
            var src = file.src.map(function (filepath) {
                    return {
                        path: file.orig.cwd ? file.orig.cwd + filepath : filepath,
                        name: filepath.replace(path.extname(filepath), '')
                    };
                }).filter(function (file) {
                    // Warn on and remove invalid source files (if nonull was set).
                    if (!grunt.file.exists(file.path)) {
                        grunt.log.warn('Source file "' + file.path + '" not found.');
                        return false;
                    } else {
                        return true;
                    }
                }).map(function (file) {
                    // Read file source.
                    return 'dust.loadSource(' + dust.compile(grunt.file.read(file.path), file.name) + ')';
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
