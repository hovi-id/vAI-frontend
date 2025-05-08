export const waitForConnectionResponse = async (
  url: string,
  signal?: AbortSignal
): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const interval = setInterval(async () => {
      try {
        // Stop if the signal is aborted
        if (signal?.aborted) {
          clearInterval(interval);
          reject(new Error('Operation cancelled'));
          return;
        }

        // Stop if 1 minute has passed
        if (Date.now() - startTime >= 60000) {
          clearInterval(interval);
          reject(new Error('Operation timed out after 1 minute'));
          return;
        }

        console.log('Polling connection status...');
        const res = await fetch(url);
        const data = await res.json();

        if (data.success && Array.isArray(data.response) && data.response.length > 0) {
          clearInterval(interval);
          const connectionId = data.response[0].connectionId;
          localStorage.setItem('connectionId', connectionId);
          resolve(data.response);
        } else {
          console.log('Waiting for response... No connection yet.');
        }
      } catch (err) {
        clearInterval(interval);
        reject(err);
      }
    }, 5000);

    // Handle manual cancellation
    signal?.addEventListener('abort', () => {
      clearInterval(interval);
      reject(new Error('Operation cancelled'));
    });
  });
};

export const createConnection = async () => {
  try {
    const response = await fetch(import.meta.env.VITE_BACKEND_API+'/api/create-connection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to create connection');
    }

    const data = await response.json();
    if (!data.success || !data.response.invitationUrl) {
      throw new Error('Invalid connection response');
    }
    
    // Remove base URL from invitation URL
    const url = new URL(data.response.invitationUrl);
    const invitationId = data.response.invitationId;
    const conn_url = `${url.pathname}${url.search}`;
    return [conn_url, invitationId];
  } catch (error) {
    console.error('Error creating connection:', error);
    throw error;
  }
};
