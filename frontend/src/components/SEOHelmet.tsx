import { useEffect } from 'react';

interface Props {
  title: string;
  description?: string;
}

export const SEOHelmet: React.FC<Props> = ({ title, description }) => {
  useEffect(() => {
    document.title = `${title} | HEALTHCARE`;
    if (description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute('content', description);
      }
    }
  }, [title, description]);

  return null;
};
