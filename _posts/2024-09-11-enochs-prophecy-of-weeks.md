---
title: "Enoch's Prophecy Of Weeks!"
categories: prophecy apocrypha
more: true
---

- 1 pixel = 1 year.
- Viewing this on mobile is probably not a good idea.
- See also [this page](/pow) for a comparison of the PoW with the Septuagint timeline.

<br>
<style>canvas { width: fit-content } </style>
<canvas id="canvas" width="8000" height="375"></canvas>

**Week 1:** I was born the seventh in the first week, While judgement and righteousness still endured. [(Enoch 93:3)](https://parallel.thebookofenoch.info/#93)

**Week 2:** And after me there shall arise in the second week great wickedness, And deceit shall have sprung up; And in it there shall be the first end. And in it a man shall be saved; And after it is ended unrighteousness shall grow up, And a law shall be made for the sinners. [(Enoch 93:4)](https://parallel.thebookofenoch.info/#93)

**Week 3:** And after that in the third week at its close A man shall be elected as the plant of righteous judgement, And his posterity shall become the plant of righteousness for evermore. [(Enoch 93:4)](https://parallel.thebookofenoch.info/#93)

**Week 4:** And after that in the fourth week, at its close, Visions of the holy and righteous shall be seen, And a law for all generations and an enclosure shall be made for them. [(Enoch 93:6)](https://parallel.thebookofenoch.info/#93)

**Week 5:** And after that in the fifth week, at its close, The house of glory and dominion shall be built for ever. [(Enoch 93:7)](https://parallel.thebookofenoch.info/#93)

**Week 6:** And after that in the sixth week all who live in it shall be blinded, And the hearts of all of them shall godlessly forsake wisdom. And in it a man shall ascend; And at its close the house of dominion shall be burnt with fire, And the whole race of the chosen root shall be dispersed. [(Enoch 93:8)](https://parallel.thebookofenoch.info/#93)

**Week 7:** And after that in the seventh week shall an apostate generation arise, And many shall be its deeds, And all its deeds shall be apostate. And at its close shall be elected The elect righteous of the eternal plant of righteousness, To receive sevenfold instruction concerning all His creation. [(Enoch 93:9-10)](https://parallel.thebookofenoch.info/#93)

**Week 8:** And after that there shall be another, the eighth week, that of righteousness, And a sword shall be given to it that a righteous judgement may be executed on the oppressors, And sinners shall be delivered into the hands of the righteous. And at its close they shall acquire houses through their righteousness, And a house shall be built for the Great King in glory for evermore, And all mankind shall look to the path of uprightness. [(Enoch 91:12-14)](https://parallel.thebookofenoch.info/#91)

**Week 9:** And after that, in the ninth week, the righteous judgement shall be revealed to the whole world, And all the works of the godless shall vanish from all the earth, And the world shall be written down for destruction. [(Enoch 91:14)](https://parallel.thebookofenoch.info/#91)

**Week 10:** And after this, in the tenth week in the seventh part, There shall be the great eternal judgement, In which He will execute vengeance amongst the angels. And the first heaven shall depart and pass away, And a new heaven shall appear, And all the powers of the heavens shall give sevenfold light. [(Enoch 91:15-16)](https://parallel.thebookofenoch.info/#91)


## Notes

1. I believe that the 430 years in Egypt are counted starting from Ya'aqov's arrival there. It seems that many chronologies online get this wrong. *"Now the duration of the Israelites' stay in Egypt was 430 years."* {% include inline-verse.html verse="Exodus 12:40" text-before="(" text-after=")." %} I suppose that their slavery started 30 years later once there was a new pharoah, beginning the 400 years of slavery {% include inline-verse.html verse="Genesis 15:13" text-before="(" text-after=")." %} When Paul mentions there being 430 years from "the promise" {% include inline-verse.html verse="Galatians 3:16-17" text-before="(" text-after=")," %} he is either wrong or people are misinterpreting him (as usual).
1. I stopped doing detailed dates after the Exodus.
1. The date of 4000 for the crucifixion is a common one I saw online. Comparing it with the Prophecy of Weeks with 700-year weeks, it seems like this date is in the right ballpark, albeit possibly slightly early.

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
   ["1500 AD", 960],
   ["2024 AD", 524],
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
