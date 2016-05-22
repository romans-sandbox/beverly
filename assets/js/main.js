var lipsDrawing = function() {
  var module = {}, v = {};

  var options = {};

  module.query = function() {
    v.upperControl = document.querySelector('#lips-drawing-upper-control');
    v.upperTrajectory = document.querySelector('#lips-drawing-upper-trajectory');
    v.lowerControl = document.querySelector('#lips-drawing-lower-control');
    v.lowerTrajectory = document.querySelector('#lips-drawing-lower-trajectory');
  };

  module.initUpper = function() {
    //
  };

  module.initLower = function() {
    //
  };

  return module;
}();

////

lipsDrawing.query();
lipsDrawing.initUpper();
lipsDrawing.initLower();
