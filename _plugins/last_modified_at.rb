require 'jekyll'
require 'open3'

module Jekyll
  module LastModifiedAt
    def last_modified_at(path)
      git_cmd = "git log -1 --format=\"%ad\" --date=iso -- #{path}"
      stdout, stderr, status = Open3.capture3(git_cmd)

      if status.success?
        Date.parse(stdout.strip)
      else
        Jekyll.logger.warn "Git error for #{path}:", stderr
        nil
      end
    rescue => e
      Jekyll.logger.error "Error in last_modified_at plugin:", e.message
      nil
    end
  end
end

Liquid::Template.register_filter(Jekyll::LastModifiedAt)
