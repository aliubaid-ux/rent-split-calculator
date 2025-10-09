import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { ListChecks, SlidersHorizontal, BarChart } from 'lucide-react';

const steps = [
    {
        icon: ListChecks,
        title: "1. Enter Details",
        description: "Input your total monthly rent and add each room. Detail its size, features like private bathrooms, and comfort factors like natural light and noise level."
    },
    {
        icon: SlidersHorizontal,
        title: "2. Adjust Weights",
        description: "Decide what's most important to your group. Is it the room's size, the amenities, or the comfort? Adjust the weights to reflect your priorities."
    },
    {
        icon: BarChart,
        title: "3. Get Fair Results",
        description: "Instantly see the calculated fair rent for each room. The results are broken down by percentage and dollar amount, complete with charts for easy visualization."
    }
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-12 md:py-20 lg:py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How It Works</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Achieve rent harmony in just a few simple steps. Our calculator makes a complex process easy and transparent.
                    </p>
                </div>
                <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
                    {steps.map((step, index) => (
                        <Card key={index} className="flex flex-col text-center items-center p-6 border-2 border-transparent hover:border-primary hover:shadow-lg transition-all">
                            <CardHeader className="p-0">
                                <div className="mb-4 flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary">
                                    <step.icon className="h-8 w-8" />
                                </div>
                                <CardTitle className="text-xl">{step.title}</CardTitle>
                            </CardHeader>
                            <CardDescription className="mt-2 text-base">
                                {step.description}
                            </CardDescription>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
