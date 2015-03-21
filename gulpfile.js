var gulp = require('gulp'),
    gutil = require('gulp-util'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    concat = require('gulp-concat'),
    path = require('path'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    ngrok = require('ngrok');

var env,
    jsSources,
    sassSources,
    htmlSources,
    outputDir,
    sassStyle,
    cssMap;

env = process.env.NODE_ENV || 'development';

if (env==='development') {
  outputDir = 'builds/development/';
  sassStyle = 'expanded';
  cssMap = true;
} else {
  outputDir = 'builds/jasonz15.github.io/';
  sassStyle = 'compressed';
  cssMap = false;
}

jsSources = [
  'components/vendor/jquery/jquery.min.js',
  'components/vendor/tween/TweenMax.min.js',
  'components/vendor/tween/jquery.scrollmagic.min.js',
  'components/scripts/script.js'
];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];

gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .on('error', gutil.log)
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload());

  gulp.src(['components/scripts/script_maze.js'])
    .pipe(concat('script_maze.js'))
    .on('error', gutil.log)
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload());
});

gulp.task('vendor', function() {
  gulp.src(['components/vendor/jquery/*.js',
            'components/vendor/three/*.js',
            'components/vendor/pace/*.js'])
    .pipe(gulp.dest(outputDir + 'js'));
  gulp.src(['components/vendor/pace/*.css'])
    .pipe(gulp.dest(outputDir + 'css'));
});

gulp.task('compass', function() {
  gulp.src(sassSources)
    .pipe(compass({
      sourcemap: cssMap,
      sass: 'components/sass',
      css: outputDir + 'css',
      image: outputDir + 'images',
      style: sassStyle,
      require: ['susy', 'breakpoint']
    })
    .on('error', gutil.log))
//    .pipe(gulp.dest( outputDir + 'css'))
    .pipe(connect.reload())
});

gulp.task('watch', function() {
  gulp.watch(jsSources, ['js']);
  gulp.watch(['components/sass/*.scss', 'components/sass/*/*.scss'], ['compass']);
  gulp.watch('builds/development/*.html', ['html']);
});

gulp.task('connect', function() {
  connect.server({
    root: outputDir,
    livereload: true
  });
});

gulp.task('html', function() {
  gulp.src('builds/development/*.html')
    .pipe(gulpif(env === 'production', minifyHTML()))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
    .pipe(connect.reload())
});

// Copy images to production
gulp.task('move', function() {
  gulp.src('builds/development/images/**/*.*')
  .pipe(gulpif(env === 'production', imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  })))
  .pipe(gulpif(env === 'production', gulp.dest(outputDir+'images')));
  gulp.src('builds/development/*.ico')
  .pipe(gulpif(env === 'production', gulp.dest(outputDir)));
});

//create ngrok url for testing
gulp.task('ngrok-url', function(cb) {
 return ngrok.connect(8080, function (err, url) {
  site = url;
  console.log('serving your tunnel from: ' + site);
  cb();
 });
});

gulp.task('default', ['watch', 'html', 'js', 'vendor', 'compass', 'move', 'connect', 'ngrok-url']);
