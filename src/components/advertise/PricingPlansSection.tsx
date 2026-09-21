'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { subscriptionService } from '@/services/subscription.service';
import { Check, X, Star, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface PlanFeature {
  name: string;
  included: boolean;
  tooltip?: string;
}

const planFeatures: PlanFeature[] = [
  { name: 'Premium Listing', included: true },
  { name: 'Guaranteed Leads', included: true },
  { name: 'Online Catalogue', included: true },
  { name: 'Payment Solutions', included: true },
  { name: 'Smart Lead System', included: true },
  { name: 'Competitor Analysis', included: true },
  { name: 'Premium Customer Support', included: true },
  { name: 'Trust Stamp', included: false },
  { name: 'Verified Seal', included: false },
  { name: 'Top 5 Visibility', included: false },
];

export default function PricingPlansSection() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const { data: plansData, isLoading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: () => subscriptionService.getSubscriptionPlans({ status: 'ACTIVE', includeSponsor: 'false' }),
  });

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    router.push(`/dashboard/subscriptions?plan=${planId}`);
  };

  const formatInterval = (count: number = 1, interval: string = 'MONTH') => {
    const labels: Record<string, string> = { DAY: 'day', WEEK: 'week', MONTH: 'month', YEAR: 'year', CUSTOM: 'day' };
    const label = labels[interval] || interval.toLowerCase();
    return `${count > 1 ? `${count} ` : ''}${label}${count > 1 ? 's' : ''}`;
  };

  // Default plans if API doesn't return any
  const defaultPlans = [
    {
      id: '1',
      name: '1 Year Plan',
      price: 99,
      originalPrice: 132,
      currency: 'SAR',
      interval: 'DAY',
      discount: 25,
      features: planFeatures,
    },
    {
      id: '2',
      name: '2 Year Plan',
      price: 75,
      originalPrice: 132,
      currency: 'SAR',
      interval: 'DAY',
      discount: 44,
      features: planFeatures,
    },
    {
      id: '3',
      name: '3 Year Plan',
      price: 66,
      originalPrice: 132,
      currency: 'SAR',
      interval: 'DAY',
      discount: 50,
      features: planFeatures.map((f, i) => ({
        ...f,
        included: i < 8, // Trust Stamp included in 3 year
      })),
    },
    {
      id: '4',
      name: 'Growth Plan',
      price: 150,
      originalPrice: 200,
      currency: 'SAR',
      interval: 'DAY',
      discount: 25,
      isRecommended: true,
      features: planFeatures.map((f) => ({
        ...f,
        included: f.name === 'Top 5 Visibility' ? true : f.included,
      })),
    },
  ];

  const plans = plansData?.data?.plans || plansData?.data?.subscriptions || [];
  const displayPlans = plans.length > 0 
    ? plans.filter((p: any) => p.status === 'ACTIVE' && !p.isSponsorPlan).slice(0, 4)
    : defaultPlans;

  return (
    <section id="pricing" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            These are the plans available for your selected categories. Pick a plan and start growing your business today.
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl p-6 h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayPlans.slice(0, 4).map((plan: any) => {
              const isRecommended = plan.isRecommended || plan.name?.toLowerCase().includes('growth');
              const basePrice = Number(plan.price ?? 0);
              const salePrice = plan.salePrice != null ? Number(plan.salePrice) : null;
              const hasDiscount = salePrice !== null && salePrice > 0 && salePrice < basePrice;
              const displayPrice = hasDiscount ? salePrice : basePrice || salePrice || 99;
              const fallbackOriginalPrice = plan.originalPrice != null ? Number(plan.originalPrice) : null;
              const originalPrice = hasDiscount
                ? basePrice
                : salePrice !== null && salePrice > basePrice
                  ? salePrice
                  : fallbackOriginalPrice && fallbackOriginalPrice > basePrice
                    ? fallbackOriginalPrice
                    : null;
              const discount = originalPrice && originalPrice > displayPrice
                ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
                : 0;
              const planName = plan.name || 'Standard Plan';
              const currency = plan.currency || 'SAR';
              const interval = formatInterval(plan.intervalCount, plan.billingInterval || plan.interval);
              const featureEntries: [string, boolean][] = Array.isArray(plan.features)
                ? plan.features.map((feature: PlanFeature) => [feature.name, feature.included])
                : Object.entries(plan.features || {});

              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-2xl border-2 p-6 ${
                    isRecommended
                      ? 'border-primary shadow-xl scale-105'
                      : 'border-gray-200 hover:border-primary/50 hover:shadow-lg transition-all'
                  }`}
                >
                  {isRecommended && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current" />
                        Recommended
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{planName}</h3>
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <span className="text-3xl font-bold text-gray-900">
                        {currency} {displayPrice.toFixed(0)}
                      </span>
                      <span className="text-gray-500">/ {interval}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm text-gray-400 line-through">
                          {currency} {originalPrice?.toFixed(0)}/{interval}
                        </span>
                        <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                          {discount}% Off
                        </span>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">Onwards*</p>
                  </div>

                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors mb-6 ${
                      isRecommended
                        ? 'bg-primary text-white hover:bg-primary/90'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Select Plan
                  </button>

                  <div className="space-y-3">
                    {featureEntries.map(([key, included]) => {
                      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (value) => value.toUpperCase());
                      return <div key={key} className="flex items-center gap-2">
                        {included ? <Check className="w-5 h-5 text-green-500 flex-shrink-0" /> : <X className="w-5 h-5 text-gray-300 flex-shrink-0" />}
                        <span className={`text-sm ${included ? 'text-gray-700' : 'text-gray-400'}`}>{label}</span>
                      </div>;
                    })}
                    {!featureEntries.length && <p className="text-sm text-gray-500">No features included.</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-xs text-gray-500 text-center mt-8 max-w-3xl mx-auto">
          * This is an indicative price. Final price is calculated based on selected category and city and will be seen in the checkout page.
        </p>
      </div>
    </section>
  );
}

