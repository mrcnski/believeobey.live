---
title: "Enoch's Prophecy Of Weeks!"
categories: prophecy apocrypha
more: true
---

- 1 pixel = 1 year.
- Viewing this on mobile is probably not a good idea.
- See also [this page](/pow) for a comparison of the PoW with the Septuagint timeline.

## Timelines

<div style="overflow-x: auto; border: 1px solid #cfcfcf; margin-bottom: 15px;">
    <canvas id="canvas" width="8000" height="320"></canvas>
</div>

(Scroll right to view more.)

{% include weeks.html %}

<script>
 const COLORS = [
   "#c3e0e5"
 ];
 const LABEL_COLOR = "#000000";
 const WEEK_LINE_COLOR = "#9EA3B0";
 const YEAR_2_COLOR = "#546A7B";
 const START_X = 160;
 const BAR_HEIGHT = 15;

 const LABEL_FONT = "14px Verdana";
 const DESCENT_FONT = "11px Verdana";
 const YEAR_FONT = "11px Verdana";
 const YEAR_2_FONT = "9px Verdana";

 const canvas = document.getElementById("canvas");
 const ctx = canvas.getContext("2d");

 // Handle HiDPI displays for sharp rendering
 const dpr = window.devicePixelRatio || 1;
 const displayWidth = canvas.width;
 const displayHeight = canvas.height;

 canvas.width = displayWidth * dpr;
 canvas.height = displayHeight * dpr;

 canvas.style.width = displayWidth + 'px';
 canvas.style.height = displayHeight + 'px';

 ctx.scale(dpr, dpr);

 class Timeline {
   constructor(label, isWeeks, bars, absoluteYears = false) {
     this.currentX = START_X;
     this.currentEnd = 0;
     this.currentYear = 0;
     this.label = label;
     this.isWeeks = isWeeks;
     this.bars = bars;
     this.absoluteYears = absoluteYears;
   }

   drawLabel(y) {
     ctx.fillStyle = LABEL_COLOR;
     ctx.textAlign = 'center';
     ctx.font = LABEL_FONT;
     let currentY = y + 5;
     for (const line of this.label.split('\n')) {
       ctx.fillText(line, 75, currentY);
       currentY += 16;
     }
   }

   drawBar(years, name, i, y) {
     ctx.fillStyle = COLORS[i % COLORS.length];
     let interval;
     if (this.absoluteYears) {
       interval = START_X + years - this.currentEnd;
       this.currentEnd = START_X + years;
       this.currentYear = years;
     } else {
       interval = years;
       this.currentEnd = this.currentX + years;
       this.currentYear += years;
     }
     ctx.fillRect(this.currentX, y, interval, BAR_HEIGHT);
     this.currentX = this.currentEnd;

     // Name label.
     if (name != "Arpakshad") {
       ctx.fillStyle = LABEL_COLOR;
       ctx.textAlign = 'center';
       ctx.font = DESCENT_FONT;
       const offset = (this.isWeeks || i % 2 === 0) ? 18 : 35;
       ctx.fillText(name, this.currentEnd, y + BAR_HEIGHT + offset);
     }

     // Boundary.
     ctx.lineWidth = 1
     ctx.strokeStyle = LABEL_COLOR;
     ctx.beginPath();
     ctx.moveTo(this.currentEnd, y);
     ctx.lineTo(this.currentEnd, y + BAR_HEIGHT);
     ctx.stroke();
     if (this.isWeeks && name != "Week 1") {
       ctx.strokeStyle = WEEK_LINE_COLOR;
       ctx.beginPath();
       ctx.moveTo(this.currentEnd, 1);
       ctx.lineTo(this.currentEnd, y);
       ctx.stroke();
       ctx.strokeStyle = "white";
       ctx.beginPath();
       ctx.moveTo(this.currentEnd+1, 1);
       ctx.lineTo(this.currentEnd+1, y);
       ctx.stroke();
     }

     // Year.
     if (name != "Arpakshad") {
       ctx.font = YEAR_FONT;
       ctx.fillText(this.currentYear, this.currentEnd, y - 3);

       if (years > 35) {
         ctx.font = YEAR_2_FONT;
         ctx.fillStyle = YEAR_2_COLOR;
         let oldBaseline = ctx.textBaseline;
         ctx.textBaseline = "middle";
         ctx.fillText(interval, this.currentEnd - interval / 2, y + BAR_HEIGHT / 2);
         ctx.textBaseline = oldBaseline;
       }
     }
   }

   drawTimeline(y) {
     this.drawLabel(y);

     for (let i = 0; i < this.bars.length; i++) {
       const [name, years] = this.bars[i];
       this.drawBar(years, name, i, y);
     }
   }

 }

 // Masoretic. 1656 years from A'dam to Flood.
 const MASORETIC = new Timeline("Masoretic\ntimeline", false, [
   ["A'dam", 0],
   ["Sheth", 130],
   ["Enosh", 105],
   ["Qeynan", 90],
   ["Mahalal’el", 70],
   ["Yered", 65],
   ["Chanok", 162],
   ["Methushelach", 65],
   ["Lamek", 187],
   ["Noach", 182],
   ["Flood", 600],
   ["Arpakshad", 2],
   ["Shelach", 35],
   ["Eber", 30],
   ["Peleg", 34],
   ["Re'u", 30],
   ["Serug", 32],
   ["Nachor", 30],
   ["Terach", 29],
   ["Abram", 70],
   ["Yitshaq", 100],
   ["Ya'aqov", 60],
   // "Jacob lived in the land of Egypt seventeen years; so the days of Jacob, the years of his life, were 147 years." Genesis 47:28
   ["Ya'aqov in Egypt¹", 130],
   // "Now the duration of the Israelites' stay in Egypt was 430 years."- Exodus 12:40
   ["Exodus²", 430],
   ["crucifixion³", 1332],
   ["temple destroyed", 40],
   ["540 AD", 470],
   ["700 AD", 160],
   ["800 AD", 100],
   ["900 AD", 100],
   ["1000 AD", 100],
   ["1100 AD", 100],
   ["1200 AD", 100],
   ["1300 AD", 100],
   ["1400 AD", 100],
   ["1500 AD", 100],
   ["1600 AD", 100],
   ["1700 AD", 100],
   ["1800 AD", 100],
   ["2024 AD", 224],
 ]);

 const OTHER_DATES = new Timeline("Other\ndates", false, [
   ["", 0],
   ["A'dam dies", 930],
   ["Chanok translated", 622 + 365],
 ], true);

 const POW_700 = new Timeline("Prophecy of Weeks\n(700-year weeks)", true, [
   ["Week 1", 0],
   ["Week 2", 700],
   ["Week 3", 700],
   ["Week 4", 700],
   ["Week 5", 700],
   ["Week 6", 700],
   ["Week 7", 700],
   ["Week 8", 700],
   ["Week 9", 700],
   ["Week 10", 700],
   ["Weeks without number...", 700],
 ]);

 // Draw timelines.
 // Draw in reverse order so that the week boundaries are behind the bars.
 POW_700.drawTimeline(280);
 OTHER_DATES.drawTimeline(150);
 MASORETIC.drawTimeline(20);
</script>
