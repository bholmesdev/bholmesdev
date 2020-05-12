import { _ as _createForOfIteratorHelper } from './_rollupPluginBabelHelpers-e27e5649.js';

var baseUrl = location.origin;

var allPageEls = document.querySelectorAll('main[data-route]');

var setVisiblePage = function setVisiblePage(pathname) {
  var pageEl = document.querySelector("main[data-route=\"".concat(pathname, "\"]"));

  if (pageEl) {
    var _iterator = _createForOfIteratorHelper(allPageEls),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var el = _step.value;
        console.log(el);
        el.setAttribute('hidden', '');
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    pageEl.removeAttribute('hidden');
  }
};

document.addEventListener('click', function (event) {
  var target = event.target;

  if (target.tagName === 'A' && target.origin === baseUrl) {
    event.preventDefault();

    if (target.hash) {
      var el = document.querySelector(target.hash);
      el && el.scrollIntoView({
        behavior: 'smooth'
      });
    } else {
      history.pushState({}, null, target.href);
      setVisiblePage(target.pathname);
    }
  }
});

onpopstate = function onpopstate() {
  setVisiblePage(location.pathname);
};



document.write('<script src="http://localhost:35729/livereload.js?snipver=1"></script>');
