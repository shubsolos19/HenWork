require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setup() {
  const query = `
    -- Enable storage policies if not already enabled
    CREATE POLICY "Avatar images are publicly accessible." 
      ON storage.objects FOR SELECT 
      USING ( bucket_id = 'avatars' );

    CREATE POLICY "Anyone can upload an avatar." 
      ON storage.objects FOR INSERT 
      WITH CHECK ( bucket_id = 'avatars' );

    CREATE POLICY "Anyone can update an avatar." 
      ON storage.objects FOR UPDATE 
      WITH CHECK ( bucket_id = 'avatars' );
  `;

  const { error } = await supabase.rpc('exec_sql', { query });
  if (error) {
    console.log('Failed to create storage policies via RPC, you might need to create them manually:', error.message);
  } else {
    console.log('Storage policies created!');
  }
}

setup();
