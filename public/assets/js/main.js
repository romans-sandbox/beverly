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

  var options = {
    aCoefficient: 0.2,
    bCoefficient: 0.6
  };

  module.init = function(context) {
    var wrappers, i;

    if (!context) {
      context = document;
    }

    wrappers = context.querySelectorAll('[data-magic-control]');

    if (wrappers) {
      for (i = 0; i < wrappers.length; i++) {
        (function(wrapper, control, shadowA, shadowB, shadowC, duration) {
          var wrapperBox, targetRadius;

          wrapperBox = control.getBoundingClientRect();

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

          wrapper.addEventListener('mousedown', function() {
            var aRadius, bRadius, cRadius;

            wrapper.classList.add('state-0');
            wrapper.classList.add('state-a');

            aRadius = options.aCoefficient * targetRadius;
            bRadius = options.bCoefficient * targetRadius;
            cRadius = targetRadius;

            TweenLite.fromTo(shadowA, duration * options.aCoefficient, {
              left: wrapperBox.width / 2,
              top: wrapperBox.height / 2
            }, {
              width: aRadius * 2,
              height: aRadius * 2,
              left: -aRadius + wrapperBox.width / 2,
              top: -aRadius + wrapperBox.height / 2,
              ease: Power4. easeOut,
              onComplete: function() {
                wrapper.classList.add('state-b');

                TweenLite.fromTo(shadowB, duration * (options.bCoefficient - options.aCoefficient), {
                  left: wrapperBox.width / 2,
                  top: wrapperBox.height / 2
                }, {
                  width: bRadius * 2,
                  height: bRadius * 2,
                  left: -bRadius + wrapperBox.width / 2,
                  top: -bRadius + wrapperBox.height / 2,
                  ease: Power4. easeOut,
                  onComplete: function() {
                    wrapper.classList.add('state-c');

                    TweenLite.fromTo(shadowC, duration * (1 - options.bCoefficient - options.aCoefficient), {
                      left: wrapperBox.width / 2,
                      top: wrapperBox.height / 2
                    }, {
                      width: cRadius * 2,
                      height: cRadius * 2,
                      left: -cRadius + wrapperBox.width / 2,
                      top: -cRadius + wrapperBox.height / 2,
                      ease: Power4. easeOut,
                      onComplete: function() {

                      }
                    });
                  }
                });
              }
            });
          });
        })(
          wrappers[i],
          wrappers[i].querySelector('[data-control]'),
          wrappers[i].querySelector('[data-shadow-a]'),
          wrappers[i].querySelector('[data-shadow-b]'),
          wrappers[i].querySelector('[data-shadow-c]'),
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
