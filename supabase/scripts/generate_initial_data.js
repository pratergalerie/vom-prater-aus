const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { createClient } = require("@supabase/supabase-js");

// Path to the initial-data directory - handle both local and container environments
const DATA_DIR =
  process.env.NODE_ENV === "container"
    ? "/app/initial-data" // Path in container
    : path.join(__dirname, "..", "initial-data"); // Path when running locally

const OUTPUT_FILE =
  process.env.NODE_ENV === "container"
    ? "/app/scripts/initial_data.sql" // Path in container
    : path.join(__dirname, "initial_data.sql"); // Path when running locally

const PASSWORD_OUTPUT_FILE =
  process.env.NODE_ENV === "container"
    ? "/app/scripts/initial-story-passwords.txt"
    : path.join(__dirname, "initial-story-passwords.txt");

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || "http://kong:8000",
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Function to read JSON file
function readJsonFile(filename) {
  const filePath = path.join(DATA_DIR, filename);
  console.log(`Reading file: ${filePath}`);
  const fileContent = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContent);
}

// Function to escape SQL strings
function escapeSqlString(str) {
  if (str === null || str === undefined) return "NULL";
  return `'${String(str).replace(/'/g, "''")}'`;
}

// Function to format array for SQL
function formatArrayForSql(arr) {
  if (!arr || !Array.isArray(arr)) return "NULL";
  return `ARRAY[${arr.map((item) => escapeSqlString(item)).join(", ")}]`;
}

// Function to convert JSON to SQL string
function jsonToSqlString(json) {
  if (!json) return "NULL";
  return escapeSqlString(JSON.stringify(json));
}

// Generate SQL for locales
function generateLocalesSql(locales) {
  let sql = `-- Check if locales table is empty before inserting data
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM locales LIMIT 1) THEN
    -- Insert initial locales
    INSERT INTO locales (code, name)
    VALUES\n`;

  const values = locales
    .map(
      (locale) =>
        `      (${escapeSqlString(locale.code)}, ${escapeSqlString(
          locale.name
        )})`
    )
    .join(",\n");

  sql += values;
  sql += `;
  END IF;
END $$;\n\n`;

  return sql;
}

// Generate SQL for pages
function generatePagesSql(pages) {
  let sql = `-- Check if pages table is empty before inserting data
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pages LIMIT 1) THEN
    -- Insert initial pages
    INSERT INTO pages (slug)
    VALUES\n`;

  const values = pages
    .map((page) => `      (${escapeSqlString(page.slug)})`)
    .join(",\n");

  sql += values;
  sql += `;
  END IF;
END $$;\n\n`;

  return sql;
}

// Generate SQL for sections
function generateSectionsSql(sections) {
  let sql = `-- Check if sections table is empty before inserting data
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM sections LIMIT 1) THEN
    -- Insert sections for home page
    INSERT INTO sections (page_id, type, name, "order")
    SELECT 
      p.id,
      type,
      name,
      "order"
    FROM pages p
    CROSS JOIN (
      VALUES\n`;

  const values = sections
    .map(
      (section) =>
        `        (${escapeSqlString(section.type)}, ${escapeSqlString(
          section.name
        )}, ${section.order})`
    )
    .join(",\n");

  sql += values;
  sql += `\n    ) AS sections(type, name, "order")
    WHERE p.slug = ${escapeSqlString(sections[0].page_slug)};
  END IF;
END $$;\n\n`;

  return sql;
}

