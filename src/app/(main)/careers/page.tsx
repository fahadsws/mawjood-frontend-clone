'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { BriefcaseBusiness, CheckCircle2, Send, X } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { careerService, CareerOpening } from '@/services/career.service';

const initialForm = { name: '', email: '', phone: '', coverLetter: '' };

export default function CareersPage() {
  const { t } = useTranslation('common');
  const { data: openings = [], isLoading, error } = useQuery({ queryKey: ['career-openings'], queryFn: careerService.getOpenings });
  const [selected, setSelected] = useState<CareerOpening | null>(null);
  const [form, setForm] = useState(initialForm);
  const [resume, setResume] = useState<File | null>(null);
  const mutation = useMutation({
    mutationFn: () => {
      if (!resume) throw new Error('Please upload your resume.');
      return careerService.submitApplication({ careerOpeningId: selected!.id, ...form, resume });
    },
    onSuccess: () => { toast.success('Application submitted successfully.'); setSelected(null); setForm(initialForm); setResume(null); },
    onError: (err: Error) => toast.error(err.message || 'Unable to submit your application.'),
  });

  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));

  return <div className="min-h-screen bg-gray-50">
    <section className="relative overflow-hidden bg-primary px-4 py-24 text-white sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.18),transparent_40%)]" />
      <div className="relative mx-auto max-w-5xl text-center">
        <BriefcaseBusiness className="mx-auto mb-5 h-12 w-12" />
        <h1 className="text-4xl font-bold sm:text-6xl">{t('careers.heroTitle')}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/85">{t('careers.heroDescription')}</p>
      </div>
    </section>

    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center"><h2 className="text-3xl font-bold text-gray-900">{t('careers.openPositions')}</h2><p className="mt-2 text-gray-600">{t('careers.subtitle')}</p></div>
      {isLoading && <div className="py-16 text-center text-gray-500">{t('careers.loading')}</div>}
      {error && <div className="rounded-xl bg-red-50 p-6 text-center text-red-700">We couldn&apos;t load openings right now. Please try again later.</div>}
      {!isLoading && !error && openings.length === 0 && <div className="rounded-2xl bg-white p-12 text-center shadow-sm"><h3 className="text-xl font-semibold text-gray-900">{t('careers.emptyTitle')}</h3><p className="mt-2 text-gray-600">{t('careers.emptyDescription')}</p></div>}
      <div className="grid gap-6 md:grid-cols-2">
        {openings.map((opening) => <article key={opening.id} className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-lg"><div className="flex items-start justify-between gap-4"><h3 className="text-xl font-bold text-gray-900">{opening.title}</h3><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{opening.employmentType === 'FULL_TIME' ? 'Full-time' : 'Part-time'}</span></div><p className="mt-5 whitespace-pre-line text-gray-600">{opening.description}</p>{opening.requirements?.length > 0 && <div className="mt-5"><h4 className="font-semibold text-gray-900">What you&apos;ll bring</h4><ul className="mt-2 space-y-2 text-sm text-gray-600">{opening.requirements.map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</li>)}</ul></div>}<button onClick={() => setSelected(opening)} className="mt-7 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary/90">Apply now <Send className="h-4 w-4" /></button></article>)}
      </div>
    </main>

    {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 sm:p-8"><div className="flex items-start justify-between"><div><h2 className="text-2xl font-bold text-gray-900">Apply for {selected.title}</h2><p className="mt-1 text-sm text-gray-500">Share your details and our team will be in touch.</p></div><button onClick={() => setSelected(null)} aria-label="Close" className="rounded-full p-2 text-gray-500 hover:bg-gray-100"><X /></button></div><form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="mt-6 space-y-4">{([['name','Full name',true],['email','Email address',true],['phone','Phone number',false]] as const).map(([field, label, required]) => <div key={field}><label className="mb-1 block text-sm font-medium text-gray-700" htmlFor={field}>{label}</label><input id={field} type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'} required={required} value={form[field]} onChange={(e) => update(field, e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></div>)}<div><label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="resume">Resume (PDF, DOC, DOCX)</label><input id="resume" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" required onChange={(e) => setResume(e.target.files?.[0] ?? null)} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm" /></div><div><label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="coverLetter">Cover letter</label><textarea id="coverLetter" rows={5} value={form.coverLetter} onChange={(e) => update('coverLetter', e.target.value)} className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></div><button disabled={mutation.isPending} className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">{mutation.isPending ? 'Submitting...' : 'Submit application'} <Send className="h-4 w-4" /></button></form></div></div>}
  </div>;
}

