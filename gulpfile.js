var gulp = require('gulp');
$ = require('gulp-load-plugins')(); // Note the extra parens

gulp.task('default', ['minify', 'fix-template', 'fix-paths', 'add-headers']);

gulp.task('minify', ['clean'], function() {
    return gulp.src('src/templates/layout.src.tpl')
        .pipe($.usemin({
            assetsDir: 'public',
            css: [$.minifyCss(), 'concat'],
            js: [$.uglify(), 'concat']
        }))
        .pipe(gulp.dest('public'));
});

gulp.task('fix-template', ['minify'], function() {
    return gulp.src('public/layout.src.tpl')
        .pipe($.rimraf())
        .pipe($.rename("layout.tpl"))
        .pipe(gulp.dest('public/templates'));
});

gulp.task('fix-paths', ['minify'], function() {
    gulp.src('public/css/site.css')
        .pipe($.replace('../', '../bower_components/bootstrap/dist/'))
        .pipe(gulp.dest('public/css'));
});

gulp.task('add-headers', ['fix-template'], function() {
    gulp.src('src/templates/layout.tpl')
        .pipe($.header("<!-- This file is generated — do not edit by hand! -->\n"))
        .pipe(gulp.dest('src/templates'));

    gulp.src('public/js/site.js')
        .pipe($.header("/* This file is generated — do not edit by hand! */\n"))
        .pipe(gulp.dest('public/js'));

    gulp.src('public/css/site.css')
        .pipe($.header("/* This file is generated — do not edit by hand! */\n"))
        .pipe(gulp.dest('public/css'));
});

gulp.task('clean', function() {
    var generated = ['public/js/site.js', 'public/css/site.css', 'src/templates/layout.tpl'];
    return gulp.src(generated)
        .pipe($.rimraf());
});

gulp.task('dev', ['clean'], function() {
    gulp.src('src/templates/layout.src.tpl')
        .pipe($.rename('layout.tpl'))
        .pipe($.header("<!-- This file is generated — do not edit by hand! -->\n"))
        .pipe(gulp.dest('src/templates'));
});

gulp.task('watch', ['default'], function() {
    var watchFiles = [
        'src/templates/layout.src.tpl',
        'public/bower_components/*/dist/js/*.js',
        '!public/bower_components/*/dist/js/*.min.js',
        'public/bower_components/*/dist/*.js',
        'public/bower_components/*/dist/css/*.css',
        '!public/bower_components/*/dist/css/*.min.css',
        'public/bower_components/*/dist/font/*'
    ];

    gulp.watch(watchFiles, ['default']);
});
