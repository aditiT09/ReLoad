import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HistoricalTrip } from '../types';

export const TripHistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { tripHistory, currentBooking, t } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'in_transit' | 'delivered' | 'disputed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter trips
  const filteredTrips = tripHistory.filter((trip) => {
    const matchesSearch = 
      trip.consignmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.originCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destinationCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.vehicleName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'all') return true;
    if (activeFilter === 'in_transit') return trip.status === 'In Transit';
    if (activeFilter === 'delivered') return trip.status === 'Delivered';
    if (activeFilter === 'disputed') return trip.status === 'Disputed';
    return true;
  });

  const getStatusBadge = (status: HistoricalTrip['status']) => {
    switch (status) {
      case 'In Transit':
        return (
          <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-regulated-cargo-tint text-regulated-cargo border border-regulated-cargo/30">
            <span className="w-1.5 h-1.5 rounded-full bg-regulated-cargo animate-pulse" />
            <span>Active Trip</span>
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-status-verified-tint text-status-verified border border-status-verified/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Completed</span>
          </span>
        );
      case 'Disputed':
        return (
          <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-status-critical-tint text-status-critical border border-status-critical/30">
            <AlertTriangle className="w-3 h-3" />
            <span>Payment on Hold</span>
          </span>
        );
      default:
        return null;
    }
  };

  const handleTripClick = (trip: HistoricalTrip) => {
    if (trip.status === 'Disputed' && trip.disputeId) {
      navigate(`/report/${trip.disputeId}`);
    } else if (trip.consignmentId === currentBooking.consignmentId && currentBooking.status !== 'closed' && currentBooking.status !== 'payment_settled') {
      navigate('/trip');
    } else {
      navigate('/payment');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-condensed font-bold text-3xl text-ink tracking-tight">
            {t.history.title}
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            View past bookings, receipts, and live status.
          </p>
        </div>

        <button
          onClick={() => navigate('/book')}
          className="py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-dark text-card text-xs font-bold transition-colors flex items-center space-x-1.5 self-start sm:self-auto shadow-sm"
        >
          <span>Book New Truck</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-card rounded-2xl p-4 border border-border shadow-xs space-y-3 mb-6">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by trip number, city, or vehicle..."
            className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-xl text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              activeFilter === 'all'
                ? 'bg-ink text-card'
                : 'bg-surface text-muted hover:bg-neutral-state-tint'
            }`}
          >
            {t.history.filterAll}
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('in_transit')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              activeFilter === 'in_transit'
                ? 'bg-ink text-card'
                : 'bg-surface text-muted hover:bg-neutral-state-tint'
            }`}
          >
            {t.history.filterInTransit}
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('delivered')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              activeFilter === 'delivered'
                ? 'bg-ink text-card'
                : 'bg-surface text-muted hover:bg-neutral-state-tint'
            }`}
          >
            {t.history.filterDelivered}
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('disputed')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              activeFilter === 'disputed'
                ? 'bg-ink text-card'
                : 'bg-surface text-muted hover:bg-neutral-state-tint'
            }`}
          >
            {t.history.filterDisputed}
          </button>
        </div>
      </div>

      {/* Trips List */}
      <div className="space-y-3">
        {filteredTrips.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 border border-border text-center">
            <p className="text-xs text-muted">No trips found matching your filter.</p>
          </div>
        ) : (
          filteredTrips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => handleTripClick(trip)}
              className="bg-card rounded-2xl p-4 sm:p-5 border border-border hover:border-primary shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-ink">
                      Trip #{trip.consignmentId}
                    </span>
                    {getStatusBadge(trip.status)}
                    <span className="text-xs text-muted">
                      • {trip.date}
                    </span>
                  </div>

                  {/* Route */}
                  <div className="flex items-center space-x-2 text-sm font-semibold text-ink pt-1">
                    <span>{trip.originCity}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted" />
                    <span>{trip.destinationCity}</span>
                  </div>

                  <p className="text-xs text-muted">
                    {trip.vehicleName} • Driver: {trip.driverName}
                  </p>
                </div>

                {/* Right: Fare & Arrow */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-border">
                  <div className="sm:text-right">
                    <span className="text-[10px] text-muted block uppercase font-bold">
                      {trip.status === 'In Transit' ? 'Locked Fare' : 'Paid Fare'}
                    </span>
                    <span className="font-condensed font-bold text-2xl text-ink">
                      ₹{Number(trip.finalAmount ?? 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center text-xs text-primary font-semibold mt-1 space-x-0.5">
                    <span>View Receipt</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
