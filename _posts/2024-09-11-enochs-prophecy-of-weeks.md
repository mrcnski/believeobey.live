---
title: "Enoch's Prophecy Of Weeks!"
categories: prophecy apocrypha
more: true
image: enochs-prophecy-of-weeks/1.png
dependencies:
  - _includes/study-fragments/weeks.html
  - assets/js/timeline-viz.js
---

- 1 pixel = 1 year.
- Viewing this on mobile is probably not a good idea.
- See also {% include study-link.html url="/pow" text="this page" %} for a comparison of the PoW with the Septuagint timeline.

## Timelines

<div id="timelines-viz"></div>

(Scroll right to view more.)

{% include study-fragments/weeks.html %}

<script src="/assets/js/timeline-viz.js"></script>
<script>
 // Masoretic. 1656 years from A'dam to Flood.
 const MASORETIC = {
   label: "Masoretic\ntimeline",
   palette: "blue",
   bars: [
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
     ["Arpakshad", 2, { hideLabel: true }],
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
     // "Now the time that the children of Israel lived in Egypt was four hundred thirty years."- Exodus 12:40
     ["Exodus", 430],
     // 1 Kings 6:1: Solomon's temple founded 480 years after the Exodus.
     ["1st temple", 480],
     // Second Temple completed ~516 BC (AM 3454). Its "glory" (Haggai 2:9)
     // lands at the close of week 5.
     ["2nd temple", 306],
     ["crucifixion²", 546],
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
   ],
 };

 const OTHER_DATES = {
   label: "Other\ndates",
   palette: "slate",
   mode: "absolute",
   bars: [
     ["", 0],
     ["A'dam dies", 930],
     ["Chanok translated", 622 + 365],
   ],
 };

 const POW_700 = {
   label: "Prophecy of Weeks\n(700-year weeks)",
   palette: "amber",
   weeks: { bands: true },
   bars: [
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
   ],
 };

 TimelineViz.render({
   container: "timelines-viz",
   width: 8000,
   timelines: [MASORETIC, OTHER_DATES, POW_700],
 });
</script>
