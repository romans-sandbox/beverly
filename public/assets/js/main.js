var lipsDrawing = function() {
  var module = {}, v = {};

  var options = {
    controlBoxSize: 38,
    curvatureOffset: 100,
    threshold: 0.9,
    pointDiff: 0.05,
    durations: {
      controlReturn: 0.5
    }
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

  function calculateTrajectoryPoint(t, prev) {
    var containerBox, availWidth, point, prevPoint;

    containerBox = v.container.getBoundingClientRect();
    availWidth = containerBox.width - options.controlBoxSize;

    point = {
      x: t * availWidth,
      y: 2 * t * (1 - t) * (-options.curvatureOffset),
      angle: null
    };

    if (!prev) {
      if (t < options.pointDiff) {
        prevPoint = calculateTrajectoryPoint(t + options.pointDiff, true);
        point.angle = Math.atan2(prevPoint.y - point.y, prevPoint.x - point.x);
      } else {
        prevPoint = calculateTrajectoryPoint(t - options.pointDiff, true);
        point.angle = Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x);
      }

      point.angle /= 2 * Math.PI / 360;
    }

    return point;
  }

  function calculateUpperX(ev, start) {
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

  function calculateLowerX(ev, start) {
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

  module.initUpper = function() {
    v.upperControl.addEventListener('mousedown', function(ev) {
      ev.preventDefault();

      status.upper.movable = true;

      status.upper.startX = calculateUpperX(ev, 0) - status.upper.prevX;
    }, false);

    document.addEventListener('mouseup', function() {
      var o, point;

      if (status.upper.movable) {
        status.upper.movable = false;

        if (status.upper.progress < options.threshold && status.upper.progress > 0) {
          o = {x: status.upper.progress};

          TweenLite.to(o, options.durations.controlReturn, {
            x: 0,
            onUpdate: function() {
              point = calculateTrajectoryPoint(o.x);

              v.upperControl.style.right = point.x + 'px';
              v.upperControl.style.top = point.y + 'px';
            },
            onComplete: function() {
              status.upper.prevX = 0;
              status.upper.progress = 0;
            }
          });
        }
      }
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

        v.upperControl.style.right = point.x + 'px';
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
      var o, point;

      if (status.lower.movable) {
        status.lower.movable = false;

        if (status.lower.progress < options.threshold && status.lower.progress > 0) {
          o = {x: status.lower.progress};

          TweenLite.to(o, options.durations.controlReturn, {
            x: 0,
            onUpdate: function() {
              point = calculateTrajectoryPoint(o.x);

              v.lowerControl.style.left = point.x + 'px';
              v.lowerControl.style.bottom = point.y + 'px';
            },
            onComplete: function() {
              status.lower.prevX = 0;
              status.lower.progress = 0;
            }
          });
        }
      }
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

        v.lowerControl.style.left = point.x + 'px';
        v.lowerControl.style.bottom = point.y + 'px';
      }
    }, false);
  };

  return module;
}();

var magicControls = function() {
  var module = {};

  var options = {};

  module.initRadial = function(context) {
    var wrappers, i;

    if (!context) {
      context = document;
    }

    wrappers = context.querySelectorAll('[data-magic-control="radial"]');

    if (wrappers) {
      for (i = 0; i < wrappers.length; i++) {
        (function(wrapper, control, shadows, duration) {
          var controlBox, targetRadius, timeline;
          var i, resetTimeout;

          controlBox = control.getBoundingClientRect();

          wrapper.addEventListener('mousedown', function() {
            window.clearTimeout(resetTimeout);

            targetRadius = Math.sqrt(
                Math.pow(
                  Math.max(
                    controlBox.left,
                    window.innerWidth - controlBox.left - controlBox.width
                  ),
                  2
                ) +
                Math.pow(
                  Math.max(
                    controlBox.top,
                    window.innerHeight - controlBox.top - controlBox.height
                  ),
                  2
                )
              ) + controlBox.width;

            wrapper.classList.add('state-0');

            timeline = new TimelineLite();

            if (shadows) {
              for (i = 0; i < shadows.length; i++) {
                (function(shadowName, radius) {
                  timeline.fromTo(shadows[i], duration / shadows.length, {
                    left: controlBox.width / 2,
                    top: controlBox.height / 2,
                    width: 0,
                    height: 0
                  }, {
                    width: radius * 2,
                    height: radius * 2,
                    left: -radius + controlBox.width / 2,
                    top: -radius + controlBox.height / 2,
                    ease: Power4.easeOut,
                    onStart: function() {
                      wrapper.classList.add('state-' + shadowName);
                    }
                  });
                })(
                  shadows[i].getAttribute('data-shadow'),
                  i === 0
                    ? controlBox.width / 2 * 1.25
                    : targetRadius / Math.pow(shadows.length, 2) * Math.pow(i + 1, 2)
                );
              }
            }
          });

          wrapper.addEventListener('mouseup', function() {
            var shadowName;

            timeline.duration(duration / 4);
            timeline.reverse();

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

  // left to right
  module.initCurtain = function(curtain, context) {
    var wrappers, shadows, timeline, i;

    if (!context) {
      context = document;
    }

    wrappers = context.querySelectorAll('[data-magic-control="curtain"]');
    shadows = curtain.querySelectorAll('[data-shadow]');

    if (wrappers) {
      for (i = 0; i < wrappers.length; i++) {
        (function(wrapper, duration) {
          var i, resetTimeout;

          wrapper.addEventListener('mousedown', function() {
            window.clearTimeout(resetTimeout);

            curtain.classList.add('state-0');

            timeline = new TimelineLite();

            if (shadows) {
              for (i = 0; i < shadows.length; i++) {
                (function(shadowName, sizeCoefficient) {
                  timeline.fromTo(shadows[i], duration / shadows.length, {
                    width: 0
                  }, {
                    width: sizeCoefficient * 100 + '%',
                    ease: Power4.easeOut,
                    onStart: function() {
                      curtain.classList.add('state-' + shadowName);
                    }
                  });
                })(
                  shadows[i].getAttribute('data-shadow'),
                  2 / 3 + 1 / 3 / (shadows.length - 1) * i
                );
              }
            }
          });

          wrapper.addEventListener('mouseup', function() {
            var shadowName;

            timeline.duration(duration / 4);
            timeline.reverse();

            resetTimeout = window.setTimeout(function() {
              curtain.classList.remove('state-0');

              for (i = 0; i < shadows.length; i++) {
                shadowName = shadows[i].getAttribute('data-shadow');

                curtain.classList.remove('state-' + shadowName);
              }
            }, duration * 1000 / 4);
          });
        })(
          wrappers[i],
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

magicControls.initRadial();
magicControls.initCurtain(document.querySelector('#common-curtain'));

