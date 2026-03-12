'use client';

import { useState } from 'react';
import { Calendar, Clock, CheckCircle, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

const DEFAULT_SERVICES = [
  'Consultation',
  'Custom Design',
  'Ring Sizing',
  'Jewelry Cleaning',
  'Valuation',
];

const timeSlots = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
  '8:00 PM', '8:30 PM',
];

interface BookingFormProps {
  services?: string[];
}

export default function BookingForm({ services = DEFAULT_SERVICES }: BookingFormProps) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    date: '',
    time: '',
    notes: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  const update = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  // Minimum date = tomorrow
  const minDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  if (status === 'sent') {
    return (
      <section className="section" id="booking">
        <div className="container-site max-w-2xl mx-auto text-center">
          <div className="bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] p-12 border border-[var(--color-text)]/5">
            <CheckCircle size={56} className="text-[var(--color-success)] mx-auto mb-6" />
            <h2
              className="text-3xl font-bold text-[var(--color-text)] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Appointment Confirmed
            </h2>
            <p className="text-[var(--color-text-muted)] mb-2">
              Your appointment for <strong className="text-[var(--color-primary)]">{form.service}</strong> has been booked.
            </p>
            <p className="text-[var(--color-text-muted)] mb-8">
              {form.date} at {form.time}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">
              We&apos;ll send a confirmation to <strong>{form.email}</strong>.
            </p>
            <button
              onClick={() => {
                setStatus('idle');
                setForm({ name: '', phone: '', email: '', service: '', date: '', time: '', notes: '' });
              }}
              className="btn btn-outline mt-8"
            >
              Book Another Appointment
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section" id="booking">
      <div className="container-site max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2
            className="text-3xl md:text-4xl font-bold text-gradient mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Book an Appointment
          </h2>
          <p className="text-[var(--color-text-muted)]">
            Schedule a private consultation with our jewelry experts.
          </p>
          <div className="divider max-w-xs mx-auto" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] p-6 md:p-10 border border-[var(--color-text)]/5 space-y-6"
        >
          {/* Name + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="input-label" htmlFor="booking-name">Full Name</label>
              <input
                id="booking-name"
                type="text"
                required
                className="input"
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
              />
            </div>
            <div>
              <label className="input-label" htmlFor="booking-phone">Phone</label>
              <input
                id="booking-phone"
                type="tel"
                required
                className="input"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="input-label" htmlFor="booking-email">Email</label>
            <input
              id="booking-email"
              type="email"
              required
              className="input"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
            />
          </div>

          {/* Service */}
          <div>
            <label className="input-label" htmlFor="booking-service">Service</label>
            <select
              id="booking-service"
              required
              className="input"
              value={form.service}
              onChange={(e) => update('service', e.target.value)}
            >
              <option value="">Select a service</option>
              {services.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="input-label" htmlFor="booking-date">
                <span className="inline-flex items-center gap-2">
                  <Calendar size={14} /> Preferred Date
                </span>
              </label>
              <input
                id="booking-date"
                type="date"
                required
                min={minDate}
                className="input"
                value={form.date}
                onChange={(e) => update('date', e.target.value)}
              />
            </div>
            <div>
              <label className="input-label" htmlFor="booking-time">
                <span className="inline-flex items-center gap-2">
                  <Clock size={14} /> Preferred Time
                </span>
              </label>
              <select
                id="booking-time"
                required
                className="input"
                value={form.time}
                onChange={(e) => update('time', e.target.value)}
              >
                <option value="">Select a time</option>
                {timeSlots.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="input-label" htmlFor="booking-notes">Additional Notes</label>
            <textarea
              id="booking-notes"
              className="input"
              rows={3}
              placeholder="Any special requests or details..."
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
            />
          </div>

          {status === 'error' && (
            <p className="text-sm text-[var(--color-error)]">
              Something went wrong. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className={cn('btn btn-primary w-full', status === 'sending' && 'opacity-70')}
          >
            {status === 'sending' ? 'Booking...' : (
              <>
                <Send size={16} />
                Book Appointment
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
