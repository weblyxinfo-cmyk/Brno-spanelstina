"use client";

// Generic type for Schema.org structured data
type JsonLdData = {
  "@context": "https://schema.org";
  "@type": string | string[];
  [key: string]: unknown;
};

type JsonLdProps = {
  data: JsonLdData | JsonLdData[];
};

/**
 * Reusable JSON-LD component for Schema.org structured data
 * Accepts a single schema object or an array of schema objects
 */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Pre-configured schemas for the Spanish language school

export const organizationSchema: JsonLdData = {
  "@context": "https://schema.org",
  "@type": ["EducationalOrganization", "LocalBusiness"],
  "@id": "https://brno-spanelstina.cz/#organization",
  name: "Spanelstina Brno",
  alternateName: "Spanelstina Brno - Kurzy spanelstiny",
  description:
    "Kurzy spanelstiny v Brne s rodilym mluvcim z Chile. Male skupiny max 4 studenti, dva lektori, priprava na DELE.",
  url: "https://brno-spanelstina.cz",
  logo: {
    "@type": "ImageObject",
    url: "https://brno-spanelstina.cz/logo.png",
    width: "200",
    height: "60",
  },
  image: "https://brno-spanelstina.cz/og-image.jpg",
  telephone: "+420 777 123 456",
  email: "info@brno-spanelstina.cz",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Zabrdovicka 2",
    addressLocality: "Brno",
    postalCode: "615 00",
    addressCountry: "CZ",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "49.2002",
    longitude: "16.6078",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "14:00",
    },
  ],
  sameAs: [
    "https://www.facebook.com/spanelstinabrno",
    "https://www.instagram.com/spanelstinabrno",
  ],
  priceRange: "$$",
  currenciesAccepted: "CZK",
  paymentAccepted: "Cash, Credit Card, Bank Transfer",
  areaServed: {
    "@type": "City",
    name: "Brno",
  },
};

export const localBusinessSchema: JsonLdData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://brno-spanelstina.cz/#localbusiness",
  name: "Spanelstina Brno",
  description:
    "Jazykova skola se specializaci na vyuku spanelstiny v Brne. Nabizime individualni i skupinove kurzy s rodilym mluvcim.",
  url: "https://brno-spanelstina.cz",
  telephone: "+420 777 123 456",
  email: "info@brno-spanelstina.cz",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Zabrdovicka 2",
    addressLocality: "Brno",
    postalCode: "615 00",
    addressCountry: "CZ",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "49.2002",
    longitude: "16.6078",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "14:00",
    },
  ],
  priceRange: "$$",
};

// Export the type for external use
export type { JsonLdData };