// Generate SQL for section content
function generateSectionContentSql(sectionContent) {
  let sql = `-- Check if section_content table is empty before inserting data
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM section_content LIMIT 1) THEN
    -- Insert content for home page sections
    INSERT INTO section_content (
      section_id, 
      locale_id, 
      title, 
      text, 
      button_label, 
      button_link, 
      image_src, 
      image_alt
    )
    SELECT 
      s.id,
      l.id,
      CASE\n`;

  // Generate title case statements
  const titleCases = sectionContent
    .map(
      (content) =>
        `        WHEN s.name = ${escapeSqlString(
          content.section_name
        )} AND l.code = ${escapeSqlString(
          content.locale_code
        )} THEN ${escapeSqlString(content.title)}`
    )
    .join("\n");

  sql += titleCases;
  sql += `\n      END,\n      CASE\n`;

  // Generate text case statements
  const textCases = sectionContent
    .map(
      (content) =>
        `        WHEN s.name = ${escapeSqlString(
          content.section_name
        )} AND l.code = ${escapeSqlString(
          content.locale_code
        )} THEN ${formatArrayForSql(content.text)}`
    )
    .join("\n");

  sql += textCases;
  sql += `\n      END,\n      CASE\n`;

  // Generate button_label case statements
  const buttonLabelCases = sectionContent
    .map(
      (content) =>
        `        WHEN s.name = ${escapeSqlString(
          content.section_name
        )} AND l.code = ${escapeSqlString(
          content.locale_code
        )} THEN ${escapeSqlString(content.button_label)}`
    )
    .join("\n");

  sql += buttonLabelCases;
  sql += `\n      END,\n      CASE\n`;

  // Generate button_link case statements - use unique section names
  const uniqueSections = [
    ...new Set(sectionContent.map((content) => content.section_name)),
  ];
  const buttonLinkCases = uniqueSections
    .map((sectionName) => {
      const content = sectionContent.find(
        (c) => c.section_name === sectionName
      );
      return `        WHEN s.name = ${escapeSqlString(
        sectionName
      )} THEN ${escapeSqlString(content.button_link)}`;
    })
    .join("\n");

  sql += buttonLinkCases;
  sql += `\n      END,\n      CASE\n`;

  // Generate image_src case statements - use unique section names
  const imageSrcCases = uniqueSections
    .map((sectionName) => {
      const content = sectionContent.find(
        (c) => c.section_name === sectionName
      );
      return `        WHEN s.name = ${escapeSqlString(
        sectionName
      )} THEN ${escapeSqlString(content.image_src)}`;
    })
    .join("\n");

  sql += imageSrcCases;
  sql += `\n      END,\n      CASE\n`;

  // Generate image_alt case statements
  const imageAltCases = sectionContent
    .map(
      (content) =>
        `        WHEN s.name = ${escapeSqlString(
          content.section_name
        )} AND l.code = ${escapeSqlString(
          content.locale_code
        )} THEN ${escapeSqlString(content.image_alt)}`
    )
    .join("\n");

  sql += imageAltCases;
  sql += `\n      END\n    FROM 
      sections s
    CROSS JOIN 
      locales l
    WHERE 
      s.name IN (${uniqueSections
      .map((name) => escapeSqlString(name))
      .join(", ")})
    ON CONFLICT (section_id, locale_id) DO NOTHING;
  END IF;
END $$;\n`;

  return sql;
}

// Generate SQL for authors
function generateAuthorsSql(authors) {
  let sql = `-- Check if authors table is empty before inserting data
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM authors LIMIT 1) THEN
    -- Insert authors
    INSERT INTO authors (name, email)
    VALUES\n`;

  const values = authors
    .map(
      (author) =>
        `      (${escapeSqlString(author.name)}, ${escapeSqlString(
          author.email
        )})`
    )
    .join(",\n");

  sql += values;
  sql += `;
  END IF;
END $$;\n\n`;

  return sql;
}

// Generate SQL for keywords
function generateKeywordsSql(keywords) {
  if (!keywords || !Array.isArray(keywords)) {
    console.warn("Keywords data is missing or invalid");
    return "";
  }

  let sql = `-- Check if keywords table is empty before inserting data
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM keywords LIMIT 1) THEN
    -- Insert English keywords
    INSERT INTO keywords (word, locale_id)
    SELECT 
      word,
      l.id
    FROM 
      (VALUES\n`;

  // Generate values for English keywords
  const enValues = keywords
    .filter((keyword) => keyword && keyword.en)
    .map((keyword) => `        (${escapeSqlString(keyword.en)}, 'en')`)
    .join(",\n");

  sql += enValues;
  sql += `\n      ) AS k(word, code)
    JOIN locales l ON l.code = k.code;
      
    -- Insert German keywords
    INSERT INTO keywords (word, locale_id)
    SELECT 
      word,
      l.id
    FROM 
      (VALUES\n`;

  // Generate values for German keywords
  const deValues = keywords
    .filter((keyword) => keyword && keyword.de)
    .map((keyword) => `        (${escapeSqlString(keyword.de)}, 'de')`)
    .join(",\n");

  sql += deValues;
  sql += `\n      ) AS k(word, code)
    JOIN locales l ON l.code = k.code;
  END IF;
END $$;\n\n`;

  return sql;
}

