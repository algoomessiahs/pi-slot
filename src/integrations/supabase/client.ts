
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xgnsplrftoojbckbpuxa.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnbnNwbHJmdG9vamJja2JwdXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4OTQzODYsImV4cCI6MjA1NzQ3MDM4Nn0.A8Xg0Fftlrp61BeJQTfvwNabOBlWh3a17E8_mJThPzY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
