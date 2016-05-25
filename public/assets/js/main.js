var lipsDrawing = function() {
  var module = {}, v = {};

  var options = {
    controlBoxSize: 38,
    upperCurvatureOffset: 100,
    lowerCurvatureOffset: 70,
    threshold: 0.9,
    pointDiff: 0.005,
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
    v.upperControlArrow = v.upperControl.querySelector('div.arrow');
    v.upperTrajectory = document.querySelector('#lips-drawing-upper-trajectory');
    v.lowerControl = document.querySelector('#lips-drawing-lower-control');
    v.lowerControlArrow = v.lowerControl.querySelector('div.arrow');
    v.lowerTrajectory = document.querySelector('#lips-drawing-lower-trajectory');
  };

  function calculateTrajectoryPoint(t, prev, upper) {
    var containerBox, availWidth, point, prevPoint;

    containerBox = v.container.getBoundingClientRect();
    availWidth = containerBox.width - options.controlBoxSize;

    point = {
      x: t * availWidth,
      y: 2 * t * (1 - t) * (upper ? -options.upperCurvatureOffset : -options.lowerCurvatureOffset),
      angle: null
    };

    if (!prev) {
      if (t < options.pointDiff) {
        prevPoint = calculateTrajectoryPoint(t + options.pointDiff, true, upper);
        point.angle = Math.atan2(prevPoint.y - point.y, prevPoint.x - point.x);
      } else {
        prevPoint = calculateTrajectoryPoint(t - options.pointDiff, true, upper);
        point.angle = Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x);
      }

      point.angle /= -2 * Math.PI / 360;
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
    (function() {
      var point;

      point = calculateTrajectoryPoint(0, null, true);

      v.upperControlArrow.style.transform = 'rotate(' + (point.angle) + 'deg)';
    })();

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
              point = calculateTrajectoryPoint(o.x, null, true);

              v.upperControl.style.right = point.x + 'px';
              v.upperControl.style.top = point.y + 'px';
              v.upperControlArrow.style.transform = 'rotate(' + (point.angle) + 'deg)';
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

        point = calculateTrajectoryPoint(upperX / availWidth, null, true);

        v.upperControl.style.right = point.x + 'px';
        v.upperControl.style.top = point.y + 'px';
        v.upperControlArrow.style.transform = 'rotate(' + (point.angle) + 'deg)';
      }
    }, false);
  };

  module.initLower = function() {
    (function() {
      var point;

      point = calculateTrajectoryPoint(0, null, false);

      v.lowerControlArrow.style.transform = 'rotate(' + (point.angle + 180) + 'deg)';
    })();

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
              point = calculateTrajectoryPoint(o.x, null, false);

              v.lowerControl.style.left = point.x + 'px';
              v.lowerControl.style.bottom = point.y + 'px';
              v.lowerControlArrow.style.transform = 'rotate(' + (point.angle + 180) + 'deg)';
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

        point = calculateTrajectoryPoint(lowerX / availWidth, null, false);

        v.lowerControl.style.left = point.x + 'px';
        v.lowerControl.style.bottom = point.y + 'px';
        v.lowerControlArrow.style.transform = 'rotate(' + (point.angle + 180) + 'deg)';
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

  module.initCurtain = function(curtain, context) {
    var wrappers, i;

    if (!context) {
      context = document;
    }

    wrappers = context.querySelectorAll('[data-magic-control="curtain"]');

    if (wrappers) {
      for (i = 0; i < wrappers.length; i++) {
        (function(wrapper, duration) {
          if (wrapper.hasAttribute('data-fold')) {
            wrapper.addEventListener('click', function() {
              if (duration) {
                curtain.overrideFoldDuration(duration);
              }

              curtain.fold();
            });
          }

          if (wrapper.hasAttribute('data-unfold')) {
            wrapper.addEventListener('click', function() {
              if (duration) {
                curtain.overrideUnfoldDuration(duration);
              }

              curtain.unfold();
            });
          }
        })(
          wrappers[i],
          +wrappers[i].getAttribute('data-duration')
        );
      }
    }
  };

  module.initCurtainCloseTrigger = function(curtain, close) {
    close.addEventListener('click', function() {
      curtain.unfold();
    });
  };

  return module;
}();

////

