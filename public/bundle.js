(function () {
  'use strict';

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _createForOfIteratorHelper(o) {
    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) {
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var it,
        normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = o[Symbol.iterator]();
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  (function inBriefModeCheckbox() {
    var personalModeEl = document.getElementById('in-brief__personal-content');
    var recruiterModeEl = document.getElementById('in-brief__recruiter-content');
    var modeCheckboxEl = document.getElementById('in-brief-mode-checkbox');

    if (modeCheckboxEl.checked) {
      personalModeEl.style.display = 'none';
      recruiterModeEl.style.display = 'initial';
    }

    document.addEventListener('change', function (_ref) {
      var target = _ref.target;

      if (target === modeCheckboxEl) {
        if (target.checked) {
          personalModeEl.style.display = 'none';
          recruiterModeEl.style.display = 'initial';
        } else {
          personalModeEl.style.display = 'initial';
          recruiterModeEl.style.display = 'none';
        }
      }
    });
  })();

  (function navigationDashedLineAnim() {
    var dashedLine = document.getElementById('dashed-line');
    var translationY = 0;
    var speed = 100;
    setInterval(function () {
      translationY = (translationY - 2) % 50;
      dashedLine.style.transform = "translateY(".concat(translationY, "px)");
    }, 35);
    var waitingOnAnimRequest = false;
    var prevScrollY = 0;
    var currScrollY = 0;

    window.onscroll = function () {
      if (!waitingOnAnimRequest) {
        window.requestAnimationFrame(function () {
          prevScrollY = currScrollY;
          currScrollY = window.scrollY;
          speed = (prevScrollY - currScrollY) * 3;
          translationY = (translationY + speed) % 50;
          dashedLine.style.transform = "translateY(".concat(translationY, "px)");
          waitingOnAnimRequest = false;
        });
        waitingOnAnimRequest = true;
      }
    };
  })();

  (function coloredStripeLogic() {
    var observerOptions = {
      root: null,
      rootMargin: '-60% 0px -40% 0px',
      threshold: 0
    };
    var sectionTargets = [document.getElementById('inbrief-section'), document.getElementById('iteach-section')];
    var allStripes = document.querySelectorAll('.line-accents > *');

    var observerCallback = function observerCallback(entries) {
      entries.forEach(function (change) {
        var targettedIndex = sectionTargets.findIndex(function (target) {
          return target === change.target;
        });
        var selectedStripe = document.querySelector(".line-accents > :nth-child(".concat(targettedIndex + 1, ")"));

        if (change.isIntersecting) {
          var _iterator = _createForOfIteratorHelper(allStripes),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var stripe = _step.value;

              if (stripe === selectedStripe) {
                stripe.classList.add('active');
              } else {
                stripe.classList.remove('active');
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        } else if (targettedIndex === 0) {
          selectedStripe.classList.remove('active');
        }
      });
    };

    var observer = new IntersectionObserver(observerCallback, observerOptions);
    sectionTargets.forEach(function (target) {
      return observer.observe(target);
    });
  })();

  var clickCount = 0;
  document.addEventListener('click', function () {
    clickCount++;
    console.log("Clicked ".concat(clickCount, " times!"));
  });

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

}());
