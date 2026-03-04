import { cn } from '@/lib/utils';

interface MapEmbedProps {
  lat: number;
  lng: number;
  zoom?: number;
  title?: string;
  businessName?: string;
}

export default function MapEmbed({
  lat,
  lng,
  zoom = 15,
  title = 'Visit Our Store',
  businessName,
}: MapEmbedProps) {
  // Use free Google Maps embed (no API key required)
  const query = businessName
    ? encodeURIComponent(businessName)
    : `${lat},${lng}`;

  const embedUrl = `https://www.google.com/maps?q=${query}&z=${zoom}&output=embed`;

  return (
    <section className="section">
      <div className="container-site">
        <div className="text-center mb-10">
          <h2
            className="text-3xl md:text-4xl font-bold text-gradient mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {title}
          </h2>
          <div className="divider max-w-xs mx-auto" />
        </div>

        <div
          className={cn(
            'relative overflow-hidden rounded-[var(--radius-lg)]',
            'border border-[var(--color-text)]/10',
            'shadow-lg',
          )}
          style={{ height: '400px' }}
        >
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={title}
          />
        </div>
      </div>
    </section>
  );
}
