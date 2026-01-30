import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import { getBookingDetails } from "@/app/actions/booking";
import { SITE_CONFIG } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rezervace potvrzena | Španělština Brno",
  description: "Vaše rezervace byla úspěšně potvrzena.",
};

interface PageProps {
  searchParams: Promise<{ booking_id?: string }>;
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("cs-CZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("cs-CZ", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function PotvrzeniPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const bookingId = params.booking_id ? parseInt(params.booking_id) : null;

  if (!bookingId) {
    return (
      <div className="bg-[#FBF9F6] min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-[#1F1A17] mb-4">
            Chybějící údaje
          </h1>
          <p className="text-[#6B5D54] mb-6">
            Nepodařilo se najít informace o vaší rezervaci.
          </p>
          <Link
            href="/rezervace"
            className="inline-flex items-center gap-2 bg-[#E07B53] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#C4613D] transition-colors"
          >
            Zpět na rezervace
          </Link>
        </div>
      </div>
    );
  }

  const bookingDetails = await getBookingDetails(bookingId);

  if (!bookingDetails) {
    return (
      <div className="bg-[#FBF9F6] min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-[#1F1A17] mb-4">
            Rezervace nenalezena
          </h1>
          <p className="text-[#6B5D54] mb-6">
            Nepodařilo se najít vaši rezervaci. Kontaktujte nás prosím.
          </p>
          <Link
            href="/kontakt"
            className="inline-flex items-center gap-2 bg-[#E07B53] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#C4613D] transition-colors"
          >
            Kontaktovat nás
          </Link>
        </div>
      </div>
    );
  }

  const { booking, lesson, timeSlot } = bookingDetails;

  return (
    <div className="bg-[#FBF9F6] min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-12 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#d4edda] to-transparent opacity-40 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-[#1F1A17] leading-tight mb-6">
            Rezervace{" "}
            <span className="font-[family-name:var(--font-playfair)] italic font-medium text-green-600">
              potvrzena!
            </span>
          </h1>

          <p className="text-lg text-[#6B5D54]">
            Děkujeme za vaši rezervaci. Potvrzení jsme odeslali na váš email.
          </p>
        </div>
      </section>

      {/* Booking Details */}
      <section className="px-6 pb-20">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#1F1A17] mb-6 text-center">
              Detail rezervace
            </h2>

            {/* Lesson */}
            {lesson && (
              <div className="bg-[#FBF9F6] rounded-xl p-4 mb-6">
                <h3 className="font-bold text-[#1F1A17] text-lg">{lesson.name}</h3>
                {lesson.description && (
                  <p className="text-sm text-[#6B5D54] mt-1">{lesson.description}</p>
                )}
              </div>
            )}

            {/* Details */}
            <div className="space-y-4 mb-6">
              {timeSlot && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FFE5E5] rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-[#E07B53]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#6B5D54]">Datum</p>
                      <p className="font-semibold text-[#1F1A17] capitalize">
                        {formatDate(timeSlot.startTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FFE5E5] rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-[#E07B53]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#6B5D54]">Čas</p>
                      <p className="font-semibold text-[#1F1A17]">
                        {formatTime(timeSlot.startTime)} - {formatTime(timeSlot.endTime)}
                      </p>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FFE5E5] rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#E07B53]" />
                </div>
                <div>
                  <p className="text-xs text-[#6B5D54]">Místo</p>
                  <p className="font-semibold text-[#1F1A17]">
                    {SITE_CONFIG.contact.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="bg-[#FFE5E5] rounded-xl p-4 mb-6">
              <p className="text-sm text-[#C4613D]">
                <strong>Poznámka:</strong> Pokud potřebujete rezervaci změnit nebo
                zrušit, kontaktujte nás na{" "}
                <a
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  className="underline"
                >
                  {SITE_CONFIG.contact.email}
                </a>
              </p>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-[#E07B53] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#C4613D] transition-colors"
              >
                Zpět na hlavní stránku
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
