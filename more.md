---
layout: home
title: "More Topics"
---

# More Topics

This page is where I go deeper in my exploration of the truth. I have removed these studies from the homepage in order to not distract from the more fundamental topics.

I'm genuinely open to correction, and I would also remind readers that our only teacher is Messiah {% include inline-verse.html verse="Matthew 23:8" text-before="(" text-after=")." %}

## Studies

{% for page in site.posts %}
{% unless page.hidden %}
{% if page.more %}
{% include post-info.html description=1 %}
{% endif %}
{% endunless %}
{% endfor %}

<br>

<script src="/assets/js/anchorize.js"></script>
<script async src="https://talk.hyvor.com/embed/newsletter.js" type="module"></script>
<hyvor-talk-newsletter website-id="12077"></hyvor-talk-newsletter>
