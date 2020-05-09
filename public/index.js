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

  var clickCount = 0;
  var speed = 100;
  document.addEventListener('click', function () {
    clickCount++;
    console.log("Clicked ".concat(clickCount, " times!"));
  });
  var dashedLine = document.getElementById('dashed-line');
  var translationY = 0;
  setInterval(function () {
    translationY = (translationY - 2) % 50;
    dashedLine.style.transform = "translateY(".concat(translationY, "px)");
  }, 35);

  (function animationFrame() {
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

  var observerOptions = {
    root: null,
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0
  };

  function SectionTarget(element) {
    this.el = element;
    this.enteredTop = 0; // the y-pos where the section has entered the viewport

    this.exitedTop = 0; // the y-pos where the section has exited the viewport
  }

  var sectionTargets = [new SectionTarget(document.getElementById('inbrief')), new SectionTarget(document.getElementById('iteach'))];
  var intersectionTypes = ['enteredSection', // entered a new section
  'leftToPrevSection', // left the current section by scrolling up to a previous section
  'other' // either hasn't entered a section or remains in current section
  ];
  var allStripes = document.querySelectorAll('.line-accents > *');

  var observerCallback = function observerCallback(entries, observer) {
    entries.forEach(function (change) {
      var intersectionType = null;
      var targettedIndex = sectionTargets.findIndex(function (target) {
        return target.el === change.target;
      });
      var target = sectionTargets[targettedIndex];
      if (!target) return;

      if (change.isIntersecting) {
        target.enteredTop = change.boundingClientRect.top;
        intersectionType = intersectionTypes[0];
      } else {
        if (target.enteredTop > 0) {
          // don't set exited position until the section has entered into view
          target.exitedTop = change.boundingClientRect.top;
        }

        if (target.exitedTop > target.enteredTop) {
          intersectionType = intersectionTypes[1];
        } else {
          intersectionType = intersectionTypes[2];
        }
      }

      if (intersectionType === intersectionTypes[2]) return;
      var visibleSectionIndex = 0;

      if (intersectionType === intersectionTypes[0]) {
        // show stripe for current section
        visibleSectionIndex = targettedIndex + 1;
      }

      if (intersectionType === intersectionTypes[1]) {
        // show stripe for previous section
        visibleSectionIndex = targettedIndex;
      }

      var _iterator = _createForOfIteratorHelper(allStripes),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var stripe = _step.value;
          var selectedStripe = document.querySelector(".line-accents > :nth-child(".concat(visibleSectionIndex, ")"));

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
    });
  };

  var observer = new IntersectionObserver(observerCallback, observerOptions);
  sectionTargets.forEach(function (target) {
    return observer.observe(target.el);
  });



  document.write('<script src="http://localhost:35729/livereload.js?snipver=1"></script>');

}());
