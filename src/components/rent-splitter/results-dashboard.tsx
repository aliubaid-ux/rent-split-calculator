
"use client";

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { Download, Share2, ThumbsUp, ThumbsDown, Gauge } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { incrementStat } from '@/lib/actions';
import type { CalculationResult, FormData } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

const currencySymbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CAD: '$',
    AUD: '$',
    CHF: 'Fr',
    INR: '₹',
};

interface ResultsDashboardProps {
  results: CalculationResult[];
  totalRent: number;
  formData: FormData;
  initialCounters: { pdfs: number; links: number };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

export function ResultsDashboard({ results, totalRent, formData, initialCounters }: ResultsDashboardProps) {
  const { toast } = useToast();
  const [counters, setCounters] = useState(initialCounters);
  const [feedbackGiven, setFeedbackGiven] = useState<'like' | 'dislike' | null>(null);

  const currencySymbol = currencySymbols[formData.currency] || '$';

  const handleDownloadPdf = () => {
    window.print();
    incrementStat('pdfs');
    incrementStat('helped');
    setCounters(prev => ({...prev, pdfs: prev.pdfs + 1}));
    toast({ title: "PDF Generated", description: "Your browser's print dialog should appear." });
  };

  const handleShare = () => {
    const dataString = btoa(JSON.stringify(formData));
    const url = `${window.location.origin}${window.location.pathname}?data=${dataString}`;
    navigator.clipboard.writeText(url);
    incrementStat('links');
    incrementStat('helped');
    setCounters(prev => ({...prev, links: prev.links + 1}));
    toast({ title: "Link Copied!", description: "A shareable link has been copied to your clipboard." });
  };

  const handleFeedback = (type: 'like' | 'dislike') => {
    if (!feedbackGiven) {
      incrementStat(type === 'like' ? 'likes' : 'dislikes');
      setFeedbackGiven(type);
      toast({ title: "Feedback submitted", description: "Thank you for your feedback!" });
    } else {
      toast({ title: "Feedback already submitted", variant: "default" });
    }
  };

  const chartData = useMemo(() => results.map(r => ({ name: r.roomName, value: r.rent })), [results]);

  const fairnessScore = useMemo(() => {
    const rents = results.map(r => r.rent);
    const mean = totalRent / results.length;
    const stdDev = Math.sqrt(rents.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / rents.length);
    const score = Math.max(0, 100 - (stdDev / mean) * 100);
    return Math.round(score);
  }, [results, totalRent]);

  return (
    <Card id="pdf-summary" className="mt-8 scroll-m-20">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-center">Fair Rent Split Results</CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-8 items-center">
        <div className="w-full h-80">
          <ChartContainer config={{}} className="mx-auto aspect-square h-full">
            <PieChart>
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel indicator="dot" formatter={(value, name) => (
                    <div className="flex flex-col">
                        <span className="font-bold">{name}</span>
                        <span>{`${currencySymbol}${Number(value).toFixed(2)} / month`}</span>
                    </div>
                )} />}
              />
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} labelLine={false}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold">
                            {`${(percent * 100).toFixed(0)}%`}
                        </text>
                    );
                }}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
        <div className="space-y-6">
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Room</TableHead>
                    <TableHead className="text-right">Percentage</TableHead>
                    <TableHead className="text-right">Fair Rent</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {results.map((result, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                          {result.roomName}
                        </TableCell>
                        <TableCell className="text-right">{result.percentage.toFixed(2)}%</TableCell>
                        <TableCell className="text-right font-bold">{currencySymbol}{result.rent.toFixed(2)}</TableCell>
                    </TableRow>
                    ))}
                    <TableRow className="bg-secondary/50 font-bold">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-right">100.00%</TableCell>
                        <TableCell className="text-right">{currencySymbol}{totalRent.toFixed(2)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <div>
              <CardTitle className="text-lg mb-2 flex items-center gap-2"><Gauge size={20} /> Fairness Meter</CardTitle>
              <Progress value={fairnessScore} className="w-full h-4" />
              <p className="text-sm text-muted-foreground mt-1">
                A score of 100 means an equal split. Lower scores indicate greater difference based on room attributes.
              </p>
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 no-print">
        <Button onClick={handleDownloadPdf}><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
        <Button onClick={handleShare} variant="secondary"><Share2 className="mr-2 h-4 w-4" /> Share Result</Button>
        <div className="flex gap-2">
            <Button onClick={() => handleFeedback('like')} variant={feedbackGiven === 'like' ? 'default' : 'outline'} size="icon" disabled={!!feedbackGiven}>
                <ThumbsUp />
            </Button>
            <Button onClick={() => handleFeedback('dislike')} variant={feedbackGiven === 'dislike' ? 'destructive' : 'outline'} size="icon" disabled={!!feedbackGiven}>
                <ThumbsDown />
            </Button>
        </div>
      </CardFooter>
      <CardFooter className="flex-col gap-2 pt-4 no-print">
        <p className="text-sm text-muted-foreground">PDFs Generated: {counters.pdfs.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">Links Shared: {counters.links.toLocaleString()}</p>
      </CardFooter>
    </Card>
  );
}
