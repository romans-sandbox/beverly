var lipsDrawing = function() {
  var module = {}, v = {};

  var options = {
    controlBoxSize: 36,
    curvatureOffset: 100
  };

  var status = {
    upper: {
      movable: false,
      startX: 0,
      prevX: 0
    }
  };

  module.query = function() {
    v.container = document.querySelector('#lips-drawing-container');
    v.upperControl = document.querySelector('#lips-drawing-upper-control');
    v.upperTrajectory = document.querySelector('#lips-drawing-upper-trajectory');
    v.lowerControl = document.querySelector('#lips-drawing-lower-control');
    v.lowerTrajectory = document.querySelector('#lips-drawing-lower-trajectory');
  };

  module.initUpper = function() {
    function calculateX(ev, start) {
      var containerBox, availWidth, result;

      containerBox = v.container.getBoundingClientRect();
      availWidth = containerBox.width - options.controlBoxSize;
      result = ev.pageX - containerBox.left - options.controlBoxSize / 2 - start;

      if (result < 0) {
        result = 0;
      }

      if (result > availWidth) {
        result = availWidth;
      }

      return result;
    }

    function calculateTrajectoryPoint(t) {
      var containerBox, availWidth;

      containerBox = v.container.getBoundingClientRect();
      availWidth = containerBox.width - options.controlBoxSize;

      return {
        x: t * availWidth,
        y: 2 * t * (1 - t) * (-options.curvatureOffset)
      };
    }

    v.upperControl.addEventListener('mousedown', function(ev) {
      status.upper.movable = true;

      status.upper.startX = calculateX(ev, 0) - status.upper.prevX;
    }, false);

    document.addEventListener('mouseup', function() {
      status.upper.movable = false;
    }, false);

    document.addEventListener('mousemove', function(ev) {
      var containerBox, availWidth, point, upperX;

      containerBox = v.container.getBoundingClientRect();
      availWidth = containerBox.width - options.controlBoxSize;

      if (status.upper.movable) {
        upperX = calculateX(ev, status.upper.startX);

        status.upper.prevX = upperX;

        point = calculateTrajectoryPoint(upperX / availWidth);

        v.upperControl.style.left = point.x + 'px';
        v.upperControl.style.top = point.y + 'px';
      }
    }, false);
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
