
import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

export interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="w-full mb-12">
      <div className="flex justify-between items-center">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center">
            <button
              onClick={() => onStepClick && step.id <= currentStep && onStepClick(step.id)}
              disabled={step.id > currentStep}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${step.id === currentStep ? 'bg-primary text-primary-foreground active animate-pulse-slow' : ''}
                ${step.id < currentStep ? 'bg-primary text-primary-foreground completed' : ''}
                ${step.id > currentStep ? 'bg-muted text-muted-foreground' : ''}
                ${step.id <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed'}
                relative z-10
              `}
              aria-current={step.id === currentStep ? "step" : undefined}
            >
              {step.id < currentStep ? (
                <Check className="h-5 w-5" />
              ) : step.id > currentStep ? (
                <span>{step.id}</span>
              ) : (
                <ArrowRight className="h-5 w-5 animate-pulse" />
              )}
            </button>
            
            <div className="mt-3 text-center">
              <div className={`font-medium ${step.id === currentStep ? 'text-primary' : ''}`}>
                {step.title}
              </div>
              <div className="text-xs text-muted-foreground mt-1 max-w-[120px]">
                {step.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
