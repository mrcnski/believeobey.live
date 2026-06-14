serve:
	bundle exec jekyll serve -t -l

serve-docker:
	docker run -p 4000:4000 -v $(shell pwd):/site bretfisher/jekyll-serve

build:
	JEKYLL_ENV=production bundle exec jekyll build

test: build
	bundle exec htmlproofer ./_site --ignore-files "/_site/files/" --swap-urls '^https?\://(www\.)?believeobey\.live:' --ignore-urls "/parallel.thebookofenoch.info/,/www.gnosis.org/,/puritanboard.com/"
