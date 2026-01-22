import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JsonLd, { organizationSchema } from "@/components/JsonLd";
import CookieConsent from "@/components/CookieConsent";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={organizationSchema} />
      <Header />
      <main>{children}</main>
      <Footer />
      <CookieConsent />
      <WhatsAppButton />
      <ScrollToTop />
    </>
  );
}
