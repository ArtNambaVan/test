// Gulp & plugins
const gulp           = require('gulp'),

    // gulp plugins
    changed         = require('gulp-changed'),
    imagemin        = require('gulp-imagemin'),
    concat          = require('gulp-concat'),
    uglify          = require('gulp-uglify'),
    less            = require('gulp-less'),
    plumber         = require('gulp-plumber'),
    nunjucksRender  = require('gulp-nunjucks-render'),
    data            = require('gulp-data'),
    

    // other plugins
    LessAutoPrefix  = require('less-plugin-autoprefix'),
    browsersync     = require('browser-sync'),
    del             = require('del'),
    fs              = require('graceful-fs')
    ;

//let requireUncached = require('require-uncached'),

// Files path
let PATH;

PATH = {
  src  : 'src/',
  dest : 'html/'
};

PATH.njk = {
  njk : PATH.src + '_templates/**/*.njk',
  in : PATH.src + '_pages/**/*.njk',
  out : PATH.dest + './'
};

PATH.html = {
  in  : PATH.src  + '*.html',
  out : PATH.dest + './'
};

PATH.images = {
  in  : PATH.src  + 'images/**/*.*',
  out : PATH.dest + 'images/'
};

PATH.css_libs = {
    in  : PATH.src  + 'css/libs/bootstrap*.css',
    out : PATH.dest + 'css/libs/'
};

PATH.less = {
    all : PATH.src  + 'css/style.less',
    in  : PATH.src  + 'css/**/*.less',
    out : PATH.dest + 'css/'
  };

PATH.fonts = {
  in  : PATH.src  + 'fonts/**/*.*',
  out : PATH.dest + 'fonts/'
};

// PATH.js_libs = {
//   in  : PATH.src  + 'js/+(modernizr-custom|jquery-ui.min|jquery.min|vue)*.js',
//   out : PATH.dest + 'js/'
// };

const SYNC_CONFIG = {
    port   : 3333,
    browser: "chrome",
    server : {
      baseDir : PATH.dest,
      //index : 'promotion-rules.html'
      index : 'index.html'
    },
    open   : true,
    notify : false
  };



// LESS options
var LESS_PREFIXER = new LessAutoPrefix({
        browsers: ['last 5 versions', 'ie 11', 'Firefox 14']
    });

// NUNJUCKS options
var NUNJUCKS_DEFAULTS = {
    path: 'src/_templates/'
    // envOptions: {
    //     watch: false
    // }
};

// handle styles
gulp.task('css', function() {
    // console.log('*************************');
    // console.log('*** Starting CSS task ***');
    // console.log('*************************');

    return gulp.src(PATH.css.in)
        .pipe(gulp.dest(PATH.css.out))
        ;
});

gulp.task('less', function() {
    // console.log('**************************');
    // console.log('*** Starting LESS task ***');
    // console.log('**************************');

    return gulp.src(PATH.less.all)
        .pipe(changed(PATH.less.out))
        .pipe(plumber( function (err) {
            console.log('***********************');
            console.log('*** LESS TASK ERROR ***');
            console.log('***********************');
            console.log(err);
            this.emit('end');
        }))
        .pipe(less({
            paths   : [PATH.less.in],
            plugins : [LESS_PREFIXER]
        }))
        .pipe(gulp.dest(PATH.less.out))
        .pipe(browsersync.reload({ stream: true }))
        ;
});

gulp.task('styles', ['less']);

// handle fonts
gulp.task('fonts', function(){
    // console.log('***************************');
    // console.log('*** Starting FONTS task ***');
    // console.log('***************************');

    return gulp.src(PATH.fonts.in)
        .pipe(gulp.dest(PATH.fonts.out))
        ;
});

// handle images
gulp.task('images', function() {
    // console.log('****************************');
    // console.log('*** Starting IMAGES task ***');
    // console.log('****************************');

    return gulp.src(PATH.images.in)
        .pipe(changed(PATH.images.out))
        .pipe(imagemin())
        .pipe(gulp.dest(PATH.images.out))
        ;
});

// handle img


gulp.task('pictures', ['images']);

// handle js
gulp.task('js', function() {
    // console.log('************************');
    // console.log('*** Starting JS task ***');
    // console.log('************************');

    return gulp.src(PATH.js.in)
        // .pipe(concat('app.min.js'))
        // .pipe(uglify())
        .pipe(changed(PATH.js.out))
        .pipe(gulp.dest(PATH.js.out))
        ;
});

// handle nunjucks
gulp.task('nunjucks', function() {
    //let data = requireUncached('./src/_data/data.json');
    return gulp.src(PATH.njk.in)
        .pipe(changed(PATH.njk.out))
        .pipe(data(function (file) {
            DEBUG:
            var test = fs.readFileSync('./src/_data/data.json', 'utf8');
            var json = JSON.parse(fs.readFileSync('./src/_data/data.json', 'utf8'));
            console.log("test: ", test);
            console.log("json: ", json);
            return JSON.parse(fs.readFileSync('./src/_data/data.json', 'utf8'));
        }))
        .pipe(nunjucksRender(NUNJUCKS_DEFAULTS))
        .pipe(gulp.dest(PATH.njk.out))
        ;
});



// handle html
gulp.task('html', ['nunjucks'], function() {
    return gulp.src(PATH.html.in)
        .pipe(changed(PATH.html.out))
        .pipe(gulp.dest(PATH.html.out))
        ;
});

// build task
gulp.task('build',

    [   'styles',
        'fonts',
        'pictures',
        //'js',
        'html'
    ],

    function() {
        console.log('***************************');
        console.log('*** Starting BUILD task ***');
        console.log('***************************');
    }
);

// clean html folder
gulp.task('clean', function() {
    console.log('***************************');
    console.log('*** Starting CLEAN task ***');
    console.log('***************************');
    del([
        PATH.dest + '*'
    ]);
});

// Browser-sync task
gulp.task('browsersync', function() {
    browsersync(SYNC_CONFIG);
});

gulp.task('watcher', function() {
    gulp.watch(PATH.images.in, ['images']);
    gulp.watch(PATH.less.in, ['less']);
    gulp.watch([PATH.njk.njk, PATH.njk.in], ['html', browsersync.reload]);
  })



// default task
gulp.task('default', ['browsersync', 'build', 'watcher']);