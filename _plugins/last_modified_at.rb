require 'jekyll'
require 'open3'

module Jekyll
  module LastModifiedAt
    # Runs git once per path (memoized for the build) and returns both the last
    # commit date and the number of commits touching the file. `git log` lists
    # one line per commit, newest first, so the first line is the last-modified
    # date and the line count is the commit count.
    def git_history(path)
      @git_history_cache ||= {}
      return @git_history_cache[path] if @git_history_cache.key?(path)

      git_cmd = "git log --format=\"%ad\" --date=iso -- #{path}"
      stdout, stderr, status = Open3.capture3(git_cmd)

      result =
        if !status.success?
          Jekyll.logger.warn "Git error for #{path}:", stderr
          { date: nil, count: 0 }
        else
          lines = stdout.split("\n").reject { |line| line.strip.empty? }
          if lines.empty?
            # File is not yet committed; fall back to the filesystem mtime.
            mtime = File.exist?(path) ? File.mtime(path).to_date : nil
            { date: mtime, count: 0 }
          else
            { date: Date.parse(lines.first), count: lines.size }
          end
        end

      @git_history_cache[path] = result
    rescue => e
      Jekyll.logger.error "Error in git_history plugin:", e.message
      { date: nil, count: 0 }
    end

    def last_modified_at(path)
      git_history(path)[:date]
    end

    def commit_count(path)
      git_history(path)[:count]
    end

    # --- dependency-aware variants -----------------------------------------
    # A page may declare other source files it is built from (e.g. the shared
    # `weeks.html` include) via a `dependencies:` list in its front matter.
    # These variants take the page itself and fold each dependency's git
    # history into the result, so editing a dependency bumps the page's "last
    # updated" even when the page's own file was untouched.
    def dependency_paths(page)
      own = page['path']
      deps = page['dependencies'] || []
      deps = [deps] unless deps.is_a?(Array)
      ([own] + deps).compact
    end

    def last_modified_at_with_deps(page)
      dependency_paths(page).map { |p| git_history(p)[:date] }.compact.max
    end

    def commit_count_with_deps(page)
      dependency_paths(page).sum { |p| git_history(p)[:count] }
    end

    # Full commit list (newest first) for a path, parsed into hashes with
    # string keys so Liquid can read them (c.sha, c.date, c.subject, c.file).
    def git_log_entries(path)
      @git_log_cache ||= {}
      return @git_log_cache[path] if @git_log_cache.key?(path)

      # %at (author UNIX timestamp) is carried alongside the short display date
      # so we can sort precisely — %ad --date=short ties same-day commits.
      cmd = "git log --format=\"%H%x1f%ad%x1f%s%x1f%at\" --date=short -- #{path}"
      stdout, stderr, status = Open3.capture3(cmd)
      entries =
        if status.success?
          stdout.split("\n").reject { |l| l.strip.empty? }.map do |line|
            sha, date, subject, ts = line.split("\x1f", 4)
            { "sha" => sha, "date" => date, "subject" => subject,
              "ts" => ts.to_i, "file" => path }
          end
        else
          Jekyll.logger.warn "Git error for #{path}:", stderr
          []
        end
      @git_log_cache[path] = entries
    rescue => e
      Jekyll.logger.error "Error in git_log_entries plugin:", e.message
      []
    end

    # Merged commit history across the page and its declared dependencies,
    # newest first, de-duplicated by commit hash.
    def merged_commits(page)
      seen = {}
      dependency_paths(page).each do |path|
        git_log_entries(path).each { |c| seen[c["sha"]] ||= c }
      end
      # Newest first, by precise timestamp (not the day-only display date).
      seen.values.sort_by { |c| -c["ts"] }
    end
  end
end

Liquid::Template.register_filter(Jekyll::LastModifiedAt)
