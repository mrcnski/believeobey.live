---
# You don't need to edit this file, it's empty on purpose.
# Edit theme's home layout instead if you wanna make some changes
# See: https://jekyllrb.com/docs/themes/#overriding-theme-defaults
layout: home
title: "Home"
---

# Home

<!-- {% include image.html name="index-header.jpeg" alt="Believe, Live, Obey." %} -->

<div class="card-grid">
  <div class="card">
    <div class="card-content">
      <h3 class="card-title"><a href="/about">What is this site about?</a></h3>
      <div class="card-description">Find out about Scriptural belief and obedience.</div>
    </div>
  </div>

  <div class="card">
    <div class="card-content">
      <h3 class="card-title"><a href="{{ site.updates }}">Recent updates</a></h3>
      <div class="card-description">See the latest changes and additions to the site.</div>
    </div>
  </div>
</div>

<br>

## Studies

<div class="card-grid">
{% for page in site.posts %}
{% unless page.hidden or page.more %}
{% include post-info.html description=1 %}
{% endunless %}
{% endfor %}
</div>

<br>

<script src="/assets/js/anchorize.js"></script>
<script async src="https://talk.hyvor.com/embed/newsletter.js" type="module"></script>
<hyvor-talk-newsletter website-id="12077"></hyvor-talk-newsletter>
