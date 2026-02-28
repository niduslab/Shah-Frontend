import { TopBar } from "./_components/layout/top-bar";
import { NavBar } from "./_components/layout/nav-bar";
import { Footer } from "./_components/layout/footer";
import { SubscribeSection } from "./_components/landing/subscribe-section";

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
    </div>
  );
}
