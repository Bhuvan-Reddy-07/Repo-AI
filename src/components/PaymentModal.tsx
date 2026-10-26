import React, { useState } from 'react';
import {
  X,
  CreditCard,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  Download,
  ArrowRight,
  Sparkles,
  Zap,
  Building,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PlanType = 'pro' | 'team';

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Form fields
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [simulateDecline, setSimulateDecline] = useState(false);

  // States
  const [errors, setErrors] = useState<{
    cardName?: string;
    cardNumber?: string;
    cardExpiry?: string;
    cardCvv?: string;
    general?: string;
  }>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState<{
    transactionId: string;
    date: string;
    amount: string;
    plan: string;
  } | null>(null);

  if (!isOpen) return null;

  // Plan costs
  const basePrice = selectedPlan === 'pro' ? 12 : 49;
  const cycleDiscount = billingCycle === 'yearly' ? 0.8 : 1.0; // 20% discount on yearly
  const couponDiscount = discountApplied ? 0.85 : 1.0; // 15% discount
  const finalPrice = Math.round(basePrice * cycleDiscount * couponDiscount);

  const formatCardNumber = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    return raw.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      return `${raw.slice(0, 2)}/${raw.slice(2, 4)}`;
    }
    return raw;
  };

  const validate = () => {
    const errs: typeof errors = {};
    if (!cardName.trim()) errs.cardName = 'Name on card is required';

    const cleanCard = cardNumber.replace(/\s/g, '');
    if (!cleanCard || cleanCard.length < 15) {
      errs.cardNumber = 'Valid 15 or 16-digit card number required';
    }

    if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      errs.cardExpiry = 'MM/YY required';
    } else {
      const [m, y] = cardExpiry.split('/').map(Number);
      if (m < 1 || m > 12) errs.cardExpiry = 'Invalid month';
    }

    if (!cardCvv || cardCvv.length < 3) {
      errs.cardCvv = '3-4 digit CVV required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleApplyDiscount = () => {
    if (discountCode.trim().toUpperCase() === 'LAUNCH2026') {
      setDiscountApplied(true);
      setErrors((prev) => ({ ...prev, general: undefined }));
    } else {
      setErrors((prev) => ({ ...prev, general: 'Invalid discount code. Try "LAUNCH2026"' }));
    }
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsProcessing(true);
    setErrors({});

    setTimeout(() => {
      setIsProcessing(false);
      if (simulateDecline) {
        setErrors({
          general: 'Payment Declined (Test Card simulation): Insufficient funds or invalid card issuer response.',
        });
        return;
      }

      const receipt = {
        transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        amount: `$${finalPrice}.00`,
        plan: selectedPlan === 'pro' ? 'Pro Developer' : 'Team Command Center',
      };
      setReceiptData(receipt);
      setPaymentSuccess(true);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn print:hidden">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400 border border-blue-200 dark:border-blue-800/40">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Secure Checkout &amp; Subscription</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  256-Bit SSL Secured
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Test the end-to-end payment workflow before launching.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentSuccess && receiptData ? (
          /* Payment Success State / Printable Receipt */
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-4 text-center animate-fadeIn">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-emerald-950 dark:text-emerald-200">
                Payment Verified &amp; Confirmed
              </h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-400 mt-1">
                Your transaction has been settled. Full access has been enabled.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="max-w-md mx-auto p-4 rounded-xl bg-white dark:bg-[#0D1117] border border-emerald-200 dark:border-emerald-900/40 text-left font-mono text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="font-bold text-slate-900 dark:text-white">{receiptData.transactionId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-400">Plan:</span>
                <span className="font-bold text-slate-900 dark:text-white">{receiptData.plan}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-400">Date:</span>
                <span className="text-slate-700 dark:text-slate-300">{receiptData.date}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold">
                <span className="text-slate-900 dark:text-white">Total Charged:</span>
                <span className="text-emerald-600 dark:text-emerald-400">{receiptData.amount}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Payment Form */
          <form onSubmit={handleProcessPayment} className="space-y-5">
            {/* General Error Notice */}
            {errors.general && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2 text-xs text-rose-700 dark:text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errors.general}</span>
              </div>
            )}

            {/* Plan Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setSelectedPlan('pro')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedPlan === 'pro'
                    ? 'bg-sky-50/70 dark:bg-sky-950/30 border-sky-400 dark:border-sky-500 text-slate-900 dark:text-white ring-1 ring-sky-400 dark:ring-sky-500 shadow-sm shadow-sky-500/10'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-sky-500" />
                    Pro Developer
                  </span>
                  <span className="text-sm font-extrabold text-sky-600 dark:text-sky-400 font-mono">
                    $12<span className="text-[10px] font-normal text-slate-400">/mo</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Unlimited repo blueprints, token digests, and priority API rates.
                </p>
              </div>

              <div
                onClick={() => setSelectedPlan('team')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedPlan === 'team'
                    ? 'bg-sky-50/70 dark:bg-sky-950/30 border-sky-400 dark:border-sky-500 text-slate-900 dark:text-white ring-1 ring-sky-400 dark:ring-sky-500 shadow-sm shadow-sky-500/10'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-sky-400" />
                    Team Command Center
                  </span>
                  <span className="text-sm font-extrabold text-sky-600 dark:text-sky-400 font-mono">
                    $49<span className="text-[10px] font-normal text-slate-400">/mo</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Custom domain linking, team seat management, and CI automation.
                </p>
              </div>
            </div>

            {/* Card Information */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => {
                    setCardName(e.target.value);
                    if (errors.cardName) setErrors({ ...errors, cardName: undefined });
                  }}
                  placeholder="e.g. Satoshi Nakamoto"
                  className={`w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors ${
                    errors.cardName
                      ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'
                  }`}
                />
                {errors.cardName && <p className="text-[10px] text-rose-500 mt-1">{errors.cardName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => {
                      setCardNumber(formatCardNumber(e.target.value));
                      if (errors.cardNumber) setErrors({ ...errors, cardNumber: undefined });
                    }}
                    placeholder="4242 •••• •••• 4242"
                    maxLength={19}
                    className={`w-full pl-9 pr-3.5 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors ${
                      errors.cardNumber
                        ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'
                    }`}
                  />
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
                {errors.cardNumber && <p className="text-[10px] text-rose-500 mt-1">{errors.cardNumber}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Expiration (MM/YY)
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => {
                      setCardExpiry(formatExpiry(e.target.value));
                      if (errors.cardExpiry) setErrors({ ...errors, cardExpiry: undefined });
                    }}
                    placeholder="12/28"
                    maxLength={5}
                    className={`w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors ${
                      errors.cardExpiry
                        ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'
                    }`}
                  />
                  {errors.cardExpiry && <p className="text-[10px] text-rose-500 mt-1">{errors.cardExpiry}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    CVV Security Code
                  </label>
                  <input
                    type="password"
                    value={cardCvv}
                    onChange={(e) => {
                      setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4));
                      if (errors.cardCvv) setErrors({ ...errors, cardCvv: undefined });
                    }}
                    placeholder="•••"
                    maxLength={4}
                    className={`w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors ${
                      errors.cardCvv
                        ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'
                    }`}
                  />
                  {errors.cardCvv && <p className="text-[10px] text-rose-500 mt-1">{errors.cardCvv}</p>}
                </div>
              </div>
            </div>

            {/* Discount Code */}
            <div className="pt-1">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Have a Launch Discount Code?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="Enter code (try LAUNCH2026)"
                  className="flex-1 px-3 py-1.5 text-xs font-mono uppercase rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyDiscount}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                >
                  Apply
                </button>
              </div>
              {discountApplied && (
                <p className="text-[10px] text-emerald-500 font-mono mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" /> 15% Launch Discount Applied!
                </p>
              )}
            </div>

            {/* Test Simulation Controls */}
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
                Pre-Flight Payment Testing Controls
              </span>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300">Simulate Card Decline Error:</span>
                <input
                  type="checkbox"
                  checked={simulateDecline}
                  onChange={(e) => setSimulateDecline(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
              </div>
            </div>

            {/* Total and Submit */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-mono">Total Billed Today:</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                  ${finalPrice}.00
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00A3FF] via-[#0080FF] to-[#0066FF] hover:from-[#38E1FF] hover:to-[#0070F3] text-white text-xs font-bold shadow-md shadow-sky-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Verifying with Issuer...</span>
                  ) : (
                    <>
                      <span>Pay ${finalPrice}.00</span>
                      <Lock className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
