var gulp=require('gulp');
var svgSymbols=require('gulp-svg-symbols');

gulp.task('sprites',function () {
  return gulp.src('./src/assets/*.svg')
    .pipe(svgSymbols())
    .pipe(gulp.dest('./src/assets/svg'));
});