// Function to extract a quote from story text
function extractQuoteFromStory(story) {
  if (!story.pages || !Array.isArray(story.pages)) {
    return null;
  }

  // Find the first page with text content
  const textPage = story.pages.find((page) => page && page.text);
  if (!textPage || !textPage.text) {
    return null;
  }

  // Extract a short quote (first 100 characters or up to the first sentence)
  const text = textPage.text;
  const firstSentence = text.match(/[^.!?]+[.!?]+/);

  if (firstSentence) {
    // Use the first sentence if it's not too long
    const sentence = firstSentence[0].trim();
    if (sentence.length <= 100) {
      return sentence;
    }
  }

  // Otherwise, use the first 100 characters
  return text.substring(0, 100).trim() + "...";
}

function generateRandomPassword(length = 12) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Generate SQL for stories
function generateStoriesSql(stories, passwordMap) {
  if (!stories || !Array.isArray(stories)) {
    console.warn("Stories data is missing or invalid");
    return "";
  }

  let sql = `-- Insert stories if the table is empty
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM stories LIMIT 1) THEN
    -- Insert stories
    INSERT INTO stories (title, slug, author_id, locale_id, year, status, featured_image, featured, quote, password)
    SELECT 
      s.title,
      s.slug,
      a.id,
      l.id,
      s.year,
      s.status,
      CASE 
        WHEN s.featured_image IS NOT NULL 
        THEN 'http://localhost:8000/storage/v1/object/public/stories-storage/' || s.featured_image
        ELSE NULL
      END,
      s.featured,
      s.quote,
      s.password
    FROM 
      (VALUES\n`;

  // Generate values for stories
  const storyValues = stories
    .filter(
      (story) =>
        story &&
        story.title &&
        story.slug &&
        story.author_email &&
        story.locale_code
    )
    .map((story) => {
      // Find the first image from story pages to use as featured_image
      let featuredImage = null;
      if (story.pages && Array.isArray(story.pages)) {
        const firstImagePage = story.pages.find((page) => page && page.image);
        if (firstImagePage) {
          featuredImage = firstImagePage.image;
        }
      }

      // Extract a quote from the story text
      const quote = extractQuoteFromStory(story);

      // Generate and hash password
      const plainPassword = generateRandomPassword();
      const hash = bcrypt.hashSync(plainPassword, 10);
      story.password = hash;
      passwordMap[story.slug] = plainPassword;

      return `        (${escapeSqlString(story.title)}, ${escapeSqlString(
        story.slug
      )}, ${escapeSqlString(story.author_email)}, ${escapeSqlString(
        story.locale_code
      )}, ${story.year || 0}, ${escapeSqlString(
        story.status || "draft"
      )}, ${escapeSqlString(featuredImage)}, ${story.featured ? "TRUE" : "FALSE"
        }, ${escapeSqlString(quote)}, ${escapeSqlString(hash)})`;
    })
    .join(",\n");

  sql += storyValues;
  sql += `\n      ) AS s(title, slug, author_email, locale_code, year, status, featured_image, featured, quote, password)
    JOIN authors a ON a.email = s.author_email
    JOIN locales l ON l.code = s.locale_code;

    -- Insert story pages
    INSERT INTO story_pages (story_id, layout, text, image, page_order)
    SELECT 
      s.id,
      p.layout,
      p.text,
      CASE 
        WHEN p.image IS NOT NULL 
        THEN 'http://localhost:8000/storage/v1/object/public/stories-storage/' || p.image
        ELSE NULL
      END,
      p.page_order
    FROM 
      stories s
    CROSS JOIN (
      VALUES\n`;

  // Generate values for story pages
  const pageValues = [];
  stories.forEach((story) => {
    if (story && story.pages && Array.isArray(story.pages)) {
      story.pages.forEach((page) => {
        if (page && page.layout && page.text) {
          pageValues.push(
            `        (${escapeSqlString(story.title)}, ${escapeSqlString(
              page.layout
            )}, ${escapeSqlString(page.text)}, ${escapeSqlString(
              page.image || "NULL"
            )}, ${page.page_order || 0})`
          );
        }
      });
    }
  });

  sql += pageValues.join(",\n");
  sql += `\n      ) AS p(title, layout, text, image, page_order)
    WHERE s.title = p.title;

    -- Insert story-keyword relationships
    INSERT INTO stories_keywords (story_id, keyword_id)
    SELECT 
      s.id,
      k.id
    FROM 
      stories s
    CROSS JOIN (
      VALUES\n`;

  // Generate values for story-keyword relationships
  const keywordValues = [];
  stories.forEach((story) => {
    if (story && story.keywords && Array.isArray(story.keywords)) {
      story.keywords.forEach((keyword) => {
        if (keyword) {
          keywordValues.push(
            `        (${escapeSqlString(story.title)}, ${escapeSqlString(
              keyword
            )}, ${escapeSqlString(story.locale_code)})`
          );
        }
      });
    }
  });

  sql += keywordValues.join(",\n");
  sql += `\n      ) AS sk(title, keyword, locale_code)
    JOIN keywords k ON k.word = sk.keyword
    JOIN locales l ON l.id = k.locale_id AND l.code = sk.locale_code
    WHERE s.title = sk.title;
  END IF;
END $$;\n\n`;

  return sql;
}

