import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  CheckCircle2, 
  ArrowRight, 
  FileText,
  Smartphone,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PaymentScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentBooking, settlePayment, t } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const baseFare = Number(currentBooking?.lockedFare ?? currentBooking?.currentTotalFare ?? 34800);
  const approvedExtras = Number(currentBooking?.confirmedSurchargesTotal ?? 0);
  const subtotal = baseFare + approvedExtras;
  const taxes = Math.round(subtotal * 0.05);
  const totalPayable = subtotal + taxes;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      settlePayment(paymentMethod);

      setTimeout(() => {
        navigate('/trips');
      }, 1200);
    }, 700);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate('/trip')}
        className="text-xs text-muted hover:text-ink flex items-center space-x-1 mb-4 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Trip</span>
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-xs text-primary font-bold uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Trip Completed</span>
        </div>
        <h1 className="font-condensed font-bold text-3xl text-ink tracking-tight">
          {t.payment.title}
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Trip #{currentBooking.consignmentId} • {t.payment.settlementNotice}
        </p>
      </div>

      {isSuccess ? (
        <div className="bg-card rounded-2xl p-8 border border-status-verified shadow-xl text-center space-y-4 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-status-verified-tint text-status-verified flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="font-condensed font-bold text-3xl text-ink">
            Payment Complete!
          </h2>
          <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
            Payment of <strong className="text-ink">₹{totalPayable.toLocaleString('en-IN')}</strong> was successful. Receipt and invoice are saved to your account.
          </p>
          <div className="text-xs font-semibold text-primary">
            Redirecting to Trip History...
          </div>
        </div>
      ) : (
        <form onSubmit={handlePay} className="space-y-6">
          {/* Clean Receipt Summary */}
          <div className="bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-surface mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-primary" />
                <span>{t.payment.fareBreakdown}</span>
              </h2>
              <span className="text-xs text-muted">
                Trip #{currentBooking.consignmentId}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-muted">
                <span>{t.payment.baseFare}:</span>
                <span className="font-bold text-ink">₹{baseFare.toLocaleString('en-IN')}</span>
              </div>

              {approvedExtras > 0 ? (
                <div className="flex justify-between text-status-warning">
                  <span>{t.payment.surcharge}:</span>
                  <span className="font-bold text-ink">+₹{approvedExtras.toLocaleString('en-IN')}</span>
                </div>
              ) : (
                <div className="flex justify-between text-muted">
                  <span>Approved Extras:</span>
                  <span>₹0</span>
                </div>
              )}

              <div className="flex justify-between text-muted">
                <span>{t.payment.taxes}:</span>
                <span className="font-bold text-ink">₹{taxes.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-3 border-t border-border flex justify-between items-baseline font-sans">
                <div>
                  <span className="text-xs font-bold uppercase text-ink tracking-wider block">
                    {t.payment.totalAmount}
                  </span>
                  <span className="text-[11px] text-muted">All inclusive final price</span>
                </div>
                <div className="font-condensed font-bold text-3xl text-ink">
                  ₹{totalPayable.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-card rounded-2xl p-5 border border-border shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
              Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {/* UPI */}
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3.5 rounded-xl border text-left flex items-center space-x-3 transition-all cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'border-primary bg-primary-tint ring-1 ring-primary'
                    : 'border-border hover:bg-surface'
                }`}
              >
                <Smartphone className={`w-5 h-5 ${paymentMethod === 'upi' ? 'text-primary' : 'text-muted'}`} />
                <div className="flex-1">
                  <span className="text-xs font-bold text-ink block">
                    {t.payment.payWithUpi}
                  </span>
                  <span className="text-[11px] text-muted">Instant UPI transfer</span>
                </div>
                {paymentMethod === 'upi' && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>

              {/* Card */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-xl border text-left flex items-center space-x-3 transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-primary bg-primary-tint ring-1 ring-primary'
                    : 'border-border hover:bg-surface'
                }`}
              >
                <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-primary' : 'text-muted'}`} />
                <div className="flex-1">
                  <span className="text-xs font-bold text-ink block">
                    {t.payment.payWithCard}
                  </span>
                  <span className="text-[11px] text-muted">Visa, RuPay, Mastercard</span>
                </div>
                {paymentMethod === 'card' && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            </div>

            {/* Simple Input */}
            {paymentMethod === 'upi' ? (
              <div>
                <label htmlFor="upi-vpa" className="block text-xs font-semibold text-ink mb-1.5">
                  UPI ID (Google Pay, PhonePe, or Paytm)
                </label>
                <input
                  id="upi-vpa"
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. mobile@upi"
                  className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-xs font-mono text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            ) : (
              <div>
                <label htmlFor="card-num" className="block text-xs font-semibold text-ink mb-1.5">
                  Card Number
                </label>
                <input
                  id="card-num"
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="Card number"
                  className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-xs font-mono text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}
          </div>

          {/* Pay Button - Single Primary CTA */}
          <button
            type="submit"
            id="btn-settle-payment"
            disabled={isProcessing}
            className="w-full py-4 px-4 rounded-xl bg-primary hover:bg-primary-dark active:scale-[0.99] text-card text-xs font-bold uppercase tracking-wider shadow-lg transition-all flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-card border-t-transparent rounded-full animate-spin" />
                <span>{t.payment.processing}</span>
              </div>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Pay ₹{totalPayable.toLocaleString('en-IN')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
