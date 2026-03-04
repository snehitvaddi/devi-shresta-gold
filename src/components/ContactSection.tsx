'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OrgData } from '@/types';

interface ContactSectionProps {
  orgData: OrgData;
}

export default function ContactSection({ orgData }: ContactSectionProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('sent');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="section" id="contact">
      <div className="container-site">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold text-gradient mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Get in Touch
          </h2>
          <div className="divider max-w-xs mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Info */}
          <div>
            <h3
              className="text-2xl font-bold text-[var(--color-text)] mb-6"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {orgData.name}
            </h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-[var(--color-primary)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)] mb-1">Address</p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {orgData.address.street}, {orgData.address.city},{' '}
                    {orgData.address.state} {orgData.address.zip}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-[var(--color-primary)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)] mb-1">Phone</p>
                  <a
                    href={`tel:${orgData.phone}`}
                    className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {orgData.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-[var(--color-primary)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)] mb-1">Email</p>
                  <a
                    href={`mailto:${orgData.email}`}
                    className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {orgData.email}
                  </a>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                  <Clock size={18} className="text-[var(--color-primary)]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[var(--color-text)] mb-2">Business Hours</p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                    {orgData.businessHours.map((h) => (
                      <div key={h.day} className="flex justify-between text-sm">
                        <span className="text-[var(--color-text-muted)]">{h.day.slice(0, 3)}</span>
                        <span className={cn(
                          h.closed ? 'text-[var(--color-error)]' : 'text-[var(--color-text)]',
                        )}>
                          {h.closed ? 'Closed' : `${h.open} - ${h.close}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vertical Gold Divider (desktop only) -- handled by gap */}

          {/* Contact Form */}
          <div className="relative">
            {/* Gold accent line */}
            <div className="hidden lg:block absolute -left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--color-primary)] to-transparent" />

            {status === 'sent' ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-12">
                <CheckCircle size={48} className="text-[var(--color-success)]" />
                <h3
                  className="text-xl font-bold text-[var(--color-text)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Message Sent
                </h3>
                <p className="text-[var(--color-text-muted)]">
                  Thank you for reaching out. We will get back to you shortly.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="btn btn-outline mt-4"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="input-label" htmlFor="contact-name">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    className="input"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="input-label" htmlFor="contact-email">Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      className="input"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="input-label" htmlFor="contact-phone">Phone</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      className="input"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label" htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    required
                    className="input"
                    placeholder="How can we help you?"
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
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
                  {status === 'sending' ? 'Sending...' : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
