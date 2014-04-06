var gulp= require('gulp')
var gulpNgmin= require('gulp-ngmin')
var gulpUglify= require('gulp-uglify')
var gulpRename= require('gulp-rename')

gulp.task('js', function () {
    return gulp.src(['src/aeCalendar/calendar.js'])
        .pipe(gulp.dest('build'))
        .pipe(gulpNgmin())
        .pipe(gulpUglify())
        .pipe(gulpRename({suffix: '.min'}))
        .pipe(gulp.dest('build'))
    ;
})

gulp.task('watch', function () {
    gulp.watch(['src/**/*.js'], ['js'])
})

gulp.task('default', ['js','watch'])
