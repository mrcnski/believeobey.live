module Jekyll
  module VerseUrlFilter
    def verse_url(input_url, verse, version)
      return input_url if input_url

      if verse
        book, numbers = verse.split(' ', 2)

        if numbers
          chapter, _verse_num = numbers.split(':', 2)

          if book == 'Enoch'
            return "https://parallel.thebookofenoch.info/##{chapter}"
          end
        end
      end

      version ||= 'WEB'
      "https://www.biblegateway.com/passage/?search=#{verse}&version=#{version}"
    end
  end
end

Liquid::Template.register_filter(Jekyll::VerseUrlFilter)
