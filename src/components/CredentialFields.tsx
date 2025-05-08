
import { Input } from "./ui/input";
import { faker } from "@faker-js/faker";
import { useMemo, useEffect } from "react";
import { Label } from "./ui/label";

export interface CredentialData {
  name: string;
  iban: string;
  bank: string;
  ssn: string;
}

interface CredentialFieldsProps {
  onDataChange: (data: CredentialData) => void;
  initialData: CredentialData;
}

export const CredentialFields = ({ onDataChange, initialData }: CredentialFieldsProps) => {
  const credentialData = useMemo(() => ({
    name: initialData.name,
    iban: initialData.iban,
    bank: initialData.bank,
    ssn: initialData.ssn,
  }), [initialData]);

  // Use useEffect instead of useMemo to ensure the data is sent to parent
  useEffect(() => {
    onDataChange(credentialData);
  }, [credentialData, onDataChange]);

  return (
    <div className="space-y-4 w-full max-w-md mx-auto mb-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input 
          id="name"
          value={credentialData.name}
          disabled
          className="bg-muted"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="iban">IBAN</Label>
        <Input 
          id="iban"
          value={credentialData.iban}
          disabled
          className="bg-muted"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bank">Bank</Label>
        <Input 
          id="bank"
          value={credentialData.bank}
          disabled
          className="bg-muted"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ssn">Social Security Number</Label>
        <Input 
          id="ssn"
          value={credentialData.ssn}
          disabled
          className="bg-muted"
        />
      </div>
    </div>
  );
};
