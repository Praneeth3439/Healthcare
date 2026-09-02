import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

interface Props {
  variant?: 'banner' | 'card' | 'inline';
  customText?: string;
  className?: string;
}

export const MedicalDisclaimer: React.FC<Props> = ({
  variant = 'card',
  customText,
  className = '',
}) => {
  const defaultText =
    'This screening provides an informational risk assessment and does not constitute a medical diagnosis. Consult a qualified healthcare professional for diagnosis and treatment.';

  if (variant === 'banner') {
    return (
      <div className={`bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs md:text-sm text-amber-900 flex items-center justify-center gap-2 font-medium ${className}`}>
        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span>{customText || defaultText}</span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <p className={`text-xs text-slate-500 italic flex items-center gap-1.5 ${className}`}>
        <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
        <span>{customText || defaultText}</span>
      </p>
    );
  }

  return (
    <div
      className={`rounded-xl bg-gradient-to-r from-amber-50/90 to-orange-50/90 border border-amber-200/80 p-4 shadow-sm text-slate-700 flex items-start gap-3.5 ${className}`}
    >
      <div className="p-2 rounded-lg bg-amber-100/80 text-amber-800 flex-shrink-0 mt-0.5">
        <ShieldAlert className="w-5 h-5" />
      </div>
      <div className="space-y-1 text-xs md:text-sm">
        <h4 className="font-semibold text-amber-900">Important Medical Notice</h4>
        <p className="text-slate-700 leading-relaxed">{customText || defaultText}</p>
        <p className="text-slate-500 text-[11px] pt-1">
          Remote monitoring and screening features are educational prototypes. In case of a medical emergency, immediately call your local emergency services (112 / 108 in India).
        </p>
      </div>
    </div>
  );
};
