export const issueCredential = async (
    connectionId: string,
    credentialValues: { [key: string]: any }
  ) => {
    const url = import.meta.env.VITE_BACKEND_API+'/api/issue-credential';
  
    const body = {
      credentialValues,
      connectionId
    };
  
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  
    const data = await res.json();
    console.log(data);
    return data;
  };