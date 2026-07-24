/* Timeline visualization for the Prophecy of Weeks studies.
 *
 * Shared by /enochs-prophecy-of-weeks/ and /pow/ — each page supplies only its
 * timeline data and calls TimelineViz.render(). The core rule is 1 pixel =
 * 1 year: bar widths, week boundaries, axis ticks, and the hover crosshair
 * all map directly to years.
 *
 * A bar's name is drawn at the segment's END boundary — it labels the event
 * at that boundary (a birth, the Flood, a week starting), not the span.
 */
(function () {
  "use strict";

  var START_X = 160;      // left gutter for the sticky row labels
  var TOP_PAD = 24;
  var ROW_H = 116;
  var BAR_Y = 36;         // bar top, relative to row top
  var BAR_H = 18;
  var AXIS_GAP = 6;       // gap between last row and the axis line
  var AXIS_AREA = 34;     // space under the axis line for ticks + labels
  var TILE_W = 2000;      // CSS px per canvas tile; one full-width canvas is a
                          // single huge GPU texture that janks page scrolling

  var FONT_STACK = "'IBM Plex Sans', Helvetica, sans-serif";
  var FONTS = {
    name: "400 12px " + FONT_STACK,
    year: "400 11px " + FONT_STACK,
    interval: "500 10px " + FONT_STACK,
    axis: "400 10.5px " + FONT_STACK,
  };

  var PALETTES = {
    blue:   { fills: ["#cfe3ee", "#aacfe2"], ink: "#38607a", chip: "#6ea8c9" },
    slate:  { fills: ["#dcdfe6", "#c3c9d4"], ink: "#4a5262", chip: "#9aa3b5" },
    amber:  { fills: ["#f5e2b8", "#ecd193"], ink: "#7c5d1c", chip: "#d9b355" },
    green:  { fills: ["#d3e8cb", "#b6d9aa"], ink: "#3f6635", chip: "#85bd74" },
    purple: { fills: ["#e0d6ef", "#cbbbe3"], ink: "#533f7d", chip: "#a78fd0" },
    rose:   { fills: ["#f4d4d5", "#e9b6b8"], ink: "#7d3e41", chip: "#d8878a" },
  };

  var TEXT = "#111";
  var MUTED = "#6b7280";
  var BAND_TINT = "rgba(217, 179, 85, 0.09)";
  var AXIS_LINE = "rgba(17, 17, 17, 0.15)";
  var TICK = "rgba(17, 17, 17, 0.20)";
  var TICK_MAJOR = "rgba(17, 17, 17, 0.32)";

  var CSS = "" +
    ".tvz-scroll { overflow-x: auto; border: 1px solid #e2e5e9; border-radius: 5px;" +
    "  background: #fdfdfd; margin-bottom: 15px; }" +
    ".tvz-inner { position: relative; }" +
    ".tvz-canvas { position: absolute; top: 0; }" +
    ".tvz-labels { position: sticky; left: 0; width: 0; height: 0; z-index: 3; }" +
    ".tvz-gutter { position: absolute; left: 0; top: 0; width: 160px;" +
    "  background: linear-gradient(90deg, #fdfdfd 72%, rgba(253,253,253,0));" +
    "  pointer-events: none; }" +
    ".tvz-label { position: absolute; left: 0; width: 150px; box-sizing: border-box;" +
    "  padding: 4px 12px 4px 4px; transform: translateY(-50%); text-align: center;" +
    "  font-size: 13px; line-height: 1.3; font-weight: 500; color: #24292f; }" +
    ".tvz-label.tvz-axis-label { font-size: 11px; font-weight: 400; color: #6b7280;" +
    "  font-style: italic; }" +
    ".tvz-chip { display: inline-block; width: 9px; height: 9px; border-radius: 2px;" +
    "  margin-right: 5px; }" +
    ".tvz-cross { position: absolute; top: 0; width: 1px;" +
    "  background: rgba(17, 17, 17, 0.28); pointer-events: none; display: none; }" +
    ".tvz-tip { position: absolute; padding: 1px 7px 2px; background: #1f2933; color: #fff;" +
    "  font-size: 11.5px; border-radius: 4px; pointer-events: none; white-space: nowrap;" +
    "  display: none; z-index: 4; }";

  function hexToRgba(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  }

  function injectStyles() {
    if (document.getElementById("tvz-styles")) return;
    var style = document.createElement("style");
    style.id = "tvz-styles";
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  // Resolve each bar to { name, xStart, xEnd, yearEnd, interval, opts }.
  // Relative mode: years = segment length. Absolute mode: years = cumulative
  // total from the start, so the segment runs from the previous total.
  function resolveBars(timeline) {
    var absolute = timeline.mode === "absolute";
    var prevYear = 0;
    return timeline.bars.map(function (bar) {
      var name = bar[0];
      var years = bar[1];
      var opts = bar[2] || {};
      var yearEnd = absolute ? years : prevYear + years;
      var resolved = {
        name: name,
        opts: opts,
        yearEnd: yearEnd,
        interval: yearEnd - prevYear,
        xStart: START_X + prevYear,
        xEnd: START_X + yearEnd,
      };
      prevYear = yearEnd;
      return resolved;
    });
  }

  function drawWeekBackdrop(ctx, timeline, resolved, rowTop, axisY, width) {
    var weeks = timeline.weeks;
    var boundaries = resolved
      .filter(function (b) { return b.interval > 0; })
      .map(function (b) { return b.xEnd; });
    if (!boundaries.length) return;
    var lastX = boundaries[boundaries.length - 1];

    // Alternating tinted bands across the full height, anchored to this
    // timeline's week boundaries, fading out past the last one ("weeks
    // without number").
    if (weeks.bands) {
      var edges = [START_X].concat(boundaries);
      for (var i = 0; i + 1 < edges.length; i++) {
        if (i % 2 === 1) {
          ctx.fillStyle = BAND_TINT;
          ctx.fillRect(edges[i], 6, edges[i + 1] - edges[i], axisY - 6);
        }
      }
      if (edges.length % 2 === 0) {
        var fadeW = Math.min(320, width - lastX);
        var fade = ctx.createLinearGradient(lastX, 0, lastX + fadeW, 0);
        fade.addColorStop(0, BAND_TINT);
        fade.addColorStop(1, "rgba(217, 179, 85, 0)");
        ctx.fillStyle = fade;
        ctx.fillRect(lastX, 6, fadeW, axisY - 6);
      }
    }

    // Boundary lines from the top of the chart down to this row's bar.
    ctx.strokeStyle = weeks.lineColor || "rgba(124, 93, 28, 0.28)";
    ctx.lineWidth = 1;
    ctx.setLineDash(weeks.lineDash || []);
    boundaries.forEach(function (x) {
      if (x > width) return;
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 6);
      ctx.lineTo(x + 0.5, rowTop + BAR_Y + BAR_H);
      ctx.stroke();
    });
    ctx.setLineDash([]);
  }

  function drawTimelineRow(ctx, timeline, resolved, rowTop, width) {
    var palette = PALETTES[timeline.palette] || PALETTES.blue;
    var isWeeks = !!timeline.weeks;
    var barY = rowTop + BAR_Y;
    var totalStart = resolved.length ? resolved[0].xStart : START_X;
    var totalEnd = resolved.length ? resolved[resolved.length - 1].xEnd : START_X;

    // Round the ends of the whole strip (clip only affects the fills).
    var canRound = typeof ctx.roundRect === "function" && totalEnd > totalStart;
    if (canRound) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(totalStart, barY, totalEnd - totalStart, BAR_H, 3);
      ctx.clip();
    }
    resolved.forEach(function (bar, i) {
      if (bar.interval <= 0) return;
      ctx.fillStyle = palette.fills[i % 2];
      ctx.fillRect(bar.xStart, barY, bar.interval, BAR_H);
    });
    if (canRound) ctx.restore();

    // Weeks "without number" continue past the last boundary: fade the bar
    // out instead of ending it hard.
    if (isWeeks && totalEnd > totalStart && totalEnd < width) {
      var tailW = Math.min(240, width - totalEnd);
      var nextFill = palette.fills[resolved.length % 2];
      var tail = ctx.createLinearGradient(totalEnd, 0, totalEnd + tailW, 0);
      tail.addColorStop(0, nextFill);
      tail.addColorStop(1, hexToRgba(nextFill, 0));
      ctx.fillStyle = tail;
      ctx.fillRect(totalEnd, barY, tailW, BAR_H);
    }

    // Names go on one of two lines under the bar. Pick whichever line has
    // room, so neighbors like Flood/Shelach don't run together.
    var laneEnds = [-Infinity, -Infinity];
    resolved.forEach(function (bar, i) {
      var showLabels = bar.name && !bar.opts.hideLabel;

      // Segment boundary.
      if (bar.interval > 0) {
        ctx.strokeStyle = "rgba(17, 17, 17, 0.35)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(bar.xEnd + 0.5, barY);
        ctx.lineTo(bar.xEnd + 0.5, barY + BAR_H);
        ctx.stroke();
      }

      if (!showLabels) return;

      ctx.fillStyle = TEXT;
      ctx.textAlign = "center";
      ctx.font = FONTS.name;
      var half = ctx.measureText(bar.name).width / 2;
      var lane;
      if (bar.xEnd - half >= laneEnds[0] + 10) lane = 0;
      else if (bar.xEnd - half >= laneEnds[1] + 10) lane = 1;
      else lane = laneEnds[0] <= laneEnds[1] ? 0 : 1;
      laneEnds[lane] = bar.xEnd + half;
      ctx.fillText(bar.name, bar.xEnd, barY + BAR_H + (lane === 0 ? 17 : 33));

      // Cumulative year above the boundary.
      ctx.font = FONTS.year;
      ctx.fillStyle = MUTED;
      ctx.fillText(bar.yearEnd, bar.xEnd, barY - 6);

      // Segment length inside the bar, when it fits.
      if (bar.interval > 35) {
        ctx.font = FONTS.interval;
        ctx.fillStyle = palette.ink;
        var oldBaseline = ctx.textBaseline;
        ctx.textBaseline = "middle";
        ctx.fillText(bar.interval, bar.xEnd - bar.interval / 2, barY + BAR_H / 2 + 1);
        ctx.textBaseline = oldBaseline;
      }
    });
  }

  function drawAxis(ctx, axisY, maxYear) {
    var endX = START_X + maxYear;
    ctx.strokeStyle = AXIS_LINE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(START_X, axisY + 0.5);
    ctx.lineTo(endX, axisY + 0.5);
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.font = FONTS.axis;
    for (var year = 0; year <= maxYear; year += 100) {
      var x = START_X + year + 0.5;
      var major = year % 500 === 0;
      ctx.strokeStyle = major ? TICK_MAJOR : TICK;
      ctx.beginPath();
      ctx.moveTo(x, axisY);
      ctx.lineTo(x, axisY + (major ? 8 : 4));
      ctx.stroke();
      if (major) {
        ctx.fillStyle = MUTED;
        ctx.fillText(year, x, axisY + 21);
      }
    }
  }

  function buildLabels(labelHost, config, axisY, height) {
    // Full-height gutter that masks chart content scrolling under the labels.
    var gutter = document.createElement("div");
    gutter.className = "tvz-gutter";
    gutter.style.height = height + "px";
    labelHost.appendChild(gutter);

    config.timelines.forEach(function (timeline, i) {
      var palette = PALETTES[timeline.palette] || PALETTES.blue;
      var div = document.createElement("div");
      div.className = "tvz-label";
      div.style.top = (TOP_PAD + i * ROW_H + BAR_Y + BAR_H / 2) + "px";
      var lines = timeline.label.split("\n");
      lines.forEach(function (line, j) {
        if (j === 0) {
          var chip = document.createElement("span");
          chip.className = "tvz-chip";
          chip.style.background = palette.chip;
          div.appendChild(chip);
        } else {
          div.appendChild(document.createElement("br"));
        }
        div.appendChild(document.createTextNode(line));
      });
      gutter.appendChild(div);
    });

    var axisLabel = document.createElement("div");
    axisLabel.className = "tvz-label tvz-axis-label";
    axisLabel.style.top = (axisY + 12) + "px";
    axisLabel.textContent = "years from A’dam";
    gutter.appendChild(axisLabel);
  }

  // Hover crosshair: 1 pixel = 1 year, so the cursor position reads directly
  // as elapsed years from A'dam (in each chronology's own reckoning).
  function attachCrosshair(inner, scroll, cross, tip, maxYear, height) {
    cross.style.height = height + "px";
    inner.addEventListener("mousemove", function (e) {
      var rect = inner.getBoundingClientRect();
      var x = Math.round(e.clientX - rect.left);
      var year = x - START_X;
      if (year < 0 || year > maxYear) {
        cross.style.display = "none";
        tip.style.display = "none";
        return;
      }
      cross.style.display = "block";
      cross.style.left = x + "px";
      tip.style.display = "block";
      tip.style.top = "6px";
      var viewRight = scroll.scrollLeft + scroll.clientWidth;
      if (x + 90 > viewRight) {
        tip.style.left = (x - 8) + "px";
        tip.style.transform = "translateX(-100%)";
      } else {
        tip.style.left = (x + 8) + "px";
        tip.style.transform = "none";
      }
      tip.textContent = "year " + year;
    });
    inner.addEventListener("mouseleave", function () {
      cross.style.display = "none";
      tip.style.display = "none";
    });
  }

  function render(config) {
    injectStyles();

    var container = typeof config.container === "string"
      ? document.getElementById(config.container)
      : config.container;
    var width = config.width;
    var rows = config.timelines.length;
    var axisY = TOP_PAD + rows * ROW_H + AXIS_GAP;
    var height = axisY + AXIS_AREA;

    var resolvedAll = config.timelines.map(resolveBars);
    var maxYear = 0;
    resolvedAll.forEach(function (resolved) {
      resolved.forEach(function (bar) {
        if (bar.yearEnd > maxYear) maxYear = bar.yearEnd;
      });
    });
    maxYear = Math.min(maxYear, width - START_X);

    // Build the DOM: scroller > inner > (sticky labels, canvas, crosshair).
    var scroll = document.createElement("div");
    scroll.className = "tvz-scroll";
    var inner = document.createElement("div");
    inner.className = "tvz-inner";
    inner.style.width = width + "px";
    var labelHost = document.createElement("div");
    labelHost.className = "tvz-labels";
    var cross = document.createElement("div");
    cross.className = "tvz-cross";
    var tip = document.createElement("div");
    tip.className = "tvz-tip";
    inner.appendChild(labelHost);
    inner.appendChild(cross);
    inner.appendChild(tip);
    scroll.appendChild(inner);
    container.appendChild(scroll);

    // Skip rendering the chart entirely while it is scrolled out of view.
    scroll.style.contentVisibility = "auto";
    scroll.style.containIntrinsicSize = "auto " + height + "px";

    // HiDPI-sharp canvas tiles at a fixed CSS size (1 CSS pixel = 1 year).
    // The tiles are absolutely positioned, so the inner element carries the
    // chart height itself.
    inner.style.height = height + "px";
    var dpr = window.devicePixelRatio || 1;
    var tiles = [];
    for (var x0 = 0; x0 < width; x0 += TILE_W) {
      var tileW = Math.min(TILE_W, width - x0);
      var canvas = document.createElement("canvas");
      canvas.className = "tvz-canvas";
      canvas.width = tileW * dpr;
      canvas.height = height * dpr;
      canvas.style.width = tileW + "px";
      canvas.style.height = height + "px";
      canvas.style.left = x0 + "px";
      inner.insertBefore(canvas, cross);
      tiles.push({ ctx: canvas.getContext("2d"), x: x0, w: tileW });
    }

    function draw() {
      // Each tile runs the same full-chart drawing, shifted by the tile's
      // offset; the canvas bounds clip it to the tile's slice.
      tiles.forEach(function (tile) {
        var ctx = tile.ctx;
        ctx.setTransform(dpr, 0, 0, dpr, -tile.x * dpr, 0);
        ctx.clearRect(tile.x, 0, tile.w, height);

        // Week backdrops first, so bands and boundary lines sit behind the bars.
        config.timelines.forEach(function (timeline, i) {
          if (!timeline.weeks) return;
          drawWeekBackdrop(ctx, timeline, resolvedAll[i], TOP_PAD + i * ROW_H, axisY, width);
        });
        config.timelines.forEach(function (timeline, i) {
          drawTimelineRow(ctx, timeline, resolvedAll[i], TOP_PAD + i * ROW_H, width);
        });
        drawAxis(ctx, axisY, maxYear);
      });
    }

    draw();
    // The webfont may land after the first paint; redraw with the real face.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(draw);
    }

    buildLabels(labelHost, config, axisY, height);
    attachCrosshair(inner, scroll, cross, tip, maxYear, height);
  }

  window.TimelineViz = { render: render };
})();
