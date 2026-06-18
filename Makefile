serve:
	bundle exec jekyll serve -t -l

serve-docker:
	docker run -p 4000:4000 -v $(shell pwd):/site bretfisher/jekyll-serve

build: deepen-history
	JEKYLL_ENV=production bundle exec jekyll build

# "Last Updated" needs full git history; Vercel clones with --depth=10 AND has no
# remote configured, so a bare `git fetch --unshallow` is a silent no-op. The fix
# is to fetch from the repo URL reconstructed from Vercel's VERCEL_GIT_* env vars
# (public repo, so no auth needed). No-op locally. Never aborts the build.
deepen-history:
	@echo "== deepen-history =="
	@echo "before: shallow=$$(git rev-parse --is-shallow-repository) commits=$$(git rev-list --count HEAD)"
	@if [ -n "$$VERCEL_GIT_REPO_SLUG" ]; then \
		url="https://$${VERCEL_GIT_PROVIDER:-github}.com/$${VERCEL_GIT_REPO_OWNER}/$${VERCEL_GIT_REPO_SLUG}.git"; \
		echo "fetching full history from $$url ($$VERCEL_GIT_COMMIT_REF)"; \
		git fetch --unshallow "$$url" "$$VERCEL_GIT_COMMIT_REF" \
			|| git fetch "$$url" "$$VERCEL_GIT_COMMIT_REF" \
			|| echo "WARNING: could not deepen history"; \
	else \
		echo "not on Vercel; assuming a complete local clone"; \
	fi
	@echo "after: shallow=$$(git rev-parse --is-shallow-repository) commits=$$(git rev-list --count HEAD)"

test: build
	bundle exec htmlproofer ./_site --ignore-files "/_site/files/" --swap-urls '^https?\://(www\.)?believeobey\.live:' --ignore-urls "/parallel.thebookofenoch.info/,/www.gnosis.org/,/puritanboard.com/"
