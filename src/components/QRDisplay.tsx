
import React, { useState, useEffect } from 'react';
import { QrCode, Copy, CopyCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

interface QRDisplayProps {
  title: string;
  description: string;
  qrData: string;
  altText: string;
  step?: number;
}

const QRDisplay: React.FC<QRDisplayProps> = ({
  title,
  description,
  qrData,
  altText,
  step = 1
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);
    return () => clearTimeout(timer);
  }, [qrData]);

  const handleCopy = async () => {
    try {
      const fullUrl = `https://studio-dev.hovi.id${qrData}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const qrContent = (
    <>
      {!isLoaded ? (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <Skeleton className="w-full h-full" />
          <QrCode className="w-14 h-14 text-muted-foreground/40 absolute" />
        </div>
      ) : (
        <div className="w-full h-full animate-fade-in">
          <QRCodeSVG 
            value={qrData} 
            size={280} 
            level="L"
            includeMargin={true}
            className="w-full h-full" 
          />
        </div>
      )}
    </>
  );

  return <div className="w-full animate-scale-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-medium mb-2 my-[32px]">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <div className="mx-auto max-w-sm">
        {step === 1 ? (
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 flex items-center justify-center overflow-hidden mb-0">
              {qrContent}
            </div>
            {altText && <div className="text-sm text-muted-foreground">{altText}</div>}
          </div>
        ) : (
          <div className="qr-container glass flex flex-col items-center justify-center p-8 transition-all duration-500 hover:shadow-lg">
            <div className="bg-white p-6 rounded-lg w-72 h-72 flex items-center justify-center overflow-hidden">
              {qrContent}
            </div>
            <div className="text-sm text-muted-foreground mt-2 mb-4">{altText}</div>
            {step === 2 && (
              <Button
                variant="outline"
                onClick={handleCopy}
                className="w-full max-w-[280px]"
              >
                {copied ? (
                  <>
                    <CopyCheck className="mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2" />
                    Copy Connection Link
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>;
};

export default QRDisplay;
