---
# You don't need to edit this file, it's empty on purpose.
# Edit theme's home layout instead if you wanna make some changes
# See: https://jekyllrb.com/docs/themes/#overriding-theme-defaults
layout: home
---

{% include image.html name="index-header.jpeg" alt="Believe, Live, Obey." %}

# Studies

{% for page in site.posts %}
{% include post-info.html description=1 %}
{% endfor %}

# Other Pages

<h3>
  <a href="/about" class="post-link">About</a>
</h3>
