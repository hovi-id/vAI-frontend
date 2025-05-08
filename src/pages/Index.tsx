import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import Layout from '../components/Layout';
import Stepper, { Step } from '../components/Stepper';
import QRDisplay from '../components/QRDisplay';
import PhoneInput from '../components/PhoneInput';
import VerificationStatus from '../components/VerificationStatus';
import { createConnection, waitForConnectionResponse } from '../utils/connectionUtils';
import { issueCredential } from '../utils/credentialUtils';
import { CredentialFields } from "../components/CredentialFields";
import { faker } from "@faker-js/faker";
import { Button } from "../components/ui/button";

const steps: Step[] = [{
  id: 1,
  title: "Download App",
  description: "Scan QR to download App"
}, {
  id: 2,
  title: "Connect",
  description: "Create connection with organization"
}, {
  id: 3,
  title: "Phone Number",
  description: "Enter number for agent to call"
}, {
  id: 4,
  title: "Verification",
  description: "Verfied AI agent interacts with you"
}];
const Index: React.FC = () => {
  // Clear localStorage when component mounts
  useEffect(() => {
    localStorage.clear();
  }, []);
  const [currentStep, setCurrentStep] = useState(1);
  const [connectionUrl, setConnectionUrl] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [credentialFormData, setCredentialFormData] = useState({
    name: faker.person.fullName(),
    iban: faker.finance.iban(),
    bank: "Acme Financial Group",
    ssn: faker.string.numeric('###-##-####')
  });
  const handleStepClick = (step: number) => {
    if (step <= currentStep) {
      if (currentStep === 2 && step === 1) {
        abortControllerRef.current?.abort();
        setIsPolling(false);
      }
      setCurrentStep(step);
    }
  };
  const skipStep = () => {
    if (currentStep === 2) {
      // Stop polling if we're skipping from step 2
      abortControllerRef.current?.abort();
      setIsPolling(false);
    }
    setCurrentStep(prev => prev + 1);
  };
  const handleNextStep = () => {
    if (currentStep < steps.length) {
      if (currentStep === 2) {
        abortControllerRef.current?.abort();
        setIsPolling(false);
      }
      setCurrentStep(prev => prev + 1);
    }
  };
  useEffect(() => {
    const fetchConnectionData = async () => {
      if (currentStep === 2 && !isPolling) {
        // HACK 1
        //handleNextStep();
        try {
          setIsPolling(true);
          abortControllerRef.current = new AbortController();
          const data = await createConnection();
          const url = data[0];
          const invitationId = data[1];
          const credentialData = {
            "Name": credentialFormData.name,
            "IBAN": credentialFormData.iban,
            "Bank": credentialFormData.bank,
            "SSN": credentialFormData.ssn
          };
          setConnectionUrl(url);
          console.log('Starting connection polling...');
          waitForConnectionResponse(import.meta.env.VITE_BACKEND_API+'/api/connection/' + invitationId, abortControllerRef.current.signal).then(response => {
            localStorage.setItem('connectionId', response[0]['connectionId']);
            issueCredential(response[0]['connectionId'], credentialData);
            setIsPolling(false);
            handleNextStep();
          }).catch(err => {
            setIsPolling(false);
            if (err.message !== 'Operation cancelled') {
              console.error('❌ Error:', err);
              toast.error('Failed to establish connection. Please try again.');
            }
          });
        } catch (error) {
          setIsPolling(false);
          toast.error('Failed to create connection. Please try again.');
          console.error('Connection error:', error);
        }
      }
    };
    fetchConnectionData();
    return () => {
      if (currentStep === 2) {
        abortControllerRef.current?.abort();
        setIsPolling(false);
      }
    };
  }, [currentStep]);
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <QRDisplay title="Download vAI Dialer App" description="Scan this QR code to download our android vAI Dialer demo app" qrData="https://drive.google.com/file/d/1En2b92RkM52_Mr4PtjZTj8LsTED0CE1z/view" altText="" step={1} />;
      case 2:
        return connectionUrl ? <div className="flex justify-center items-center w-full">
            <div className="flex gap-8 max-w-4xl w-full">
              <div className="flex-1 flex justify-center items-center px-0 mx-0 my-0 py-[185px]">
                <div className="w-full max-w-md">
                  <CredentialFields onDataChange={data => setCredentialFormData(data)} initialData={credentialFormData} />
                </div>
              </div>
              <div className="flex-1">
                <QRDisplay title="Create Connection" description="Scan to establish a secure connection with our organization" qrData={connectionUrl} altText="Scan to connect with organization" step={2} />
                <div className="flex justify-center mt-6">
                  <Button 
                    onClick={skipStep} 
                    variant="default"
                    className="bg-primary text-primary-foreground py-3 px-8 rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    Already Connected
                  </Button>
                </div>
              </div>
            </div>
          </div> : <div className="flex justify-center">
            <div className="loading">Creating organization connection invitation...</div>
          </div>;
      case 3:
        return <PhoneInput onSubmit={handleNextStep} />;
      case 4:
        return <VerificationStatus />;
      default:
        return null;
    }
  };
  return <Layout>
      <div className="w-full">
      {/* <button onClick={skipStep} className="bg-primary text-primary-foreground py-3 px-8 rounded-xl hover:bg-primary/90 transition-colors">
       SKIP STEP
       </button> */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Verifiable AI Sales Call Agent</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Experience verifiable AI with our secure AI agent using verifiable credentials</p>
        </div>
        
        <Stepper steps={steps} currentStep={currentStep} onStepClick={handleStepClick} />
        
        <div className="mt-10">
          {currentStep === 1 && <div className="flex justify-center mt-8">
              <button onClick={handleNextStep} className="bg-primary text-primary-foreground py-3 px-8 rounded-xl hover:bg-primary/90 transition-colors">
                I've Downloaded the App
              </button>
            </div>}
          
          {renderStepContent()}
        </div>
      </div>
    </Layout>;
};
export default Index;