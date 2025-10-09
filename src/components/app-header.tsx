import { Scale } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm no-print">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <a href="/" className="flex items-center gap-3">
          <Scale className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-headline font-bold text-foreground">
            Rent Fairness
          </h1>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#calculator" className="text-muted-foreground transition-colors hover:text-foreground">Calculator</a>
            <a href="#how-it-works" className="text-muted-foreground transition-colors hover:text-foreground">How It Works</a>
            <a href="#faq" className="text-muted-foreground transition-colors hover:text-foreground">FAQ</a>
        </nav>
      </div>
    </header>
  );
}
