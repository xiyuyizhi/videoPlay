var gulp = require('gulp'),
    less = require('gulp-less'),
    path=require('path'),
    seq = require('run-sequence'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    LessPluginCleanCSS = require('less-plugin-clean-css'),
    cleancss = new LessPluginCleanCSS({
        advanced: true
    });

/*===========================================================================
 =            js,less¹¹½¨                        =
 ===========================================================================*/
buildjs('js','src/js/zjmy.vPlayer.js');
buildless('less','src/less/*');
gulp.task('copyjquery',function(){
    gulp.src('bower_components/jquery/dist/jquery.min.js')
        .pipe(gulp.dest(path.join('dist','js')))
});
gulp.task('copyimg',function(){
    gulp.src('src/image/*')
        .pipe(gulp.dest(path.join('dist','image')))
})
gulp.task('watch',function(){
   gulp.watch('src/*/*',['default']);
});

gulp.task('default', function (done) {
    seq(['copyjquery','copyimg','js','less','watch'], done)
});

function buildjs(taskName,srcPath){
    gulp.task(taskName, function () {
        return gulp.src(srcPath)
            .pipe(gulp.dest(path.join('dist','js')))
            .pipe(rename({suffix: '.min'}))
            .pipe(uglify())//Ñ¹Ëõ
            .pipe(gulp.dest(path.join('dist','js')))
    })
}

function buildless(taskName, srcPath) {
    gulp.task(taskName, function () {
        return gulp.src(srcPath)
            .pipe(less({
                paths: ['src/less'],
                plugins: [cleancss]
            }))
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(gulp.dest(path.join('dist','css')))
    })
}