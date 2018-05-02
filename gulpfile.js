var gulp = require("gulp"),
  sass = require("gulp-sass"),
  notify = require("gulp-notify"),
  autoprefixer = require("gulp-autoprefixer"),
  browserSync = require("browser-sync"),
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

// Reload all Browsers
gulp.task("bs-reload", function() {
  browserSync.reload();
});


// gulp watch task
gulp.task('watch', function() {

  gulp.watch(['./src/index.html'], ['bs-reload']);
  gulp.watch(['./src/js/*.js'], ['bs-reload']);
  gulp.watch(['./src/stylesheets/css/*.css'], ['bs-reload']);
  gulp.watch(['./src/stylesheets/sass/**/*.scss'], ['sass']);

});


//   sass task
gulp.task("sass", function() {
  return gulp
    .src(sassInput)
    .pipe(sass({outputStyle: 'expanded'}))
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

gulp.task("jest", function() {
  return gulp.src("__tests__").pipe(
    jest({
      preprocessorIgnorePatterns: [
        "<rootDir>/dist/",
        "<rootDir>/node_modules/"
      ],
      automock: false
    })
  );
});

gulp.task("default", ["watch", "browser-sync", "sass"]);
