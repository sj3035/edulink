
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get the user data from the request
    const { userId, provider } = await req.json();

    console.log("Received request for user ID:", userId, "with provider:", provider);

    if (!userId || !provider) {
      console.error("Missing user ID or provider in request");
      return new Response(
        JSON.stringify({ error: "User ID and provider are required" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Check if auth method already exists to avoid duplicates
    const { data: existingMethods, error: checkError } = await supabase
      .from('user_auth_methods')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', provider);

    if (checkError) {
      console.error("Error checking existing auth methods:", checkError);
      return new Response(
        JSON.stringify({ error: checkError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Only insert if no existing record found
    if (!existingMethods || existingMethods.length === 0) {
      const { data, error } = await supabase
        .from('user_auth_methods')
        .insert([{ user_id: userId, provider }]);

      if (error) {
        console.error("Error recording auth method:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
      
      console.log("Successfully recorded auth method for user:", userId, "provider:", provider);
      return new Response(
        JSON.stringify({ success: true, data, message: "Auth method recorded" }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    console.log("Auth method already exists for user:", userId, "provider:", provider);
    return new Response(
      JSON.stringify({ success: true, message: "Auth method already exists" }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred", details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
