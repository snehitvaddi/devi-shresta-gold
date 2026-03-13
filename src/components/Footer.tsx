'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, MessageCircle, MapPin, Phone, Mail, Clock, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OrgData } from '@/types';

interface FooterProps {
  orgData: OrgData;
}

function FooterAccordion({
  title,
  children,
  openSection,
  sectionKey,
  toggle,
}: {
  title: string;
  children: React.ReactNode;
  openSection: string | null;
  sectionKey: string;
  toggle: (key: string) => void;
}) {
  const isOpen = openSection === sectionKey;

  return (
    <div>
      {/* Mobile: clickable heading */}
      <button
        type="button"
        onClick={() => toggle(sectionKey)}
        className="md:hidden flex items-center justify-between w-full text-left"
      >
        <h4 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-primary)]">
          {title}
        </h4>
        <ChevronDown
          size={16}
          className={cn(
            'text-[var(--color-primary)] transition-transform duration-300',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {/* Desktop: static heading */}
      <h4 className="hidden md:block text-sm font-semibold uppercase tracking-widest text-[var(--color-primary)] mb-6">
        {title}
      </h4>

      {/* Mobile: collapsible content */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0',
        )}
      >
        {children}
      </div>

      {/* Desktop: always visible */}
      <div className="hidden md:block">
        {children}
      </div>
    </div>
  );
}

export default function Footer({ orgData }: FooterProps) {
  const year = new Date().getFullYear();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggle = (key: string) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  return (
    <footer className="bg-[var(--color-bg-surface)] border-t border-[var(--color-text)]/5">
      <div className="container-site section">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* About Column */}
          <div>
            <h3
              className="text-2xl font-bold text-gradient mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {orgData.name}
            </h3>
            <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-6">
              {orgData.description.slice(0, 160)}
              {orgData.description.length > 160 ? '...' : ''}
            </p>
          </div>

          {/* Quick Links */}
          <FooterAccordion
            title="Quick Links"
            sectionKey="links"
            openSection={openSection}
            toggle={toggle}
          >
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Collections', href: '/collections' },
                { label: 'Ring Size Guide', href: '/ring-size-guide' },
                { label: 'EMI Calculator', href: '/emi-calculator' },
                { label: 'Exchange Policy', href: '/exchange-policy' },
                { label: 'Video Call Shopping', href: '/video-call' },
                { label: 'Book Appointment', href: '/booking' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] text-sm transition-colors link-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterAccordion>

          {/* Contact Info */}
          <FooterAccordion
            title="Contact Info"
            sectionKey="contact"
            openSection={openSection}
            toggle={toggle}
          >
            <ul className="space-y-4 text-sm text-[var(--color-text-muted)]">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                <span>
                  {orgData.address.street}, {orgData.address.city},{' '}
                  {orgData.address.state} {orgData.address.zip}
                </span>
              </li>
              <li>
                <a
                  href={`tel:${orgData.phone}`}
                  className="flex items-center gap-3 hover:text-[var(--color-primary)] transition-colors"
                >
                  <Phone size={16} className="text-[var(--color-primary)] shrink-0" />
                  {orgData.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${orgData.email}`}
                  className="flex items-center gap-3 hover:text-[var(--color-primary)] transition-colors"
                >
                  <Mail size={16} className="text-[var(--color-primary)] shrink-0" />
                  {orgData.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={16} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                <span>
                  {(() => {
                    const openDays = orgData.businessHours.filter((h) => !h.closed);
                    const hours = openDays.length > 0 ? `${openDays[0].open} - ${openDays[0].close}` : '';
                    const daysLabel = openDays.length === 7 ? 'All 7 Days' : `${openDays.length} Days a Week`;
                    return `${hours} (${daysLabel})`;
                  })()}
                </span>
              </li>
            </ul>
          </FooterAccordion>

          {/* Social Media */}
          <FooterAccordion
            title="Follow Us"
            sectionKey="social"
            openSection={openSection}
            toggle={toggle}
          >
            <div className="flex items-center gap-4">
              {orgData.socialLinks.instagram && (
                <a
                  href={orgData.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    'border border-[var(--color-text)]/10 text-[var(--color-text-muted)]',
                    'hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]',
                    'transition-all duration-300',
                  )}
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
              )}
              {orgData.socialLinks.facebook && (
                <a
                  href={orgData.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    'border border-[var(--color-text)]/10 text-[var(--color-text-muted)]',
                    'hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]',
                    'transition-all duration-300',
                  )}
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>
              )}
              {orgData.socialLinks.whatsapp && (
                <a
                  href={`https://wa.me/${orgData.socialLinks.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    'border border-[var(--color-text)]/10 text-[var(--color-text-muted)]',
                    'hover:border-green-500 hover:text-green-500',
                    'transition-all duration-300',
                  )}
                  aria-label="WhatsApp"
                >
                  <MessageCircle size={18} />
                </a>
              )}
            </div>
          </FooterAccordion>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--color-text)]/5">
        <div className="container-site flex flex-col sm:flex-row items-center justify-between py-6 gap-4">
          <p className="text-xs text-[var(--color-text-muted)]">
            &copy; {year} {orgData.name}. All rights reserved.
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            Powered by{' '}
            <span className="text-[var(--color-primary)]">Any Website Builder</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
