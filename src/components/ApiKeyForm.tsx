
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useConnectionData } from '../services/apiService';

interface ApiKeyFormProps {
  onConnectionEstablished: (connectionUrl: string) => void;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onConnectionEstablished }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const { isLoading, error, fetchConnectionData } = useConnectionData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      return;
    }
    
    const connectionUrl = await fetchConnectionData(apiKey);
    if (connectionUrl) {
      onConnectionEstablished(connectionUrl);
    }
  };

  return (
    <div className="w-full animate-scale-in max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-medium mb-2">Enter API Key</h2>
        <p className="text-muted-foreground">
          Enter your API key to securely establish a connection
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="apiKey" className="text-sm font-medium">
            API Key
          </label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Enter your API key"
            required
          />
        </div>
        
        {error && (
          <div className="text-sm text-destructive">{error}</div>
        )}
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading || !apiKey.trim()}
        >
          {isLoading ? 'Connecting...' : 'Establish Connection'}
        </Button>
      </form>
      
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>Note: This is a temporary solution. For production use, consider integrating with Supabase for secure API key management.</p>
      </div>
    </div>
  );
};

export default ApiKeyForm;
