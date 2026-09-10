import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Lock, 
  MessageSquare, 
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReportStatusScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { reports, currentBooking, t } = useApp();

  const report = reports.find(r => r.id === id) || reports[0];

  const steps = [
    { label: 'Report Received', sub: report?.filedAt || 'Today', status: 'completed' },
    { label: 'Support Team Reviewing', sub: 'In Progress • Specialist Assigned', status: 'active' },
    { label: 'Resolution & Payment Release', sub: 'Pending Verification', status: 'pending' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate('/trips')}
        className="text-xs text-muted hover:text-ink flex items-center space-x-1 mb-4 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Trip History</span>
      </button>

      {/* Header */}
      <div className="mb-6 bg-card p-5 rounded-2xl border border-border shadow-xs">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono font-bold bg-status-critical-tint text-status-critical px-2 py-0.5 rounded border border-status-critical/30 uppercase">
            Case #{report?.id || 'REP-901'}
          </span>
          <span className="text-xs text-muted">
            Trip #{report?.waybillId || currentBooking.consignmentId}
          </span>
        </div>
        <h1 className="font-condensed font-bold text-2xl sm:text-3xl text-ink mt-1">
          {t.report.statusTitle}
        </h1>
        <p className="text-xs text-muted mt-0.5 flex items-center space-x-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>Filed: {report?.filedAt || 'Just now'}</span>
        </p>
      </div>

      {/* Reassurance Banner */}
      <div className="mb-6 p-5 bg-ink text-card rounded-2xl border border-neutral-state/30 shadow-md">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-primary-tint border border-primary/40 flex items-center justify-center text-primary shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-condensed font-bold text-xl text-card">
              Your Payment is Protected
            </h3>
            <p className="text-xs text-border mt-1 leading-relaxed">
              {t.report.escrowProtectedNotice}
            </p>
            <p className="text-xs text-primary-tint font-semibold mt-2">
              Fare held safely: ₹{(report?.escrowLockedAmount ?? currentBooking?.currentTotalFare ?? currentBooking?.lockedFare ?? 34800).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-card rounded-2xl p-5 border border-border shadow-xs mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-4">
          Review Status
        </h2>

        <div className="space-y-4">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-start space-x-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                step.status === 'completed'
                  ? 'bg-primary text-card'
                  : step.status === 'active'
                  ? 'bg-status-warning text-card animate-pulse'
                  : 'bg-surface text-muted border border-border'
              }`}>
                {step.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>

              <div>
                <span className={`text-xs font-bold block ${
                  step.status === 'completed' ? 'text-primary' : step.status === 'active' ? 'text-ink' : 'text-muted'
                }`}>
                  {step.label}
                </span>
                <span className="text-[11px] text-muted">
                  {step.sub}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Need Immediate Help */}
      <div className="bg-card rounded-2xl p-5 border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-ink block">
            Questions about this report?
          </span>
          <span className="text-xs text-muted">
            Our 24/7 customer support team is available.
          </span>
        </div>

        <button
          onClick={() => navigate('/chat')}
          className="px-4 py-2.5 bg-ink hover:bg-admin-shell text-card text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-colors self-start sm:self-auto"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Open Support Chat</span>
        </button>
      </div>
    </div>
  );
};
