
import React, { useState, useEffect } from 'react';
import { ShieldCheck, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Credential {
  id: string;
  name: string;
  status: 'pending' | 'verified' | 'rejected';
  type: string;
}

const VerificationStatus: React.FC = () => {
  const [isCallActive, setIsCallActive] = useState(true);
  const [isvAiTrue, setIsvAiTrue] = useState(false);
  const [credentials, setCredentials] = useState<Credential[]>([{
    id: '1',
    name: 'AI Call Agent Verification',
    status: 'pending',
    type: 'Verifiable Credential'
  }, {
    id: '2',
    name: 'Account Holder Verification',
    status: 'pending',
    type: 'Verifiable Credential'
  }]);
  const [credentialInfo, setCredentialInfo] = useState<Record<string, string> | null>(null);
  const [pollingActive, setPollingActive] = useState(true);

  useEffect(() => {
    const phoneNumber = localStorage.getItem('phoneNumber');
    if (!phoneNumber) {
      console.error('No phone number found in localStorage');
      return;
    }

    console.log('Starting polling with phone number:', phoneNumber);
    
    let isPolling = true;
    let isvAiValidated = false;
    let pollAttempts = 0;
    const maxPollAttempts = 150; // 5 minutes / 2 seconds per attempt
    
    const pollCredentialInfo = async () => {
      try {
        if (!isPolling || pollAttempts >= maxPollAttempts) {
          setPollingActive(false);
          return;
        }
        
        pollAttempts++;
        console.log(`Polling for credential info... (attempt ${pollAttempts})`);        

        if(!isvAiValidated) {
        
          // Using the correct type here - vai_response.status is a boolean
          let vai_response = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/get-vai-status/${phoneNumber}`);
          let vai_resp = await vai_response.json()
          // console.log(vai_resp);
          // Check if the status is true (boolean) instead of comparing with string 'verified'
          if(vai_resp["status"] === "verified"){
            setIsvAiTrue(true);
            isvAiValidated = true;  
            setCredentials(prev => prev.map(c => 
              c.id === '1' ? { ...c, status: 'verified' } : c
            ));            
          }
        }
        
        const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/get-credential-info/${phoneNumber}`);

        if (!response.ok) {
          console.error('API returned error status:', response.status);
          throw new Error('Failed to fetch credential info');
        }
        
        const data = await response.json();
        console.log('Received credential data:', data);
        
        if (data && Object.keys(data).length > 0) {
          // Update the Account Holder Verification status
          setCredentials(prev => prev.map(c => 
            c.id === '2' ? { ...c, status: 'verified' } : c
          ));
          
          // Save the credential info for display
          setCredentialInfo(data);
          setIsCallActive(false);
          isPolling = false;
          setPollingActive(false);
        } else if (isPolling) {
          // Continue polling after a short delay
          setTimeout(pollCredentialInfo, 2000);
        }
      } catch (error) {
        console.error('Polling error:', error);
        if (isPolling) {
          // Continue polling after a short delay
          setTimeout(pollCredentialInfo, 2000);
        }
      }
    };

    // Start polling
    pollCredentialInfo();

    // End call and polling after timeout
    const endCallTimer = setTimeout(() => {
      setIsCallActive(false);
      isPolling = false;
      setPollingActive(false);
    }, 300000); // 300 seconds (5 minutes) timeout

    return () => {
      isPolling = false;
      setPollingActive(false);
      clearTimeout(endCallTimer);
    };
  }, []);

  const getStatusIcon = (status: string) => {
    if (status === 'pending') return <Clock className="w-5 h-5 text-muted-foreground animate-pulse" />;
    if (status === 'verified') return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <AlertCircle className="w-5 h-5 text-destructive" />;
  };

  const getStatusText = (status: string) => {
    if (status === 'pending') return 'Pending...'; // Updated text here
    if (status === 'verified') return 'Verified';
    return 'Failed';
  };

  return (
    <div className="w-full animate-scale-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-medium mb-2">Verified AI Call in Progress</h2>
        <p className="text-muted-foreground">
          The AI agent is {isCallActive ? 'processing' : 'has processed'} verification for the following credentials.
        </p>
      </div>
      
      <div className="mx-auto max-w-md">
        <div className="glass rounded-xl p-6 relative overflow-hidden">
          {isCallActive && <div className="absolute top-4 right-4 flex items-center">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              <span className="text-xs text-muted-foreground">Call Active</span>
            </div>}
          
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="font-medium">Secure AI Agent</div>
              <div className="text-sm text-muted-foreground">Verified by Credential System</div>
            </div>
          </div>
          
          <div className="space-y-4">
            {credentials.map(cred => (
              <div key={cred.id} className="bg-background rounded-lg p-4 transition-all duration-300 hover:shadow-subtle">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{cred.name}</div>
                    <div className="text-xs text-muted-foreground">{cred.type}</div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className={`
                      text-sm mr-2
                      ${cred.status === 'verified' ? 'text-green-500' : ''}
                      ${cred.status === 'rejected' ? 'text-destructive' : ''}
                    `}>
                      {getStatusText(cred.status)}
                    </span>
                    {getStatusIcon(cred.status)}
                  </div>
                </div>
                
                {cred.status !== 'pending' && (
                  <div className={`
                    mt-2 text-xs p-2 rounded
                    ${cred.status === 'verified' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
                  `}>
                    {cred.status === 'verified' ? 'Credential successfully verified by the agent.' : 'Verification failed. Please retry.'}
                  </div>
                )}

                {/* Display credential info when Account Holder Verification is verified */}
                {cred.id === '2' && credentialInfo && (
                  <div className="mt-4 border-t pt-3 border-border">
                    <div className="text-xs font-medium mb-2 text-muted-foreground">Verified Information:</div>
                    <div className="space-y-2">
                      {Object.entries(credentialInfo).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="font-medium">{key}:</span> {value}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-border flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary mr-2" />
            <span className="text-sm">
              {pollingActive ? 'Verification in progress...' : 
                credentialInfo ? 'Verification process completed' : 'Verification process timed out'}
            </span>
          </div>
        </div>
        
        {!isCallActive && <div className="text-center mt-6">
            <button className="bg-primary text-primary-foreground py-2 px-6 rounded-lg hover:bg-primary/90 transition-colors" onClick={() => window.location.reload()}>
              Restart Demo
            </button>
          </div>}
      </div>
    </div>
  );
};

export default VerificationStatus;
