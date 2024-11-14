---
# You don't need to edit this file, it's empty on purpose.
# Edit theme's home layout instead if you wanna make some changes
# See: https://jekyllrb.com/docs/themes/#overriding-theme-defaults
layout: home
---

{% include image.html name="index-header.jpeg" alt="Believe, Live, Obey." %}

# Studies

{% for page in site.posts %}
{% unless page.hidden %}
{% include post-info.html description=1 %}
{% endunless %}
{% endfor %}

# Other Pages

<h3>
  <a href="/about" class="post-link">About</a>
</h3>

<script async src="https://talk.hyvor.com/embed/newsletter.js" type="module"></script>
<hyvor-talk-newsletter website-id="12077"></hyvor-talk-newsletter>
