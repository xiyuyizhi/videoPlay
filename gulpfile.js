var gulp = require('gulp'),
    less = require('gulp-less'),
    path=require('path'),
    LessPluginCleanCSS = require('less-plugin-clean-css'),
    cleancss = new LessPluginCleanCSS({
        advanced: true
    });

/*===========================================================================
 =            less¹¹½¨                        =
 ===========================================================================*/

buildless('less','src/less/*');
gulp.task('copy',function(){
    gulp.src('src/image/*')
        .pipe(gulp.dest(path.join('dist','image')))
})
gulp.task('watch',function(){
   gulp.watch('src/less/*',['less','copy']);
});

 function buildless(taskName, srcPath) {
    gulp.task(taskName, function () {
        return gulp.src(srcPath)
            .pipe(less({
                paths: ['src/less'],
                plugins: [cleancss]
            }))
            .pipe(gulp.dest(path.join('dist','css')))
    })
}