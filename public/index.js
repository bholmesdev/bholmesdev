(function () {
  'use strict';

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



  document.write('<script src="http://localhost:35729/livereload.js?snipver=1"></script>');

}());
