import React from 'react';

interface CounterStats {
  helped: number;
}

export function AppFooter({ stats }: { stats: CounterStats }) {
  return (
    <footer className="py-6 text-center text-muted-foreground no-print">
      <div className="container mx-auto">
        <div className="mb-4">
          <span className="font-bold text-foreground">
            👥 {stats.helped.toLocaleString()}
          </span>{' '}
          roommates helped so far
        </div>
        <p>
          Created by{' '}
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
