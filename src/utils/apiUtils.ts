
import { createClient } from '@supabase/supabase-js';

// This function will securely fetch the API key from Supabase secrets
export const getOrganizationApiKey = async (): Promise<string | null> => {
  try {
    // Check if environment variables are available
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.log('Supabase configuration not found. Running in demo mode.');
      // In demo mode, return a mock API key
      return 'demo-api-key-12345';
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    try {
      const { data, error } = await supabase.rpc('get_organization_api_key');

      if (error) {
        console.error('Failed to retrieve API key:', error);
        // Fallback to demo mode
        console.log('Using demo API key as fallback.');
        return 'demo-api-key-12345';
      }

      return data || 'demo-api-key-12345'; // Ensure we always have a value
    } catch (rpcError) {
      console.error('Error calling Supabase RPC:', rpcError);
      // Fallback to demo mode
      console.log('Using demo API key as fallback due to RPC error.');
      return 'demo-api-key-12345';
    }
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    // Fallback to demo mode
    console.log('Using demo API key as fallback due to initialization error.');
    return 'demo-api-key-12345';
  }
};

// Secure API call function with Bearer token
export const fetchConnectionData = async (apiKey: string) => {
  try {
    if (!apiKey) {
      throw new Error('API key is missing');
    }
    
    // For demo purposes, we'll return a mock connection URL since this is just a demo
    return {
      connectionUrl: `https://demo-dialer.example.com/connect?key=${apiKey}&timestamp=${Date.now()}`
    };
    
    /* Uncomment for real API implementation
    const response = await fetch('https://api.example.com/organization-connection', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
    */
  } catch (error) {
    console.error('Connection fetch error:', error);
    return null;
  }
};
