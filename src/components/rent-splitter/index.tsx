"use client";

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import type { CalculationResult, FormData } from '@/lib/types';
import { calculateRent } from '@/lib/calculator';
import { suggestFairWeights, type SuggestFairWeightsInput } from '@/ai/flows/suggest-fair-weights';
import { useToast } from "@/hooks/use-toast";
import { RoomForm } from './room-form';
import { WeightPanel } from './weight-panel';
import { ResultsDashboard } from './results-dashboard';
import { Button } from '@/components/ui/button';
import { ApiKeyDialog } from './api-key-dialog';

const formSchema = z.object({
  totalRent: z.number().min(1, "Total rent is required"),
  rooms: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, "Room name is required"),
    size: z.number().min(0, "Size must be non-negative"),
    hasPrivateBathroom: z.boolean(),
    hasCloset: z.boolean(),
    hasBalcony: z.boolean(),
    hasAirConditioning: z.boolean(),
    noiseLevel: z.number().min(1).max(5),
    naturalLight: z.number().min(1).max(5),
    customFeatures: z.array(z.object({
      id: z.string(),
      name: z.string().min(1, "Feature name is required"),
      importance: z.number().min(1).max(5),
    })),
  })).min(1, "At least one room is required"),
  weights: z.object({
    size: z.number(),
    features: z.number(),
    comfort: z.number(),
  }),
});

interface RentSplitterProps {
  initialCounters: { helped: number; likes: number; dislikes: number; pdfs: number; links: number; };
}

export function RentSplitter({ initialCounters }: RentSplitterProps) {
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isApiDialogOpen, setIsApiDialogOpen] = useState(false);
  const { toast } = useToast();

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalRent: 1000,
      rooms: [{ 
        id: uuidv4(), 
        name: 'Room 1', 
        size: 120, 
        hasPrivateBathroom: false, 
        hasCloset: true,
        hasBalcony: false,
        hasAirConditioning: true,
        noiseLevel: 3, 
        naturalLight: 4,
        customFeatures: [],
      }],
      weights: { size: 40, features: 30, comfort: 30 },
    },
  });

  const { handleSubmit, watch, setValue } = methods;

  const formValues = watch();

  useEffect(() => {
    // Decode data from URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const data = params.get('data');
      if (data) {
        try {
          const decodedData = JSON.parse(atob(data));
          // A simple validation to ensure we have something that looks like our data
          if(decodedData.totalRent && decodedData.rooms && decodedData.weights) {
            methods.reset(decodedData);
            toast({ title: "Welcome back!", description: "We've loaded your shared rent data." });
          }
        } catch (error) {
          console.error("Failed to parse data from URL", error);
          toast({ variant: "destructive", title: "Oops!", description: "Could not load data from the link." });
        }
      }
    }
  }, [methods, toast]);
  

  const handleCalculate = (data: FormData) => {
    setIsCalculating(true);
    try {
      const rentResults = calculateRent(data.totalRent, data.rooms, data.weights);
      setResults(rentResults);
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Calculation Error", description: "Something went wrong during calculation." });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleAiOptimize = async () => {
    setIsAiLoading(true);
    setAiExplanation('');
    try {
      const aiInput: SuggestFairWeightsInput = {
        rooms: formValues.rooms.map(r => ({
          name: r.name,
          size: r.size,
          hasPrivateBathroom: r.hasPrivateBathroom,
          hasCloset: r.hasCloset,
          hasBalcony: r.hasBalcony,
          airConditioning: r.hasAirConditioning,
          noiseLevel: r.noiseLevel,
          naturalLight: r.naturalLight,
          customFeatures: r.customFeatures.map(cf => ({ name: cf.name, importance: cf.importance })),
        }))
      };

      const aiResult = await suggestFairWeights(aiInput);
      
      setValue('weights.size', aiResult.sizeWeight, { shouldValidate: true, shouldDirty: true });
      setValue('weights.features', aiResult.featureWeight, { shouldValidate: true, shouldDirty: true });
      setValue('weights.comfort', aiResult.comfortWeight, { shouldValidate: true, shouldDirty: true });
      setAiExplanation(aiResult.explanation);

      toast({
        title: "AI Suggestion Applied",
        description: "The weights have been updated based on the AI's recommendation.",
      });

    } catch (error) {
      console.error("AI optimization failed:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not get suggestions from AI. Please try again later.",
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleCalculate)} className="space-y-8">
        <ApiKeyDialog 
          isOpen={isApiDialogOpen}
          onOpenChange={setIsApiDialogOpen}
          onKeySubmit={handleAiOptimize}
        />

        <RoomForm />

        <WeightPanel onAiOptimize={() => setIsApiDialogOpen(true)} isAiLoading={isAiLoading} aiExplanation={aiExplanation} />
        
        <div className="text-center">
          <Button type="submit" size="lg" disabled={isCalculating || isAiLoading}>
            {isCalculating ? 'Calculating...' : 'Calculate Fair Split'}
          </Button>
        </div>

        {results.length > 0 && (
          <ResultsDashboard results={results} totalRent={formValues.totalRent} formData={formValues} initialCounters={initialCounters} />
        )}
      </form>
    </FormProvider>
  );
}
