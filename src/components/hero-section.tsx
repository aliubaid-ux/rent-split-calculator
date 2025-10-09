import { Button } from "./ui/button";

export function HeroSection() {
  return (
    <section className="py-20 md:py-32 lg:py-40 text-center">
      <div className="container px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 leading-tight font-headline">
          Stop Splitting Rent Equally.
          <br />
          <span className="text-primary">Start Splitting it Fairly.</span>
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-10">
          Unequal rooms deserve unequal rent. Our smart calculator considers
          room size, amenities, and comfort to find the perfect, fair price for
          every roommate. Achieve rent harmony in minutes.
        </p>
        <div className="flex justify-center">
          <a href="#calculator">
            <Button size="lg" className="text-lg px-8 py-6">
              Calculate Your Fair Rent
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
