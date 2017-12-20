var gulp = require('gulp');
var postcss = require('gulp-postcss');
var stripInlineComments = require('postcss-strip-inline-comments');
var scss = require('postcss-scss');
var concat = require('gulp-concat');
var bem = require('postcss-bem');
var nested = require('postcss-nested');
var opacity = function(css, opts) {
    css.eachDecl(function(decl) {
        if (decl.prop === 'opacity') {
            decl.parent.insertAfter(decl, {
                prop: '-ms-filter',
                value: '"progid:DXImageTransform.Microsoft.Alpha(Opacity=' + (parseFloat(decl.value) * 100) + ')"'
            });
        }
    });
};
var precss = require('precss');
var cssnano = require('cssnano');
var short = require('postcss-short');
var sorting = require('postcss-sorting');
var csslint = require('gulp-csslint');
var pug = require('gulp-pug');


// Сборка компонентов в полные файлы

gulp.task('com', function() {
    return gulp.src('./src/project/common.blocks/*/*.scss')
        .pipe(concat('project.css'))
        .pipe(gulp.dest('./src/'));
});

gulp.task('resp', function() {
    return gulp.src('./src/project/responsive.blocks/*/*.scss')
        .pipe(concat('project-responsive.css'))
        .pipe(gulp.dest('./src/'));
});

gulp.task('js-resp', function() {
    return gulp.src('./src/project/*/*/*/*.js')
        .pipe(concat('project-responsive.js'))
        .pipe(gulp.dest('./public/javascript'));
});


// Компиляция CSS

gulp.task('postcss', function() {
    var preprocessors = [
        precss,
    ]

    var processors = [
        bem,
        nested,
        opacity,
        short,
        sorting,
        stripInlineComments,
        cssnano({zindex: false})
    ];
    return gulp.src('./src/*.css')
        .pipe(postcss(preprocessors))
        .pipe(postcss(processors, { syntax: scss }))
        .pipe(gulp.dest('./public/css'));
});

// Вызов всех команд
gulp.task('css', ['com', 'resp', 'postcss']);
gulp.task('js', ['js-def', 'js-resp']);

// Компиляция html

gulp.task('html', function buildHTML() {
  return gulp.src('./src/pug/*.pug')
  .pipe(pug())
  .pipe(gulp.dest('./public'));
});

// CSS Линтер

gulp.task('lint', function() {
    gulp.src('./public/css/*.css')
        .pipe(csslint())
        .pipe(csslint.reporter());
});
