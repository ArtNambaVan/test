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
    cleanCSS        = require('gulp-clean-css'),
    sourcemaps      = require('gulp-sourcemaps'),
    sass            = require('gulp-sass'),
    autoprefixer    = require('gulp-autoprefixer'),
    

    // other plugins
    LessAutoPrefix  = require('less-plugin-autoprefix'),
    browsersync     = require('browser-sync'),
    del             = require('del'),
    fs              = require('graceful-fs')
    ;
    sass.compiler   = require('node-sass')
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
    in  : PATH.src  + 'css/libs/',
    out : PATH.dest + 'css/libs/'
};

PATH.less = {
    all : PATH.src  + 'css/style.less',
    in  : PATH.src  + 'css/**/*.less',
    out : PATH.dest + 'css/'
};

PATH.sass = {
    all : PATH.src + 'css/*.scss',
    in  : PATH.src + 'css/**/*.scss',
    out : PATH.dest + 'css/'
}

PATH.fonts = {
  in  : PATH.src  + 'fonts/**/*.*',
  out : PATH.dest + 'fonts/'
};

PATH.js = {
    in  : PATH.src  + 'js/main.js',
    out : PATH.dest + 'js/'
}

PATH.js_libs = {
  in  : PATH.src  + 'js/libs/',
  out : PATH.dest + 'js/'
};

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

var SASS_PREFIXER = {
    browsers: ['last 5 versions', 'ie 11', 'Firefox 14']
    };

// NUNJUCKS options
var NUNJUCKS_DEFAULTS = {
    path: 'src/_templates/',
    envOptions: {
        watch: false,
        trimBlocks: true,
        lstripBlocks: true
    }
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

gulp.task('css_libs', function() {
    return gulp.src([
            PATH.css_libs.in + 'clay.css',
            PATH.css_libs.in + 'bootstrap-select.css',
            PATH.css_libs.in + 'main.css',
        ])
        //.pipe(concat('libs.css'))
        .pipe(gulp.dest(PATH.css_libs.out))
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

gulp.task('sass', function() {
    return gulp.src(PATH.sass.all)
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer(SASS_PREFIXER))
        .pipe(gulp.dest(PATH.sass.out))
})


gulp.task('styles', ['sass', 'css_libs']);

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

gulp.task('js_libs', function() {
    return gulp.src([
            PATH.js_libs.in + 'jquery.js',
            PATH.js_libs.in + 'popper.js',
            PATH.js_libs.in + 'bootstrap.js',
            PATH.js_libs.in + 'bootstrap-select.js'
        ])
        .pipe(concat('libs.js'))
        .pipe(changed(PATH.js_libs.out))
        .pipe(gulp.dest(PATH.js_libs.out))
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
        'js_libs',
        'js',
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
    gulp.watch(PATH.sass.in, ['sass', browsersync.reload]);
    gulp.watch(PATH.js_libs.in, ['js_libs']);
    gulp.watch(PATH.js.in, ['js']);
    gulp.watch([PATH.njk.njk, PATH.njk.in], ['html', browsersync.reload]);
})



// default task
gulp.task('default', ['browsersync', 'build', 'watcher']);