(function () {
  'use strict';

  var clickCount = 0;
  document.addEventListener('click', function () {
    clickCount++;
    console.log("Clicked ".concat(clickCount, " times!"));
  });



  document.write('<script src="http://localhost:35729/livereload.js?snipver=1"></script>');

}());
