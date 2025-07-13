---
# You don't need to edit this file, it's empty on purpose.
# Edit theme's home layout instead if you wanna make some changes
# See: https://jekyllrb.com/docs/themes/#overriding-theme-defaults
layout: home
title: "Home"
---

# Home

Welcome to *Believe, Obey, Live*!

Please see the [about page](/about) for more about belief (faith in God and His Son) and obedience (acting and doing according to His words).

{% include image.html name="index-header.jpeg" alt="Believe, Live, Obey." %}

## Studies

{% for page in site.posts %}
{% unless page.hidden or page.more %}
{% include post-info.html description=1 %}
{% endunless %}
{% endfor %}

<br>

<script src="/assets/js/anchorize.js"></script>
<script async src="https://talk.hyvor.com/embed/newsletter.js" type="module"></script>
<hyvor-talk-newsletter website-id="12077"></hyvor-talk-newsletter>
