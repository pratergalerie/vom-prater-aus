const fs = require("fs");
const path = require("path");

// Path to the initial-data directory - handle both local and container environments
const DATA_DIR =
  process.env.NODE_ENV === "container"
    ? "/app/initial-data" // Path in container
    : path.join(__dirname, "..", "initial-data"); // Path when running locally

const OUTPUT_FILE =
  process.env.NODE_ENV === "container"
    ? "/app/scripts/initial_data.sql" // Path in container
    : path.join(__dirname, "initial_data.sql"); // Path when running locally

// Function to read JSON file
function readJsonFile(filename) {
  const filePath = path.join(DATA_DIR, filename);
  console.log(`Reading file: ${filePath}`);
  const fileContent = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContent);
}

// Function to escape SQL strings
function escapeSqlString(str) {
  if (str === null) return "NULL";
  return `'${str.replace(/'/g, "''")}'`;
}

// Function to format array for SQL
function formatArrayForSql(arr) {
  if (!arr) return "NULL";
  return `ARRAY[${arr.map((item) => escapeSqlString(item)).join(", ")}]`;
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

    // Generate SQL
    console.log("Generating SQL...");
    let sql = "";
    sql += generateLocalesSql(locales);
    sql += generatePagesSql(pages);
    sql += generateSectionsSql(sections);
    sql += generateSectionContentSql(sectionContent);

    // Write to file
    console.log(`Writing SQL to ${OUTPUT_FILE}...`);
    fs.writeFileSync(OUTPUT_FILE, sql);
    console.log(`SQL file generated successfully at ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("Error generating SQL file:", error);
    process.exit(1); // Exit with error code
  }
}

// Run the script
generateSqlFile();
