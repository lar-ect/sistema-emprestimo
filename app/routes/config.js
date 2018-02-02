const path = require('path');
module.exports = (application) => {
    application.get("*/*.js", (req, res) => res.download(path.resolve(`./public/dist/${req.params[1]}.js`)));
    application.get("*/*.css", (req, res) => res.download(path.resolve(`./public/dist/${req.params[1]}.css`)));
    application.get("*/*.ico", (req, res) => res.download(path.resolve(`./public/dist/${req.params[1]}.ico`)));
    application.get("*/*.eot", (req, res) => res.download(path.resolve(`./public/dist/${req.params[1]}.eot`)));
    application.get("*/*.svg", (req, res) => res.download(path.resolve(`./public/dist/${req.params[1]}.svg`)));
    application.get("*/*.ttf", (req, res) => res.download(path.resolve(`./public/dist/${req.params[1]}.ttf`)));
}
