'use client';

import { useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  Accessibility,
  BookOpen,
  Briefcase,
  Building2,
  ChevronDown,
  ChevronRight,
  Coins,
  Cookie,
  FileText,
  Globe,
  LayoutGrid,
  Mail,
  MapPin,
  Megaphone,
  MessageSquare,
  Network,
  RefreshCw,
  ShieldCheck,
  Tag,
  Trash2,
  Trophy,
} from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/services/category.service';
import GTranslate from '@/components/GTranslate';
import footerbg from '../../../public/home/footer-bg.webp';
/* -------------------------------------------------------------------------- */
/*  Config — change URLs / labels here, not in the JSX                        */
/* -------------------------------------------------------------------------- */

const GOLD = '#E4B77C';

const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL ?? '';
const GOOGLE_PLAY_URL = process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL ?? '';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
];

type IconProps = { className?: string; strokeWidth?: number | string };
type FooterIcon = ComponentType<IconProps>;

/** Small line icons that have no equivalent name across all lucide-react versions. */
function SvgBase({ className, strokeWidth = 1.8, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}
const HelpCircleIcon: FooterIcon = (p) => (
  <SvgBase {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </SvgBase>
);
const PlusCircleIcon: FooterIcon = (p) => (
  <SvgBase {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12h8" />
    <path d="M12 8v8" />
  </SvgBase>
);
const AlertTriangleIcon: FooterIcon = (p) => (
  <SvgBase {...p}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </SvgBase>
);
const AlertCircleIcon: FooterIcon = (p) => (
  <SvgBase {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </SvgBase>
);
const BarsIcon: FooterIcon = (p) => (
  <SvgBase {...p}>
    <path d="M5 21v-6" />
    <path d="M12 21V3" />
    <path d="M19 21V9" />
  </SvgBase>
);

type FooterLink = { key: string; label: string; href: string; icon: FooterIcon };
type FooterColumn = { id: string; titleKey?: string; title: string; links: FooterLink[] };

const COLUMNS: FooterColumn[] = [
  {
    id: 'company',
    title: 'Mawjood', // replaced by companyName from site settings
    links: [
      { key: 'footerV2.aboutUs', label: 'About Us', href: '/about', icon: Building2 },
      { key: 'footerV2.contactUs', label: 'Contact Us', href: '/contact', icon: Mail },
      { key: 'footerV2.careers', label: 'Careers', href: '/careers', icon: Briefcase },
      { key: 'footerV2.helpCenter', label: 'Help Center / FAQ', href: '/help', icon: HelpCircleIcon },
      { key: 'footerV2.terms', label: 'Terms & Conditions', href: '/terms', icon: FileText },
      { key: 'footerV2.privacyPolicy', label: 'Privacy Policy', href: '/privacy', icon: ShieldCheck },
      { key: 'footerV2.cookiePolicy', label: 'Cookie Policy', href: '/cookies', icon: Cookie },
      { key: 'footerV2.accessibility', label: 'Accessibility', href: '/accessibility', icon: Accessibility },
    ],
  },
  {
    id: 'business',
    titleKey: 'footerV2.forBusinesses',
    title: 'For Businesses',
    links: [
      { key: 'footerV2.addBusiness', label: 'Add Your Business', href: '/add-business', icon: PlusCircleIcon },
      { key: 'footerV2.advertise', label: 'Advertise With Us', href: '/advertise', icon: Megaphone },
      { key: 'footerV2.plansPricing', label: 'Business Plans & Pricing', href: '/pricing', icon: Coins },
      { key: 'footerV2.claimBusiness', label: 'Claim Your Business', href: '/claim-business', icon: ShieldCheck },
      { key: 'footerV2.businessDashboard', label: 'Business Dashboard', href: '/dashboard', icon: LayoutGrid },
      { key: 'footerV2.forBrands', label: 'For Brands', href: '/brands', icon: Tag },
      { key: 'footerV2.businessResources', label: 'Business Resources', href: '/business-resources', icon: BarsIcon },
      { key: 'footerV2.reportProblem', label: 'Report a Problem', href: '/report-problem', icon: AlertTriangleIcon },
    ],
  },
  {
    id: 'resources',
    titleKey: 'footerV2.resources',
    title: 'Resources',
    links: [
      { key: 'footerV2.popularCategories', label: 'Popular Categories', href: '/categories', icon: LayoutGrid },
      { key: 'footerV2.exploreCities', label: 'Explore Cities', href: '/cities', icon: MapPin },
      { key: 'footerV2.businessGuides', label: 'Business Guides', href: '/guides', icon: BookOpen },
      { key: 'footerV2.successStories', label: 'Success Stories', href: '/success-stories', icon: Trophy },
      { key: 'footerV2.sitemap', label: 'Sitemap', href: '/sitemap', icon: Network },
    ],
  },
  {
    id: 'support',
    titleKey: 'footerV2.supportTitle',
    title: 'Support',
    links: [
      { key: 'footerV2.refundPolicy', label: 'Refund & Cancellation Policy', href: '/refund-policy', icon: RefreshCw },
      { key: 'footerV2.dataDeletion', label: 'Data Deletion Request', href: '/data-deletion', icon: Trash2 },
      { key: 'footerV2.reportBusiness', label: 'Report a Business', href: '/report-business', icon: AlertCircleIcon },
      { key: 'footerV2.feedback', label: 'Feedback', href: '/feedback', icon: MessageSquare },
    ],
  },
];

const LEGAL_LINKS = [
  { key: 'footerV2.privacy', label: 'Privacy', href: '/privacy' },
  { key: 'footerV2.termsShort', label: 'Terms', href: '/terms' },
  { key: 'footerV2.cookies', label: 'Cookies', href: '/cookies' },
];

const LIVE_FOOTER_PATHS = new Set([
  '/', '/contact', '/careers', '/terms', '/privacy', '/add-business',
  '/advertise', '/dashboard', '/brands', '/blog', '/categories',
  '/businesses', '/tourist-places',
]);

const hasLiveRoute = (href: string) =>
  LIVE_FOOTER_PATHS.has(href) || href.startsWith('/category/');

/* -------------------------------------------------------------------------- */
/*  Social icons                                                              */
/* -------------------------------------------------------------------------- */

const ICON_PATHS: Record<string, string> = {
  facebook: 'M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z',
  twitter: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  x: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  instagram: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z',
  linkedin: 'M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z',
  youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  whatsapp: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488',
};

/** Glyph viewBoxes that differ from the default 24×24. */
const ICON_VIEWBOX: Record<string, string> = {
  facebook: '0 0 320 512',
  linkedin: '0 0 448 512',
};

/** Brand-coloured circle for each network, matching the design. */
const SOCIAL_STYLES: Record<string, string> = {
  facebook: 'bg-[#1877F2]',
  instagram: 'bg-[linear-gradient(45deg,#F9A03F_0%,#E1306C_50%,#8134AF_100%)]',
  x: 'bg-black ring-[1.5px] ring-inset ring-white',
  twitter: 'bg-black ring-[1.5px] ring-inset ring-white',
  linkedin: 'bg-[#0A66C2]',
  youtube: 'bg-[#FF0000]',
  whatsapp: 'bg-[#25D366]',
};

const DEFAULT_SOCIALS: { name: string; url: string; icon: string }[] = [];

/* -------------------------------------------------------------------------- */
/*  Small building blocks                                                     */
/* -------------------------------------------------------------------------- */

function ColumnHeading({ children }: { children: ReactNode }) {
  return (
    <div>
      <h3 className="text-[clamp(22px,1.76vw,27px)] font-bold leading-9 text-white">{children}</h3>
      <span className="mt-3 block h-[3px] w-12 rounded-full" style={{ backgroundColor: GOLD }} />
    </div>
  );
}

function StoreBadges({ tr }: { tr: (key: string, def: string) => string }) {
  const badge =
    'flex h-[47px] min-w-[112px] flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-[9px] border border-white/30 bg-black px-1.5 text-white transition hover:border-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E4B77C]';
  return (
    <div className="-mx-[clamp(8px,0.98vw,15px)] mt-4 flex flex-wrap gap-[9px]" dir="ltr">
      <a href={APP_STORE_URL} className={badge} aria-label="App Store">
        <svg viewBox="0 0 24 24" className="h-[22px] w-[22px] shrink-0 fill-white" aria-hidden="true">
          <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
        </svg>
        <span className="flex flex-col items-start leading-none">
          <span className="text-[7.5px] tracking-wide">{tr('footerV2.downloadOnThe', 'Download on the')}</span>
          <span className="mt-[3px] text-[15px] font-semibold">App Store</span>
        </span>
      </a>
      <a href={GOOGLE_PLAY_URL} className={badge} aria-label="Google Play">
        <svg viewBox="0 0 24 24" className="h-[22px] w-[22px] shrink-0" aria-hidden="true">
          <path fill="#00C3FF" d="M3.2 1.9 13.3 12 3.2 22.1c-.35-.3-.55-.8-.55-1.4V3.3c0-.6.2-1.1.55-1.4z" />
          <path fill="#00F076" d="M3.2 1.9c.4-.3.95-.3 1.6 0l11.8 6.7-3.3 3.4z" />
          <path fill="#FFD500" d="m16.6 8.6 3.9 2.2c.9.5.9 1.9 0 2.4l-3.9 2.2-3.3-3.4z" />
          <path fill="#FF3A44" d="M3.2 22.1 13.3 12l3.3 3.4-11.8 6.7c-.65.3-1.2.3-1.6 0z" />
        </svg>
        <span className="flex flex-col items-start leading-none">
          <span className="text-[7.5px] tracking-wide">{tr('footerV2.getItOn', 'GET IT ON')}</span>
          <span className="mt-[3px] text-[15px] font-semibold">Google Play</span>
        </span>
      </a>
    </div>
  );
}

function LanguageSwitcher() {
  const { i18n } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => i18n.language?.startsWith(l.code)) ?? LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const select = (code: string) => {
    i18n.changeLanguage(code);
    document.documentElement.lang = code;
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-[60px] w-[183px] items-center justify-center gap-3 rounded-full border-[1.5px] bg-black/10 text-[clamp(16px,1.2vw,18px)] text-white transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E4B77C]"
        style={{ borderColor: `${GOLD}d9` }}
      >
        <Globe className="h-6 w-6" strokeWidth={1.6} aria-hidden="true" />
        <span>{current.label}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="currentColor" aria-hidden="true" />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute bottom-full end-0 z-20 mb-2 w-full overflow-hidden rounded-2xl border border-white/15 bg-[#04352b] py-1 shadow-xl"
        >
          {LANGUAGES.map((l) => (
            <li key={l.code} role="option" aria-selected={l.code === current.code}>
              <button
                type="button"
                onClick={() => select(l.code)}
                className={`block w-full px-5 py-2.5 text-start text-[15px] hover:bg-white/10 ${
                  l.code === current.code ? 'font-semibold text-[#E4B77C]' : 'text-white'
                }`}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Footer                                                                    */
/* -------------------------------------------------------------------------- */

export default function Footer() {
  const { t } = useTranslation('common');
  const { data: siteSettings } = useSiteSettings();
  const { data: popularCategories = [] } = useQuery({ queryKey: ['popular-categories'], queryFn: categoryService.fetchPopularCategories });
  const footerSettings = siteSettings?.footer;

  // `t` with an inline default so the footer renders correctly before the
  // new keys are added to the locale files.
  const tr = (key: string, def: string, opts?: Record<string, unknown>) =>
    t(key, { defaultValue: def, ...opts }) as string;

  const companyName = footerSettings?.companyName ?? tr('footerV2.companyName', 'Mawjood');
  const logoSrc = '/logo/logo2_rbg.png';
  const tagline =
    footerSettings?.tagline ?? tr('footerV2.tagline', 'Connecting people to trusted local businesses across Saudi Arabia.');
  const directoryLabel = tr('footerV2.directoryLabel', "Saudi Arabia's Trusted Business Directory");
  const bottomTagline = tr('footerV2.bottomTagline', 'Supporting Local Businesses, Building Stronger Communities.');
  const columns = COLUMNS.map((column) => {
    if (column.id === 'resources') {
      const categoryLinks: FooterLink[] = popularCategories.map((category) => ({
        key: `popular-category-${category.id}`,
        label: category.name,
        href: `/category/${category.slug}`,
        icon: LayoutGrid,
      }));

      return {
        ...column,
        links: column.links.flatMap((link) =>
          link.key === 'footerV2.popularCategories' ? categoryLinks : [link],
        ),
      };
    }
    if (column.id === 'company' && footerSettings?.quickLinks?.length) {
      return { ...column, links: footerSettings.quickLinks.map((link, index) => ({ ...column.links[index % column.links.length], key: `settings-company-${index}`, label: link.label, href: link.url })) };
    }
    if (column.id === 'business' && footerSettings?.businessLinks?.length) {
      return { ...column, links: footerSettings.businessLinks.map((link, index) => ({ ...column.links[index % column.links.length], key: `settings-business-${index}`, label: link.label, href: link.url })) };
    }
    return column;
  }).map((column) => ({ ...column, links: column.links.filter((link) => hasLiveRoute(link.href)) }));

  const socials = (footerSettings?.socialLinks?.length ? footerSettings.socialLinks : DEFAULT_SOCIALS).map((s: { name: string; url: string; icon?: string }) => {
    const key = (s.icon ?? s.name).toLowerCase();
    const known = key in ICON_PATHS ? key : 'facebook';
    return { name: s.name, url: s.url, key, path: ICON_PATHS[known], viewBox: ICON_VIEWBOX[known] ?? '0 0 24 24' };
  });

  const linkClass =
    'group flex min-h-[clamp(48px,3.45vw,53px)] items-center gap-[clamp(12px,1.43vw,22px)] py-1.5 text-[clamp(15px,1.17vw,18px)] leading-6 text-white/90 transition-colors hover:text-[#E4B77C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E4B77C]';

  return (
    <footer className="relative isolate overflow-hidden bg-[#012b23] text-white">
      <div className="relative">
      {/* Background artwork (skyline, Saudi map, waves). On xl it also runs behind the bottom bar. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 h-full [mask-image:linear-gradient(to_bottom,transparent,#000_18%,#000_72%)] sm:[mask-image:linear-gradient(to_bottom,transparent,#000_28%,#000_78%)] xl:-bottom-[136px] xl:top-0 xl:h-auto xl:[mask-image:none]"
      >
        <Image
          src={footerbg}
          alt="Footer background"
          fill
          sizes="100vw"
          quality={90}
          className="object-cover object-bottom"
        />
      </div>

      <div className="mx-auto max-w-[1536px] px-6 pb-32 pt-16 xl:pe-[33px] xl:ps-[47px] ">
        <div className="flex flex-col gap-14 xl:flex-row xl:gap-[47px]">
          {/* ------------------------------ Brand ------------------------------ */}
          <div className="mx-auto flex w-full max-w-[292px] shrink-0 flex-col items-center text-center xl:-mt-1 xl:mx-0 xl:w-[clamp(250px,19vw,292px)]">
            <Image
              src={logoSrc}
              alt="Mawjood Logo"
              width={132}
              height={148}
              priority={false}
              className="h-auto w-[132px]"
            />
            <h3 className="company-name mt-0.5 font-bold leading-none tracking-tight text-white">{companyName}</h3>
            <p className="company-des mt-[7px] max-w-[260px] text-[14px] uppercase leading-[1.55] tracking-[0.2em] text-white/90 rtl:tracking-normal">
              {directoryLabel}
            </p>
            <span className="mt-4 block h-[3px] w-[46px] rounded-full" style={{ backgroundColor: GOLD }} />
            <p className="mt-5 max-w-[256px] text-[18px] leading-7 text-white/90">{tagline}</p>

            <div className="mt-10 flex w-full items-center justify-between">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  aria-label={s.name}
                  target={s.url.startsWith('http') ? '_blank' : undefined}
                  rel={s.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`flex h-[clamp(38px,2.73vw,42px)] w-[clamp(38px,2.73vw,42px)] items-center justify-center rounded-full text-white transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E4B77C] ${
                    SOCIAL_STYLES[s.key] ?? 'bg-white/10'
                  }`}
                >
                  <svg className="h-[21px] w-[21px]" fill="currentColor" viewBox={s.viewBox} aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>

            <Link
              href="/contact"
              className="mt-[34px] flex h-[55px] w-full items-center justify-between rounded-full border-[1.5px] bg-black/10 ps-12 pe-8 text-[19px] font-medium transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E4B77C]"
              style={{ borderColor: `${GOLD}e6`, color: GOLD }}
            >
              <span className="flex items-center gap-3">
                <Mail className="h-7 w-7" strokeWidth={1.7} aria-hidden="true" />
                {tr('footerV2.contactUs', 'Contact Us')}
              </span>
              <ChevronRight className="h-5 w-5 rtl:rotate-180" strokeWidth={1.8} aria-hidden="true" />
            </Link>
            <a href="https://www.vision2030.gov.sa/ar/" target="_blank" rel="noopener noreferrer" className="mt-5 flex items-center justify-center gap-3 text-white/80 transition hover:text-[#E4B77C]" aria-label="Saudi Vision 2030">
              <img src="https://tweeq.edu.sa/wp-content/uploads/2025/07/Saudi_Vision_2030_logo.svg-1024x685-1.png" alt="Saudi Vision 2030" className="h-16 w-20 object-contain brightness-0 invert" />
              <span className="text-sm">Saudi Vision 2030</span>
            </a>
          </div>

          {/* ------------------------------ Columns ---------------------------- */}
          <div className="grid flex-1 gap-x-0 gap-y-12 sm:grid-cols-2 xl:grid-cols-[minmax(0,242fr)_minmax(0,312fr)_minmax(0,267fr)_minmax(0,296fr)] xl:gap-y-0">
            {columns.map((col, i) => (
              <nav
                key={col.id}
                aria-label={col.id === 'company' ? companyName : tr(col.titleKey ?? '', col.title)}
                className={
                  i === 0
                    ? ''
                    : 'xl:border-s xl:border-[#114539] xl:ps-[clamp(16px,2.08vw,32px)]'
                }
              >
                <ColumnHeading>{col.id === 'company' ? companyName : tr(col.titleKey ?? '', col.title)}</ColumnHeading>

                <ul className="mt-7">
                  {col.links.map(({ key, label, href, icon: Icon }) => (
                    <li key={key}>
                      <Link href={href} className={linkClass}>
                        <Icon className="h-[clamp(24px,1.76vw,27px)] w-[clamp(24px,1.76vw,27px)] shrink-0 text-white/95" strokeWidth={1.8} />
                        <span>{tr(key, label)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>

                {col.id === 'support' && (
                  <>
                  <div className="mt-8 rounded-[18px] border border-[#145240] bg-[#003a2e]/70 px-[clamp(16px,1.56vw,24px)] py-5 backdrop-blur-sm xl:-ms-[9px]">
                    <p className="text-[clamp(16px,1.2vw,18.5px)] font-bold leading-tight text-white">
                      {tr('footerV2.downloadAppTitle', 'Download Mawjood App')}
                    </p>
                    <p className="mt-2 text-[clamp(12.5px,0.9vw,14px)] text-white/80">
                      {tr('footerV2.downloadAppSubtitle', 'Find trusted businesses on the go')}
                    </p>
                    <StoreBadges tr={tr} />
                  </div>
                  <div className="mt-6 flex flex-col">
                    <Image
                      src="/home/qr_code_with_border.png"
                      alt="Scan to visit Mawjood"
                      width={148}
                      height={148}
                      className="h-32 w-32 rounded-xl object-contain shadow-lg sm:h-36 sm:w-36"
                    />
                    <span className="mt-3 text-sm text-white/80">
                      {tr('footerV2.scanQr', 'Scan to visit Mawjood')}
                    </span>
                  </div>
                  </>
                )}

              </nav>
            ))}
          </div>
        </div>
      </div>

      </div>

      {/* ------------------------------ Bottom bar ----------------------------- */}
      <div className="border-t border-[#367968]/70">
        <div className="mx-auto grid max-w-[1536px] grid-cols-1 items-center gap-y-6 px-6 py-8 text-center xl:grid-cols-[510fr_405fr_326fr_215fr] xl:gap-y-0 xl:pe-[33px] xl:ps-[47px] xl:py-[38px] xl:text-start">
          <div className="flex items-center justify-center gap-4 xl:justify-start">
            <svg viewBox="0 0 24 24" className="h-[42px] w-[42px] shrink-0 fill-white" aria-hidden="true">
              <path fillRule="evenodd" d="M12 1.5C7.3 1.5 3.6 5.2 3.6 9.9c0 5.6 6.6 11.9 7.6 12.8.5.4 1.1.4 1.6 0 1-.9 7.6-7.2 7.6-12.8 0-4.7-3.7-8.4-8.4-8.4zm0 11.6a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4z" />
            </svg>
            <div className="text-start">
              <p className="text-[clamp(15px,1.1vw,17px)] font-semibold leading-tight">
                {tr('footerV2.country', 'Kingdom of Saudi Arabia')}
              </p>
              <p className="mt-1 text-[clamp(12.5px,0.92vw,14.5px)] text-white/85">{bottomTagline}</p>
            </div>
          </div>

          <p className="text-[clamp(14px,1.04vw,16px)] text-white/90 xl:flex xl:h-[58px] xl:items-center xl:justify-center xl:border-s xl:border-[#114539] xl:px-4">
            {tr('footerV2.copyrightText', '© {{year}} {{name}}. All rights reserved.', {
              year: new Date().getFullYear(),
              name: companyName,
            })}
          </p>

          <ul className="flex items-center justify-center gap-[clamp(20px,2.2vw,34px)] text-[clamp(14px,1.04vw,16px)] text-white/90 xl:h-[58px] xl:border-s xl:border-[#114539] xl:px-4">
            {LEGAL_LINKS.filter((link) => hasLiveRoute(link.href)).map((l) => (
              <li key={l.key}>
                <Link href={l.href} className="transition-colors hover:text-[#E4B77C]">
                  {tr(l.key, l.label)}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex justify-center xl:h-[58px] xl:items-center xl:justify-end xl:border-s xl:border-[#114539] xl:ps-8">
            <div className="footer-language-control">
              <Globe className="footer-language-icon" aria-hidden="true" />
              <GTranslate className="footer-language" id="gtranslate-footer" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
