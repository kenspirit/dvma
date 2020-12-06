const ESAPI = require('node-esapi')

function index(req, res) {
  const dangerInput = '<img src="#" onerror="alert(document.cookie);this.parentNode.removeChild(this);" />'
  res.render('xss/index', { dangerInput })
}

function domSafe(req, res) {
  res.render('xss/dom/safe')
}

function domUnsafe(req, res) {
  res.render('xss/dom/unsafe')
}

function domUnsafeComplex(req, res) {
  const from = req.query.from

  res.render('xss/dom/unsafe-complex', { dangerInput: ESAPI.encoder().encodeForJavaScript(from) })
}

function domSafeComplex(req, res) {
  const from = req.query.from

  res.render('xss/dom/safe-complex', { dangerInput: ESAPI.encoder().encodeForJavaScript(from) })
}

function jsUnsafe(req, res) {
  const from = req.query.from

  res.render('xss/js/unsafe', { dangerInput: from })
}

function jsSafe(req, res) {
  const from = req.query.from

  res.render('xss/js/safe', { dangerInput: from })
}

function htmlUnsafe(req, res) {
  const search = req.query.search

  res.render('xss/html/unsafe', { dangerInput: search })
}

function htmlSafe(req, res) {
  const search = req.query.search

  res.render('xss/html/safe', { dangerInput: search })
}

module.exports = {
  index,
  domSafe,
  domUnsafe,
  domUnsafeComplex,
  domSafeComplex,
  jsUnsafe,
  jsSafe,
  htmlUnsafe,
  htmlSafe
}
