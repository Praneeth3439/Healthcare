/**
 * Formats timestamps into friendly readable dates and times.
 */
export function formatDateTime(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export function formatDate(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Categorizes a vital sign reading into 'normal', 'elevated', or 'alert'.
 */
export function categorizeVital(
  type: 'heartRate' | 'systolicBp' | 'diastolicBp' | 'bloodGlucose' | 'temperature' | 'oxygenSaturation',
  value: number
): 'normal' | 'elevated' | 'alert' {
  switch (type) {
    case 'heartRate':
      if (value >= 60 && value <= 100) return 'normal';
      if ((value >= 50 && value < 60) || (value > 100 && value <= 115)) return 'elevated';
      return 'alert';

    case 'systolicBp':
      if (value < 120) return 'normal';
      if (value >= 120 && value <= 139) return 'elevated';
      return 'alert';

    case 'diastolicBp':
      if (value < 80) return 'normal';
      if (value >= 80 && value <= 89) return 'elevated';
      return 'alert';

    case 'bloodGlucose':
      if (value >= 70 && value <= 99) return 'normal';
      if (value >= 100 && value <= 125) return 'elevated';
      return 'alert';

    case 'temperature':
      if (value >= 97.0 && value <= 99.0) return 'normal';
      if (value > 99.0 && value <= 100.4) return 'elevated';
      return 'alert';

    case 'oxygenSaturation':
      if (value >= 95) return 'normal';
      if (value >= 91 && value <= 94) return 'elevated';
      return 'alert';

    default:
      return 'normal';
  }
}
