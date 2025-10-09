import { Scale } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8 no-print">
      <div className="container mx-auto flex items-center justify-center text-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Scale className="h-8 w-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-headline font-bold">
            Rent Fairness
          </h1>
        </div>
        <p className="hidden sm:block text-lg text-muted-foreground font-headline">
          Split rent fairly, not equally.
        </p>
      </div>
    </header>
  );
}
