var gulp= require('gulp')

gulp.task('js', function () {
    return gulp.src(['src/aeCalendar/calendar.js'])
        .pipe(gulp.dest('build'))
    ;
})

gulp.task('watch', function () {
    gulp.watch(['src/**/*.js'], ['js'])
})

gulp.task('default', ['js','watch'])
