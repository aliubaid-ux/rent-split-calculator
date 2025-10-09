import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { RentSplitter } from '@/components/rent-splitter';
import { getCounters } from '@/lib/actions';
import { HeroSection } from '@/components/hero-section';
import { HowItWorks } from '@/components/how-it-works';
import { Faq } from '@/components/faq';

export default async function Home() {
  const initialCounters = await getCounters();
  
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <div className="no-print">
        <AppHeader />
      </div>
      <main className="flex-grow">
        <div className="no-print">
          <HeroSection />
        </div>
        <div id="calculator" className="container mx-auto px-4 py-12 md:py-20 scroll-mt-20">
          <RentSplitter initialCounters={initialCounters} />
        </div>
        <div className="no-print">
          <HowItWorks />
          <Faq />
        </div>
      </main>
      <div className="no-print">
        <AppFooter stats={initialCounters} />
      </div>
    </div>
  );
}
