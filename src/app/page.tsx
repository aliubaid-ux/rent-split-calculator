import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { RentSplitter } from '@/components/rent-splitter';
import { getCounters } from '@/lib/actions';

export default async function Home() {
  const initialCounters = await getCounters();
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <RentSplitter initialCounters={initialCounters} />
      </main>
      <AppFooter stats={initialCounters} />
    </div>
  );
}
