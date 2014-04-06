var gulp= require('gulp')
var gulpNgmin= require('gulp-ngmin')
var gulpUglify= require('gulp-uglify')

gulp.task('js', function () {
    return gulp.src(['src/aeCalendar/calendar.js'])
        .pipe(gulpNgmin())
        .pipe(gulpUglify())
        .pipe(gulp.dest('build'))
    ;
})

gulp.task('watch', function () {
    gulp.watch(['src/**/*.js'], ['js'])
})

gulp.task('default', ['js','watch'])
