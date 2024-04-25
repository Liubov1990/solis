import gulp from 'gulp';
import { parallel, series } from 'gulp';
import babel from 'gulp-babel';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import gulpNunjucksRender from 'gulp-nunjucks-render';
import autoprefixer from 'gulp-autoprefixer';
import browserSync from 'browser-sync';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import gulpCopy from 'gulp-copy';

const sass = gulpSass(dartSass);

export const copy = function () {
  return gulp.src('src/assets/**/*').pipe(gulpCopy('dist'));
};

export const js = function () {
  return gulp
    .src('src/js/*js')
    .pipe(
      babel({
        presets: ['@babel/preset-env']
      })
    )
    .pipe(concat('index.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
};

export const css = function () {
  return gulp
    .src('src/scss/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(
      autoprefixer({
        browserlist: ['last 2 versions'],
        cascade: false
      })
    )
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
};

export const nunjucks = function () {
  return gulp
    .src('src/views/pages/*.+(html|nunjucks)')
    .pipe(
      gulpNunjucksRender({
        path: ['src/views/templates/']
      })
    )
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({ stream: true }));
};

export const nunjucksMinify = function () {
  return gulp
    .src('src/views/pages/*.+(html|nunjucks)')
    .pipe(
      gulpNunjucksRender({
        path: ['src/views/templates/']
      })
    )
    .pipe(
      htmlmin({
        collapseWhitespace: true
      })
    )
    .pipe(gulp.dest('dist/'));
};

export const watchFiles = function () {
  browserSync.init({
    server: {
      baseDir: 'dist/'
    }
  });
  gulp.watch('src/scss/**/*.scss', css);
  gulp.watch('src/js/**/*js', js).on('change', browserSync.reload);
  gulp.watch('src/views/templates/**/*.+(html|nunjucks)', nunjucks).on('change', browserSync.reload);
};

const start = series(nunjucks, copy, css, js, watchFiles);

export const build = parallel(nunjucksMinify, copy, css, js);

export default start;
