import React from 'react';

interface CounterStats {
  helped: number;
}

export function AppFooter({ stats }: { stats: CounterStats }) {
  return (
    <footer className="py-8 bg-muted/50 text-center text-muted-foreground no-print mt-12">
      <div className="container mx-auto">
        <div className="mb-4 text-lg">
          Join over{' '}
          <span className="font-bold text-foreground">
            {stats.helped.toLocaleString()}
          </span>{' '}
          roommates who have achieved rent harmony.
        </div>
        <p>
          Designed & Built by{' '}
          <a
            href="https://aliubaid.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            Ali Ubaid
          </a>
        </p>
      </div>
    </footer>
  );
}
