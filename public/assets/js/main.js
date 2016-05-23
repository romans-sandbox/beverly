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
      prevX: 0,
      progress: 0
    },
    lower: {
      movable: false,
      startX: 0,
      prevX: 0,
      progress: 0
    }
  };

  module.query = function() {
    v.container = document.querySelector('#lips-drawing-container');
    v.upperControl = document.querySelector('#lips-drawing-upper-control');
    v.upperTrajectory = document.querySelector('#lips-drawing-upper-trajectory');
    v.lowerControl = document.querySelector('#lips-drawing-lower-control');
    v.lowerTrajectory = document.querySelector('#lips-drawing-lower-trajectory');
  };

  function calculateTrajectoryPoint(t) {
    var containerBox, availWidth;

    containerBox = v.container.getBoundingClientRect();
    availWidth = containerBox.width - options.controlBoxSize;

    return {
      x: t * availWidth,
      y: 2 * t * (1 - t) * (-options.curvatureOffset)
    };
  }

  function calculateUpperX(ev, start) {
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

  function calculateLowerX(ev, start) {
    var containerBox, availWidth, result;

    containerBox = v.container.getBoundingClientRect();
    availWidth = containerBox.width - options.controlBoxSize;
    result = availWidth - ev.pageX + containerBox.left + options.controlBoxSize / 2 - start;

    if (result < 0) {
      result = 0;
    }

    if (result > availWidth) {
      result = availWidth;
    }

    return result;
  }

  module.initUpper = function() {
    v.upperControl.addEventListener('mousedown', function(ev) {
      ev.preventDefault();

      status.upper.movable = true;

      status.upper.startX = calculateUpperX(ev, 0) - status.upper.prevX;
    }, false);

    document.addEventListener('mouseup', function() {
      status.upper.movable = false;
    }, false);

    document.addEventListener('mousemove', function(ev) {
      var containerBox, availWidth, point, upperX;

      ev.preventDefault();

      containerBox = v.container.getBoundingClientRect();
      availWidth = containerBox.width - options.controlBoxSize;

      if (status.upper.movable) {
        upperX = calculateUpperX(ev, status.upper.startX);

        status.upper.prevX = upperX;
        status.upper.progress = upperX / availWidth;

        point = calculateTrajectoryPoint(upperX / availWidth);

        v.upperControl.style.left = point.x + 'px';
        v.upperControl.style.top = point.y + 'px';
      }
    }, false);
  };

  module.initLower = function() {
    v.lowerControl.addEventListener('mousedown', function(ev) {
      ev.preventDefault();

      status.lower.movable = true;

      status.lower.startX = calculateLowerX(ev, 0) - status.lower.prevX;
    }, false);

    document.addEventListener('mouseup', function() {
      status.lower.movable = false;
    }, false);

    document.addEventListener('mousemove', function(ev) {
      var containerBox, availWidth, point, lowerX;

      ev.preventDefault();

      containerBox = v.container.getBoundingClientRect();
      availWidth = containerBox.width - options.controlBoxSize;

      if (status.lower.movable) {
        lowerX = calculateLowerX(ev, status.lower.startX);

        status.lower.prevX = lowerX;
        status.lower.progress = lowerX / availWidth;

        point = calculateTrajectoryPoint(lowerX / availWidth);

        v.lowerControl.style.right = point.x + 'px';
        v.lowerControl.style.bottom = point.y + 'px';
      }
    }, false);
  };

  return module;
}();

var magicControls = function() {
  var module = {};

  var options = {};

  module.init = function(context) {
    var wrappers, i;

    if (!context) {
      context = document;
    }

    wrappers = context.querySelectorAll('[data-magic-control]');

    if (wrappers) {
      for (i = 0; i < wrappers.length; i++) {
        (function(wrapper, control, shadows, duration) {
          var wrapperBox, targetRadius, radius, shadowName, t1;
          var i, resetTimeout;

          wrapperBox = control.getBoundingClientRect();

          wrapper.addEventListener('mousedown', function() {
            window.clearTimeout(resetTimeout);

            targetRadius = Math.sqrt(
                Math.pow(
                  Math.max(
                    wrapperBox.left,
                    window.innerWidth - wrapperBox.left - wrapperBox.width
                  ),
                  2
                ) +
                Math.pow(
                  Math.max(
                    wrapperBox.top,
                    window.innerHeight - wrapperBox.top - wrapperBox.height
                  ),
                  2
                )
              ) + wrapperBox.width;

            wrapper.classList.add('state-0');

            t1 = new TimelineLite();

            for (i = 0; i < shadows.length; i++) {
              shadowName = shadows[i].getAttribute('data-shadow');
              radius = targetRadius / Math.pow(shadows.length, 3) * Math.pow(i + 1, 3);

              t1.fromTo(shadows[i], duration / shadows.length, {
                left: wrapperBox.width / 2,
                top: wrapperBox.height / 2,
                width: 0,
                height: 0
              }, {
                width: radius * 2,
                height: radius * 2,
                left: -radius + wrapperBox.width / 2,
                top: -radius + wrapperBox.height / 2,
                ease: Power4.easeOut,
                onStart: function() {
                  wrapper.classList.add('state-' + shadowName);
                }
              });
            }
          });

          wrapper.addEventListener('mouseup', function() {
            t1.duration(duration / 4);
            t1.reverse();

            resetTimeout = window.setTimeout(function() {
              wrapper.classList.remove('state-0');

              for (i = 0; i < shadows.length; i++) {
                shadowName = shadows[i].getAttribute('data-shadow');

                wrapper.classList.remove('state-' + shadowName);
              }
            }, duration * 1000 / 4);
          });
        })(
          wrappers[i],
          wrappers[i].querySelector('[data-control]'),
          wrappers[i].querySelectorAll('[data-shadow]'),
          +wrappers[i].getAttribute('data-duration')
        );
      }
    }
  };

  return module;
}();

////

lipsDrawing.query();
lipsDrawing.initUpper();
lipsDrawing.initLower();

///

magicControls.init();
