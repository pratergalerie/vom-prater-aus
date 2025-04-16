-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_stories_author_id ON stories(author_id);
CREATE INDEX IF NOT EXISTS idx_story_pages_story_id ON story_pages(story_id);
CREATE INDEX IF NOT EXISTS idx_stories_keywords_story_id ON stories_keywords(story_id);
CREATE INDEX IF NOT EXISTS idx_stories_keywords_keyword_id ON stories_keywords(keyword_id);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_sections_page_id ON sections(page_id);
CREATE INDEX IF NOT EXISTS idx_sections_name ON sections(name);
CREATE INDEX IF NOT EXISTS idx_sections_type ON sections(type);
CREATE INDEX IF NOT EXISTS idx_section_content_section_id ON section_content(section_id);
CREATE INDEX IF NOT EXISTS idx_section_content_locale_id ON section_content(locale_id);

-- Add trigger for updating modified_at timestamp
CREATE OR REPLACE FUNCTION update_modified_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.modified_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for updating stories modified_at timestamp
DROP TRIGGER IF EXISTS update_stories_modified_at ON stories;
CREATE TRIGGER update_stories_modified_at
    BEFORE UPDATE ON stories
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_at_column();

-- Add trigger for updating pages updated_at timestamp
DROP TRIGGER IF EXISTS update_pages_updated_at ON pages;
CREATE TRIGGER update_pages_updated_at
    BEFORE UPDATE ON pages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add trigger for updating sections updated_at timestamp
DROP TRIGGER IF EXISTS update_sections_updated_at ON sections;
CREATE TRIGGER update_sections_updated_at
    BEFORE UPDATE ON sections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add trigger for updating section_content updated_at timestamp
DROP TRIGGER IF EXISTS update_section_content_updated_at ON section_content;
CREATE TRIGGER update_section_content_updated_at
    BEFORE UPDATE ON section_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  