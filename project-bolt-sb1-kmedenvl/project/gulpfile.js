const gulp = require('gulp');
const less = require('gulp-less');
const cssnano = require('gulp-cssnano');
const browserSync = require('browser-sync').create();

// Compile Less to CSS and minify
function styles() {
    return gulp.src('./src/styles/*.less')
        .pipe(less())
        .pipe(cssnano())
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
}

// Start BrowserSync server
function serve() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    // Watch for file changes
    gulp.watch('./src/styles/*.less', styles);
    gulp.watch('./*.html').on('change', browserSync.reload);
}

// Build task
const build = gulp.series(styles);

// Default task
exports.default = gulp.series(styles, serve);
exports.build = build;
exports.styles = styles;