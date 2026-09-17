import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers | Mawjood',
  description: 'Join the Mawjood team and help people discover the best of Saudi Arabia.',
  alternates: { canonical: '/careers' },
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
