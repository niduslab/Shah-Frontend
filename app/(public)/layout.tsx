import { TopBar } from "./_components/layout/top-bar";
import { NavBar } from "./_components/layout/nav-bar";
import { Footer } from "./_components/layout/footer";
import { SubscribeSection } from "./_components/landing/subscribe-section";
import { ScrollToTop } from "./_components/shared/scroll-to-top";
import { WhatsAppButton } from "./_components/shared/whatsapp-button";
import { CookieConsent } from "./_components/shared/cookie-consent";
import { VisitorPopup } from "./_components/shared/visitor-popup";
import { SiteUpgradeNotice } from "./_components/shared/site-upgrade-notice";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <NavBar />
      {children}
      <SubscribeSection />
      
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
      <CookieConsent />
      <VisitorPopup delay={5000} />
      <SiteUpgradeNotice />
    </div>
  );
}
