
// API service for making authenticated calls
import { useState, useEffect } from 'react';

// Store API key in localStorage (temporary solution)
export const storeApiKey = (apiKey: string): void => {
  localStorage.setItem('connection_api_key', apiKey);
};

export const getStoredApiKey = (): string | null => {
  return localStorage.getItem('connection_api_key');
};

export const clearApiKey = (): void => {
  localStorage.removeItem('connection_api_key');
};

// Hook for making authenticated connection API calls
export const useConnectionData = () => {
  const [connectionData, setConnectionData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConnectionData = async (apiKey: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
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
      
      const data = await response.json();
      setConnectionData(data.connectionUrl); // Adjust based on actual API response
      storeApiKey(apiKey); // Save the working API key
      return data.connectionUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch connection data';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { connectionData, isLoading, error, fetchConnectionData };
};