// Function to create admin user using Supabase Auth
async function createAdminUser() {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    console.error(
      "Error: ADMIN_EMAIL and ADMIN_PASSWORD environment variables must be set"
    );
    process.exit(1);
  }

  const maxRetries = 10;
  const retryDelay = 3000; // 3 seconds

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt} to create admin user...`);
      const { data, error } = await supabase.auth.signUp({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        options: {
          data: {
            role: "admin",
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        console.log("User created successfully:", data.user.email);

        // Confirm the email since we're in a trusted environment
        const { error: confirmError } =
          await supabase.auth.admin.updateUserById(data.user.id, {
            email_confirm: true,
          });

        if (confirmError) throw confirmError;

        return;
      }
      return;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      if (attempt === maxRetries) {
        console.error("Max retries reached. Exiting...");
        process.exit(1);
      }
      console.log(
        `Waiting ${retryDelay / 1000} seconds before next attempt...`
      );
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
}

// Main function to generate the SQL file
function generateSqlFile() {
  try {
    console.log("Starting SQL generation...");
    console.log(`Data directory: ${DATA_DIR}`);

    // Check if initial_data.sql is a directory and remove it
    try {
      const stats = fs.statSync(OUTPUT_FILE);
      if (stats.isDirectory()) {
        console.log("Removing existing initial_data.sql directory...");
        fs.rmSync(OUTPUT_FILE, { recursive: true, force: true });
      }
    } catch (err) {
      // File doesn't exist, which is fine
    }

    // Read JSON files
    console.log("Reading JSON files...");
    const locales = readJsonFile("locales.json");
    const pages = readJsonFile("pages.json");
    const sections = readJsonFile("sections.json");
    const sectionContent = readJsonFile("section_content.json");
    const authors = readJsonFile("authors.json");
    const keywords = readJsonFile("keywords.json");
    const stories = readJsonFile("stories.json");

    // Generate SQL
    console.log("Generating SQL...");
    let sql = "";
    sql += generateLocalesSql(locales);
    sql += generatePagesSql(pages);
    sql += generateSectionsSql(sections);
    sql += generateSectionContentSql(sectionContent);
    sql += generateAuthorsSql(authors);
    sql += generateKeywordsSql(keywords);
    const passwordMap = {};
    sql += generateStoriesSql(stories, passwordMap);

    // Write to file
    console.log(`Writing SQL to ${OUTPUT_FILE}...`);
    fs.writeFileSync(OUTPUT_FILE, sql);
    console.log(`SQL file generated successfully at ${OUTPUT_FILE}`);

    // Write passwords to a file
    console.log(`Writing passwords to ${PASSWORD_OUTPUT_FILE}...`);
    const passwordLines = Object.entries(passwordMap)
      .map(([slug, password]) => `${slug}: ${password}`)
      .join("\n");
    fs.writeFileSync(PASSWORD_OUTPUT_FILE, passwordLines);
    console.log(
      `Passwords file generated successfully at ${PASSWORD_OUTPUT_FILE}`
    );
  } catch (error) {
    console.error("Error generating SQL file:", error);
    process.exit(1); // Exit with error code
  }
}

// Main execution
async function main() {
  try {
    // Create admin user first
    await createAdminUser();

    // Then generate SQL file
    await generateSqlFile();
  } catch (error) {
    console.error("Error in main execution:", error);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);
