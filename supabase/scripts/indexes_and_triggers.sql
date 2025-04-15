-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_stories_author_id ON stories(author_id);
CREATE INDEX IF NOT EXISTS idx_story_pages_story_id ON story_pages(story_id);
CREATE INDEX IF NOT EXISTS idx_stories_keywords_story_id ON stories_keywords(story_id);
CREATE INDEX IF NOT EXISTS idx_stories_keywords_keyword_id ON stories_keywords(keyword_id);
CREATE INDEX IF NOT EXISTS idx_homepage_section_name ON homepage(section_name);
CREATE INDEX IF NOT EXISTS idx_homepage_section_section_id ON homepage_section(section_id);
CREATE INDEX IF NOT EXISTS idx_homepage_section_locale_id ON homepage_section(locale_id);

-- Add trigger for updating modified_at timestamp
CREATE OR REPLACE FUNCTION update_modified_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.modified_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for updating stories modified_at timestamp
DROP TRIGGER IF EXISTS update_stories_modified_at ON stories;
CREATE TRIGGER update_stories_modified_at
    BEFORE UPDATE ON stories
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_at_column();

-- Add trigger for updating homepage updated_at timestamp
DROP TRIGGER IF EXISTS update_homepage_updated_at ON homepage;
CREATE TRIGGER update_homepage_updated_at
    BEFORE UPDATE ON homepage
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_at_column();

-- Add trigger for updating homepage_section updated_at timestamp
DROP TRIGGER IF EXISTS update_homepage_section_updated_at ON homepage_section;
CREATE TRIGGER update_homepage_section_updated_at
    BEFORE UPDATE ON homepage_section
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_at_column(); 