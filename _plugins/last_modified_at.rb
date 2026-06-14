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
  end
end

Liquid::Template.register_filter(Jekyll::LastModifiedAt)
