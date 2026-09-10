import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertCircle, 
  ArrowLeft, 
  Camera, 
  Lock, 
  User, 
  Truck, 
  DollarSign, 
  ThermometerSnowflake, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FileReportScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentBooking, fileReport, t } = useApp();

  const [category, setCategory] = useState<'conduct' | 'vehicle_state' | 'pricing' | 'temperature_breach' | 'other'>('temperature_breach');
  const [description, setDescription] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const problemOptions = [
    { 
      id: 'conduct' as const, 
      label: 'Driver Conduct', 
      desc: 'Unprofessional behavior, delays, or unsafe driving',
      icon: User 
    },
    { 
      id: 'vehicle_state' as const, 
      label: 'Vehicle Condition', 
      desc: 'Vehicle breakdown, dirty container, or mechanical issues',
      icon: Truck 
    },
    { 
      id: 'pricing' as const, 
      label: 'Price / Extra Fee Issue', 
      desc: 'Disputed surcharge or unauthorized toll request',
      icon: DollarSign 
    },
    { 
      id: 'temperature_breach' as const, 
      label: 'Temperature Issue', 
      desc: 'Cargo temperature exceeded required 2°C - 8°C limits',
      icon: ThermometerSnowflake 
    },
    { 
      id: 'other' as const, 
      label: 'Other Problem', 
      desc: 'Packaging damage, route mismatch, or other concern',
      icon: HelpCircle 
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    const newReportId = fileReport({
      targetType: 'driver',
      targetName: currentBooking.driver?.name || 'Rajesh Kumar',
      category,
      description,
      attachmentName: hasPhoto ? 'issue_evidence_photo.jpg' : undefined,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      navigate(`/report/${newReportId}`);
    }, 500);
  };

  const isValid = description.trim().length >= 10;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate('/trip')}
        className="text-xs text-muted hover:text-ink flex items-center space-x-1 mb-4 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Trip</span>
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-xs text-status-critical font-bold uppercase tracking-wider mb-1">
          <AlertCircle className="w-4 h-4" />
          <span>Customer Support & Protection</span>
        </div>
        <h1 className="font-condensed font-bold text-3xl text-ink tracking-tight">
          {t.report.title}
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Trip #{currentBooking.consignmentId} • {t.report.empathyNotice}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Reassurance Banner */}
        <div className="p-4 bg-ink text-card rounded-2xl border border-neutral-state/30 flex items-start space-x-3">
          <Lock className="w-4 h-4 text-primary-tint shrink-0 mt-0.5" />
          <div className="text-xs text-border leading-relaxed">
            <strong className="text-card block mb-0.5">Your payment is protected:</strong>
            Filing a report immediately pauses payment release of <strong>₹{(currentBooking?.currentTotalFare ?? currentBooking?.lockedFare ?? 34800).toLocaleString('en-IN')}</strong> to the driver until our team resolves this with you.
          </div>
        </div>

        {/* Problem Category Selection */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
            {t.report.categorySection}
          </h2>

          <div className="space-y-2.5">
            {problemOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = category === opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() => setCategory(opt.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center space-x-3 text-left ${
                    isSelected
                      ? 'border-primary bg-primary-tint ring-1 ring-primary'
                      : 'border-border hover:bg-surface'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${
                    isSelected ? 'bg-primary text-card' : 'bg-surface text-ink'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1">
                    <span className="text-xs font-bold text-ink block">
                      {opt.label}
                    </span>
                    <span className="text-[11px] text-muted">
                      {opt.desc}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-primary text-card flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Description Box */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-xs">
          <label htmlFor="problem-desc" className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
            What happened?
          </label>
          <textarea
            id="problem-desc"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.report.descriptionPlaceholder}
            className="w-full p-3 bg-surface border border-border rounded-xl text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <span className="text-[11px] text-muted mt-1 block">
            Please include specific details (e.g. times, temperature readings, or driver remarks).
          </span>
        </div>

        {/* Optional Photo Attachment */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
            {t.report.uploadLabel}
          </h2>

          <button
            type="button"
            onClick={() => setHasPhoto(!hasPhoto)}
            className={`w-full p-4 rounded-xl border border-dashed flex items-center justify-center space-x-2 transition-colors cursor-pointer ${
              hasPhoto 
                ? 'border-primary bg-primary-tint text-primary' 
                : 'border-border hover:bg-surface text-muted'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span className="text-xs font-semibold">
              {hasPhoto ? 'Photo Attached: issue_evidence_photo.jpg (tap to remove)' : 'Add Photo of Cargo or Receipt'}
            </span>
          </button>
        </div>

        {/* Submit Report */}
        <button
          type="submit"
          id="btn-submit-report"
          disabled={!isValid || isSubmitting}
          className={`w-full py-4 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-card shadow-lg transition-all flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary ${
            isValid && !isSubmitting
              ? 'bg-status-critical hover:bg-red-700 active:scale-[0.99] cursor-pointer'
              : 'bg-neutral-state cursor-not-allowed opacity-60'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Submitting Report...</span>
            </div>
          ) : (
            <>
              <span>{t.report.submitButton}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