var MagicCurtain = function(curtain) {
  var options = {
    durations: {
      fold: 1, // default, in seconds
      unfold: 0.25 // default, in seconds
    }
  };

  var initialised = false, timeline, shadows;

  this.overrideFoldDuration = function(duration) {
    options.durations.fold = duration;
  };

  this.overrideUnfoldDuration = function(duration) {
    options.durations.unfold = duration;
  };

  this.init = function() {
    var firstShadowName = null;

    shadows = curtain.querySelectorAll('[data-shadow]');

    timeline = new TimelineLite();

    if (shadows) {
      for (i = 0; i < shadows.length; i++) {
        (function(shadowName, sizeCoefficient) {
          if (firstShadowName === null) {
            firstShadowName = shadowName;
          }

          timeline.fromTo(shadows[i], options.durations.fold / shadows.length, {
            width: 0
          }, {
            width: sizeCoefficient * 100 + '%',
            ease: Power4.easeOut,
            onStart: function() {
              curtain.classList.add('state-' + shadowName);

              //noinspection JSReferencingMutableVariableFromClosure
              if (shadowName === firstShadowName) {
                curtain.classList.add('state-0');
              }
            },
            onReverseComplete: function() {
              curtain.classList.remove('state-' + shadowName);

              //noinspection JSReferencingMutableVariableFromClosure
              if (shadowName === firstShadowName) {
                curtain.classList.remove('state-0');
              }
            }
          });
        })(
          shadows[i].getAttribute('data-shadow'),
          2 / 3 + 1 / 3 / (shadows.length - 1) * i
        );
      }
    }

    timeline.pause();

    initialised = true;
  };

  this.fold = function() {
    if (!initialised) {
      console.error('Timeline not initialised.');
      return;
    }

    if (timeline.reversed()) {
      timeline.reverse();
    }

    timeline.duration(options.durations.fold);
    timeline.play();
  };

  this.unfold = function() {
    if (!initialised) {
      console.error('Timeline not initialised.');
      return;
    }

    timeline.duration(options.durations.unfold);
    timeline.reverse();
  };

  this.foldAt = function(coefficient) {
    if (!initialised) {
      console.error('Timeline not initialised.');
      return;
    }

    timeline.seek(coefficient, false);
    timeline.pause();
  };
};

var FancyText = function(wrapper) {
  var options = {
    durations: {
      folding: 0.6,
      unfolding: 0.3
    }
  };

  var wrapperBox, main, shadowA, shadowB, timeline;

  wrapperBox = wrapper.getBoundingClientRect();

  main = wrapper.querySelector('div.main');
  shadowA = wrapper.querySelector('div.shadow-a');
  shadowB = wrapper.querySelector('div.shadow-b');

  wrapper.style.height = wrapperBox.height + 'px';
  main.style.height = '0';
  shadowA.style.height = '0';
  shadowB.style.height = '0';

  wrapper.classList.add('ready');

  timeline = new TimelineLite();

  timeline.to(shadowA, options.durations.folding / 3, {
    height: wrapperBox.height
  });

  timeline.to(shadowB, options.durations.folding / 3, {
    height: wrapperBox.height
  });

  timeline.to(main, options.durations.folding / 3, {
    height: wrapperBox.height,
    onComplete: function() {
      wrapper.classList.remove('ready');
    }
  });

  timeline.pause();

  this.fold = function() {
    if (timeline.reversed()) {
      timeline.reverse();
      wrapper.classList.add('ready');
    }

    timeline.duration(options.durations.folding);
    timeline.play();
  };

  this.unfold = function() {
    wrapper.classList.add('ready');

    timeline.duration(options.durations.unfolding);
    timeline.reverse();
  };
};

FancyText.initWrappers = function(context) {
  var i, wrappers;

  if (!context) {
    context = document;
  }

  wrappers = context.querySelectorAll('[data-fancy-text]');

  if (wrappers) {
    for (i = 0; i < wrappers.length; i++) {
      (function(wrapper, main, shadowA, shadowB) {
        shadowA = document.createElement('div');

        shadowA.innerHTML = main.innerHTML;
        shadowA.classList.add('shadow-a');

        wrapper.appendChild(shadowA);

        shadowB = document.createElement('div');

        shadowB.innerHTML = main.innerHTML;
        shadowB.classList.add('shadow-b');

        wrapper.appendChild(shadowB);
      })(
        wrappers[i],
        wrappers[i].querySelector('div.main')
      );
    }
  }
};

////

// lipsDrawing.query();
// lipsDrawing.initUpper();
// lipsDrawing.initLower();

///

// magicControls.initRadial();

// var commonCurtain = new MagicCurtain(document.querySelector('#common-curtain'));
// commonCurtain.init();
// magicControls.initCurtain(commonCurtain);
// magicControls.initCurtainCloseTrigger(commonCurtain, document.querySelector('#common-curtain-close-trigger'));

///

// FancyText.initWrappers();
//
// var myFancyText = new FancyText(document.querySelector('#my-fancy-text'));
// myFancyText.fold();
//
// window.setTimeout(function() {
//   myFancyText.unfold();
//
//   window.setTimeout(function() {
//     myFancyText.fold();
//
//     window.setTimeout(function() {
//       myFancyText.unfold();
//     }, 2000);
//   }, 2000);
// }, 2000);

