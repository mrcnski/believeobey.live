require 'jekyll'
require 'open3'

module Jekyll
  module LastModifiedAt
    def last_modified_at(path)
      git_cmd = "git log -1 --format=\"%ad\" --date=iso -- #{path}"
      stdout, stderr, status = Open3.capture3(git_cmd)

      unless status.success?
        Jekyll.logger.warn "Git error for #{path}:", stderr
        return nil
      end

      output = stdout.strip
      if output.empty?
        # File is not yet committed; fall back to the filesystem mtime.
        File.exist?(path) ? File.mtime(path).to_date : nil
      else
        Date.parse(output)
      end
    rescue => e
      Jekyll.logger.error "Error in last_modified_at plugin:", e.message
      nil
    end
  end
end

Liquid::Template.register_filter(Jekyll::LastModifiedAt)
