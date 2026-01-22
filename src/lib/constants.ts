/**
 * Centralized configuration and fallback values for the site.
 * These values are used as defaults when database settings are not available.
 * Update these values when the actual data changes (e.g., new semester dates).
 */

export const SITE_CONFIG = {
  // Semester information - UPDATE EACH SEMESTER
  semester: {
    info: "Zimní semestr 2025",
    start: "15.9.2025",
    displayText: "Zimní semestr od 15.9.2025",
  },

  // Contact information
  contact: {
    email: "sp-info@seznam.cz",
    address: "Zábrdovická 2, 615 00 Brno",
    addressShort: "Zábrdovická 2, Brno",
    mapsUrl: "https://maps.google.com/?q=Zábrdovická+2,+Brno",
    bankAccount: "670100-2207917982/6210",
    bankName: "mBank",
    facebook: "https://www.facebook.com/profile.php?id=100057147803313",
  },

  // Location info
  location: {
    description: "Učebna se nachází 10 min. od centra naproti zastávce Vojenská nemocnice",
    transport: "Přímé spojení tram. č. 2, 3",
    transportStop: "Vojenská nemocnice",
    parking: "Možnost parkování v areálu",
  },

  // Lesson schedule
  schedule: {
    frequency: "2× týdně 90 minut",
  },

  // Facility benefits
  benefits: {
    parking: true,
    freeCoffee: true,
    bookLending: true,
    maxStudents: 4,
    twoTeachers: true,
    freeTrialLesson: true,
  },

  // Email configuration
  email: {
    domain: "brno-spanelstina.cz",
    fromName: "Španělština Brno",
    fromAddress: "noreply@brno-spanelstina.cz",
  },
} as const;

// Helper to get full "from" address for emails
export function getEmailFrom(): string {
  return `${SITE_CONFIG.email.fromName} <${SITE_CONFIG.email.fromAddress}>`;
}
