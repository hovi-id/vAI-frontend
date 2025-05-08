import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import CountryCodeSelect from './CountryCodeSelect';
import { parsePhoneNumber, isValidPhoneNumber, CountryCode } from 'libphonenumber-js';

interface PhoneInputProps {
  onSubmit: (phoneNumber: string) => void;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ onSubmit }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+358');
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePhone = (phone: string, country: string) => {
    try {
      const countryCodeWithoutPlus = country.replace('+', '') as CountryCode;
      const cleaned = phone.replace(/\D/g, '');
      
      if (cleaned.length < 9) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error('Phone validation error:', error);
      return false;
    }
  };

  const formatPhoneNumber = (value: string, country: string) => {
    if (!value) return value;
    
    const cleaned = value.replace(/\D/g, '');
    
    try {
      const countryCodeWithoutPlus = country.replace('+', '') as CountryCode;
      try {
        const phoneNumber = parsePhoneNumber(cleaned, countryCodeWithoutPlus);
        if (phoneNumber) {
          return phoneNumber.formatNational();
        }
      } catch (error) {
        return cleaned;
      }
    } catch (error) {
      console.error('Formatting error:', error);
    }
    
    return cleaned;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatPhoneNumber(value, countryCode);
    setPhoneNumber(formatted);
    
    const isPhoneValid = validatePhone(value, countryCode);
    console.log('Is phone valid:', isPhoneValid);    
    setIsValid(isPhoneValid);
  };

  const handleCountryChange = (code: string) => {
    setCountryCode(code);
    const isPhoneValid = validatePhone(phoneNumber, code);
    console.log('Country changed, is phone valid:', isPhoneValid);
    setIsValid(isPhoneValid);
  };

  useEffect(() => {
    if (phoneNumber) {
      const isPhoneValid = validatePhone(phoneNumber, countryCode);
      setIsValid(isPhoneValid);
    }
  }, []);

  const makePhoneCall = async (formattedNumber: string) => {
    try {
      console.log("Making phone call to connection_id: "+localStorage.getItem('connectionId'));
      localStorage.setItem('phoneNumber', formattedNumber);
      const response = await fetch(import.meta.env.VITE_BACKEND_API+'/api/make-phone-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: formattedNumber,
          connection_id: localStorage.getItem('connectionId')  
        })
      });

      // console.log(response);

      if (!response.ok) {
        throw new Error('Failed to initiate phone call');
      }

      // const data = await response.json();
      console.log('Phone call initiated:');
      return true;
    } catch (error) {
      console.error('Error making phone call:', error);
      toast.error('Failed to initiate phone call. Please try again.');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const formattedNumber = `${countryCode}${phoneNumber.replace(/\D/g, '')}`;
      console.log('Submitting phone number:', formattedNumber);
      
      const success = await makePhoneCall(formattedNumber);
      if (success) {
        toast.success('Phone call initiated successfully');
        onSubmit(formattedNumber);
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to process your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full animate-scale-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-medium mb-2">Enter Your Phone Number</h2>
        <p className="text-muted-foreground">
          Our verified AI agent will call this number to help you complete the verification process.
        </p>
      </div>
      
      <div className="mx-auto max-w-md glass rounded-xl p-8">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="relative flex gap-3 items-center">
            <div className="w-[140px]">
              <CountryCodeSelect 
                value={countryCode}
                onChange={handleCountryChange}
                showCountryName={false}
              />
            </div>
            <div className="relative flex-1">
              <input
                type="tel"
                className="w-full px-4 py-2 rounded-md border border-input bg-background"
                placeholder="Phone number"
                value={phoneNumber}
                onChange={handleChange}
                disabled={isSubmitting}
                autoComplete="tel"
              />
            </div>
          </div>
          
          <div className="mt-4 text-sm">
            {isValid ? (
              <p className="text-green-500">Phone number is valid</p>
            ) : phoneNumber ? (
              <p className="text-red-500">Please enter a valid phone number (at least 9 digits)</p>
            ) : null}
          </div>
          
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`
              mt-8 py-3 px-6 rounded-xl flex items-center justify-center transition-all duration-300
              ${isValid && !isSubmitting ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-muted-foreground cursor-not-allowed'}
              ${isSubmitting ? 'animate-pulse' : ''}
            `}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2">Processing</span>
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
              </>
            ) : (
              <>
                <span className="mr-2">Submit</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
      
      <div className="text-center mt-6 text-sm text-muted-foreground">
        Your phone number will only be used for this demo verification.
      </div>
    </div>
  );
};

export default PhoneInput;
