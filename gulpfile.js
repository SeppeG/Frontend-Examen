const { src, dest, series, parallel, watch } = require("gulp");
const del = require("del");
const browserSync = require("browser-sync");
const sass = require("gulp-dart-sass");
const babel = require("gulp-babel");
const imagemin = require("gulp-imagemin");
const origin = "src";
const destination = "build";

sass.compiler = require("sass");

async function clean(cb) {
	await del(destination);
	cb();
}

function html(cb) {
	src(`${origin}/**/*.html`).pipe(dest(destination));
	cb();
}

async function images(cb) {
	src(`${origin}/img/**/**`)
		.pipe(imagemin())
		.pipe(dest(`${destination}/img`));
}

function scss(cb) {
	src(`${origin}/ui/**/*.scss`)
		.pipe(sass({ outputStyle: "compressed" }))
		.pipe(dest(`${destination}/css`));
	cb();
}

function js(cb) {
	src(`${origin}/js/script.js`)
		.pipe(
			babel({
				presets: ["@babel/preset-env"],
			})
		)
		.pipe(dest(`${destination}/js`));
	cb();
}

function watcher(cb) {
	watch(`${origin}/**/*.html`).on("change", series(html, browserSync.reload));
	watch(`${origin}/**/*.scss`).on("change", series(scss, browserSync.reload));
	watch(`${origin}/**/*.js`).on("change", series(js, browserSync.reload));
	cb();
}

function server(cb) {
	browserSync.init({
		notify: false,
		open: false,
		server: { baseDir: destination },
	});
	cb();
}

exports.html = html;
exports.scss = scss;
exports.js = js;
exports.default = series(clean, parallel(html, scss, js, images), server, watcher);
