var gulp = require('gulp'),
connect = require('gulp-connect'),
sass = require('gulp-sass'),
autoprefixer = require('gulp-autoprefixer'),
minifyCSS = require('gulp-clean-css'),
uglify = require('gulp-uglify'),
minify = require('gulp-minify'),
concat = require('gulp-concat');

var startFolder = 'src/',
    finishFolder = 'dist/';


gulp.task('connect', function() {
connect.server({
    root: finishFolder,
    port: process.env.PORT || 8080,
    livereload: true,
    livereloadPort: 3000,
    middleware: function (connect) {
      return [connect().use("/bower_components", connect.static("bower_components"))];
    }
});
});

gulp.task('html', ['html-include'], function() {
gulp.src(startFolder + '**.html')
    .pipe(gulp.dest(finishFolder))
    .pipe(connect.reload());
});

gulp.task('html-include', function() {
return gulp.src(startFolder + 'modules/**/**/**.html')
    .pipe(gulp.dest(finishFolder + 'views/'));
});

gulp.task('sass', ['bower_styles','images'], function() {
return gulp.src(startFolder + 'css/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 20 versions'],
        cascade: false
    }))
    .pipe(concat('style.css'))
    .pipe(minifyCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(finishFolder + 'css/'))
    .pipe(connect.reload());
});

gulp.task('bower_styles', function() {
gulp.src([
        'bower_components/bootstrap/dist/css/bootstrap.min.css'
    ])
    .pipe(concat('bower_components.css'))
    .pipe(minifyCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(finishFolder + 'css/'));
});

gulp.task('images', function () {
gulp.src(startFolder + 'img/**/*')
    .pipe(gulp.dest(finishFolder + 'images/'));
});

gulp.task('js', function() {
gulp.src([
        startFolder + 'js/**/*.js'
    ])
    .pipe(concat('app.js'))
    // .pipe(minify())
    // .pipe(uglify())
    .pipe(gulp.dest(finishFolder + 'js/'))
    .pipe(connect.reload());

gulp.src([
        // libs js files
        'bower_components/jquery/dist/jquery.slim.min.js',
        'bower_components/popper.js/dist/umd/popper.min.js',
        'bower_components/bootstrap/dist/js/bootstrap.min.js',
        ])
    .pipe(concat('bower_components.js'))
    // .pipe(minify())
    // .pipe(uglify())
    .pipe(gulp.dest(finishFolder + 'js'));
});

gulp.task('watch', function() {
gulp.watch(startFolder + 'modules/**/**/**.html', ['html-include']);
gulp.watch(startFolder + '**.html', ['html']);
gulp.watch(startFolder + '**/**/**/**/**.js', ['js']);
gulp.watch(startFolder + 'css/**/**.*', ['sass']);
});

gulp.task('build', ['html', 'sass', 'js'], function() {

});
gulp.task('default', ['connect', 'watch', 'build']);