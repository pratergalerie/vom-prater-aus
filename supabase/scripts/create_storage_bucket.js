// Script to create a Supabase Storage bucket for website content
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Using service role key for admin access

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Define the bucket names
const CONTENT_BUCKET_NAME = "content-storage";
const STORIES_BUCKET_NAME = "stories-storage";

async function createBucketIfNotExists(bucketName) {
  try {
    // List existing buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error("Error listing buckets:", error);
      return false;
    }

    // Check if the bucket already exists
    const bucketExists = buckets.some((bucket) => bucket.name === bucketName);

    if (!bucketExists) {
      // Create the bucket
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: true, // Make the bucket public
        fileSizeLimit: 52428800, // 50MB
      });

      if (error) {
        console.error(`Error creating bucket ${bucketName}:`, error);
        return false;
      }

      console.log(`Bucket ${bucketName} created successfully`);
    } else {
      console.log(`Bucket ${bucketName} already exists`);
    }

    return true;
  } catch (error) {
    console.error("Unexpected error:", error);
    return false;
  }
}

// Run the function for both buckets
async function setupBuckets() {
  const contentBucketSuccess = await createBucketIfNotExists(
    CONTENT_BUCKET_NAME
  );
  const storiesBucketSuccess = await createBucketIfNotExists(
    STORIES_BUCKET_NAME
  );

  return contentBucketSuccess && storiesBucketSuccess;
}

setupBuckets()
  .then((success) => {
    if (success) {
      console.log("Storage buckets setup completed successfully");
      process.exit(0);
    } else {
      console.error("Storage buckets setup failed");
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("Unexpected error:", error);
    process.exit(1);
  });
