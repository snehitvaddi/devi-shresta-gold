'use client';

import { useState } from 'react';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const TIME_SLOTS = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
  '8:00 PM',
];

const INTERESTS = ['Necklaces', 'Bangles', 'Rings', 'Earrings', 'Bridal Sets', 'Diamonds', 'Custom Design', 'Other'];
const BUDGETS = ['Under ₹50K', '₹50K - 1L', '₹1L - 3L', '₹3L - 5L', '₹5L+'];
const PLATFORMS = ['WhatsApp Video', 'Google Meet'];

function getMinDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

export default function VideoCallForm() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    interests: [] as string[],
    budget: '',
    platform: 'WhatsApp Video',
    notes: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const toggleInterest = (val: string) => {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(val) ? f.interests.filter((v) => v !== val) : [...f.interests, val],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/video-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="glass rounded-[var(--radius-lg)] p-8 md:p-12 text-center">
        <CheckCircle size={48} className="mx-auto mb-4 text-[var(--color-success)]" />
        <h3
          className="text-2xl font-bold text-[var(--color-text)] mb-2"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Video Call Booked!
        </h3>
        <p className="text-[var(--color-text-muted)] mb-6">
          We will send a confirmation on WhatsApp to {form.phone}. Our team will call you on {form.date} at {form.time}.
        </p>
        <button onClick={() => setStatus('idle')} className="btn btn-outline">
          Book Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-[var(--radius-lg)] p-6 md:p-8 space-y-6">
      {/* Name & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="vc-name" className="input-label">Name *</label>
          <input
            id="vc-name"
            type="text"
            className="input"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Your full name"
          />
        </div>
        <div>
          <label htmlFor="vc-phone" className="input-label">Phone *</label>
          <input
            id="vc-phone"
            type="tel"
            className="input"
            required
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="+91 98765 43210"
            pattern="[\+]?[0-9\s\-]{10,15}"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="vc-email" className="input-label">Email (optional)</label>
        <input
          id="vc-email"
          type="email"
          className="input"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="you@example.com"
        />
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="vc-date" className="input-label">Preferred Date *</label>
          <input
            id="vc-date"
            type="date"
            className="input"
            required
            min={getMinDate()}
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          />
        </div>
        <div>
          <label htmlFor="vc-time" className="input-label">Preferred Time *</label>
          <select
            id="vc-time"
            className="input"
            required
            value={form.time}
            onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
          >
            <option value="">Select time</option>
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Interests */}
      <div>
        <label className="input-label">What are you interested in?</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {INTERESTS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => toggleInterest(item)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                form.interests.includes(item)
                  ? 'bg-[var(--color-primary)] text-[var(--color-text-dark)]'
                  : 'bg-[var(--color-bg-surface-light)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <label className="input-label">Budget Range (optional)</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {BUDGETS.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setForm((f) => ({ ...f, budget: f.budget === b ? '' : b }))}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                form.budget === b
                  ? 'bg-[var(--color-primary)] text-[var(--color-text-dark)]'
                  : 'bg-[var(--color-bg-surface-light)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
              )}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Platform */}
      <div>
        <label className="input-label">Call Platform</label>
        <div className="flex gap-3 mt-1">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setForm((f) => ({ ...f, platform: p }))}
              className={cn(
                'px-4 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-all',
                form.platform === p
                  ? 'bg-[var(--color-primary)] text-[var(--color-text-dark)]'
                  : 'bg-[var(--color-bg-surface-light)] text-[var(--color-text-muted)]'
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="vc-notes" className="input-label">Any special requests? (optional)</label>
        <textarea
          id="vc-notes"
          className="input"
          rows={3}
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          placeholder="E.g., I want to see bridal sets in the 3-4 lakh range..."
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn btn-primary w-full justify-center"
      >
        {status === 'loading' ? (
          <><Loader2 size={18} className="animate-spin" /> Booking...</>
        ) : (
          <><Send size={18} /> Book Video Call</>
        )}
      </button>

      {status === 'error' && (
        <p className="text-sm text-[var(--color-error)] text-center">
          Something went wrong. Please try again or WhatsApp us directly.
        </p>
      )}
    </form>
  );
}
