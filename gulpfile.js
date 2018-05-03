var gulp = require("gulp"),
  sass = require("gulp-sass"),
  notify = require("gulp-notify"),
  changed = require("gulp-changed"),
  imagemin = require("gulp-imagemin"),
  cleanCSS = require("gulp-clean-css"),
  uglify = require("gulp-uglify"),
  htmlmin = require("gulp-htmlmin"),
  clean = require("gulp-clean"),
  saveLicense = require("uglify-save-license"),
  autoprefixer = require("gulp-autoprefixer"),
  browserSync = require("browser-sync"),
  runSequence = require("run-sequence"),
  reload = browserSync.create().reload;

var sassInput = "./src/stylesheets/sass/main.scss",
  cssOutput = "./src/stylesheets/css/";

var autoprefixerOptions = {
  browsers: ["last 3 versions", "> 5%", "Firefox ESR"]
};

// Browser-sync
gulp.task("browser-sync", function() {
  browserSync({
    server: {
      baseDir: "./src/"
    },
    port: 5000
  });
});

gulp.task("serve-build", function(done) {
  return browserSync(
    {
      server: {
        baseDir: "./build/"
      },
      port: 3000
    },
    done
  );
});

// Reload all Browsers
gulp.task("bs-reload", function() {
  browserSync.reload();
});

// gulp watch task
gulp.task("watch", function() {
  gulp.watch(["./src/index.html"], ["bs-reload"]);
  gulp.watch(["./src/js/*.js"], ["bs-reload"]);
  gulp.watch(["./src/stylesheets/css/*.css"], ["bs-reload"]);
  gulp.watch(["./src/stylesheets/sass/**/*.scss"], ["sass"]);
});

//   sass task
gulp.task("sass", function() {
  return gulp
    .src(sassInput)
    .pipe(sass({ outputStyle: "expanded" }))
    .on(
      "error",
      notify.onError({
        title: "SASS Failed",
        message: `Error(s) occurred during compile! : <%= error.message %>`
      })
    )
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest(cssOutput))
    .pipe(
      reload({
        stream: true
      })
    )
    .pipe(
      notify({
        message: "Styles task complete"
      })
    );
});

// Clean build folder
gulp.task("clean:build", function(cb) {
  return gulp.src("./build/").pipe(clean());
});

// Optimize images
gulp.task("images", function() {
  return gulp
    .src("./src/assets/images/*.*") //only two level subfolders considered * Standard practice
    .pipe(changed("./_build/src/assets/images/"))
    .pipe(
      imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true
      })
    )
    .pipe(gulp.dest("./build/assets/images/"));
});

// minify CSS
gulp.task("copy-css", function() {
  gulp
    .src(["./src/stylesheets/css/*.css"])
    .pipe(cleanCSS())
    .pipe(gulp.dest("./build/stylesheets/css/"));
});

gulp.task("minify-index-html", function() {
  gulp
    .src(["./src/*.html"])
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true
      })
    )
    .pipe(gulp.dest("./build/"));
});

//minify JS
gulp.task("minify-js", function() {
  gulp
    .src(["./src/js/*.js"])
    .pipe(
      uglify({
        output: {
          comments: saveLicense
        }
      })
    )
    .pipe(gulp.dest("./build/js/"));
});

// Copy All Files in vendeor folder
gulp.task("copy-vendor", function() {
  return gulp
    .src(["./src/vendor/*"], {
      dot: true
    })
    .pipe(gulp.dest("./build/vendor"));
});

/**
 * build task:
 * 1. clean /_build folder
 * 2. compile SASS files, minify and uncss compiled css
 * 3. copy and minimize images
 * 4. build index.html
 * 5. minify and copy all JS files
 * 6. copy files from root folders like favicon
 */
gulp.task("build", function(callback) {
  runSequence(
    "clean:build",
    "sass",
    "copy-css",
    "minify-js",
    "images",
    "minify-index-html",
    "copy-vendor",
    callback
  );
});

// jest test task * futute scope*

// gulp.task("jest", function() {
//   return gulp.src("__tests__").pipe(
//     jest({
//       preprocessorIgnorePatterns: [
//         "<rootDir>/dist/",
//         "<rootDir>/node_modules/"
//       ],
//       automock: false
//     })
//   );
// });

gulp.task("default", ["watch", "browser-sync", "sass"]);
