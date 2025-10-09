
"use client";

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import type { CalculationResult, FormData } from '@/lib/types';
import { calculateRent } from '@/lib/calculator';
import { suggestFairWeights, type SuggestFairWeightsInput } from '@/ai/flows/suggest-fair-weights';
import { explainAISuggestion, type ExplainAISuggestionInput } from '@/ai/flows/explain-ai-suggestion';
import { useToast } from "@/hooks/use-toast";
import { RoomForm } from './room-form';
import { WeightPanel } from './weight-panel';
import { ResultsDashboard } from './results-dashboard';
import { Button } from '@/components/ui/button';
import { ApiKeyDialog } from './api-key-dialog';
import { ArrowDown } from 'lucide-react';

const formSchema = z.object({
  totalRent: z.number().min(1, "Total rent is required"),
  currency: z.string(),
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

const getCookie = (name: string): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
};


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
      totalRent: 0,
      currency: 'USD',
      rooms: [{ 
        id: uuidv4(), 
        name: 'Master Bedroom', 
        size: 150, 
        hasPrivateBathroom: true, 
        hasCloset: true,
        hasBalcony: false,
        hasAirConditioning: true,
        noiseLevel: 2, 
        naturalLight: 5,
        customFeatures: [],
      }, {
        id: uuidv4(),
        name: 'Small Bedroom',
        size: 100,
        hasPrivateBathroom: false,
        hasCloset: true,
        hasBalcony: false,
        hasAirConditioning: true,
        noiseLevel: 3,
        naturalLight: 3,
        customFeatures: [],
      }],
      weights: { size: 40, features: 30, comfort: 30 },
    },
  });

  const { handleSubmit, watch, setValue } = methods;

  const formValues = watch();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const data = params.get('data');
      if (data) {
        try {
          const decodedData = JSON.parse(atob(data));
          if(decodedData.totalRent && decodedData.rooms && decodedData.weights) {
            methods.reset(decodedData);
            toast({ title: "Welcome back!", description: "We've loaded your shared rent data. This link does not save data on our servers." });
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
      
      setTimeout(() => {
        const resultsEl = document.getElementById('results-dashboard');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);

    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Calculation Error", description: "Something went wrong during calculation." });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleAiOptimize = async () => {
    const apiKey = getCookie('gemini_api_key');
    if (!apiKey) {
      setIsApiDialogOpen(true);
      return;
    }

    setIsAiLoading(true);
    setAiExplanation('');
    try {
      const aiInput: SuggestFairWeightsInput = {
        apiKey,
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

      toast({
        title: "AI Weights Applied!",
        description: "The weights have been updated based on AI suggestions.",
      });

      const explanationInput: ExplainAISuggestionInput = {
        apiKey,
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
        })),
        sizeWeight: aiResult.sizeWeight,
        featureWeight: aiResult.featureWeight,
        comfortWeight: aiResult.comfortWeight,
      };

      const explanationResult = await explainAISuggestion(explanationInput);
      setAiExplanation(explanationResult.explanation);


    } catch (error) {
      console.error("AI optimization failed:", error);
      let description = "Could not get suggestions from AI. Please try again later.";
      if (error instanceof Error && error.message.includes('API key')) {
        description = "Your Gemini API key is missing or invalid. Please check your key and try again.";
      }
      toast({
        variant: "destructive",
        title: "AI Error",
        description,
      });
    } finally {
      setIsAiLoading(false);
    }
  };
  
  const onDialogClose = (isOpen: boolean) => {
    setIsApiDialogOpen(isOpen);
    // If the dialog is closing and a key has been successfully set,
    // proceed with the AI optimization.
    if (!isOpen && getCookie('gemini_api_key')) {
      handleAiOptimize();
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleCalculate)} className="space-y-8">
        <ApiKeyDialog 
          isOpen={isApiDialogOpen}
          onOpenChange={onDialogClose}
        />

        <RoomForm />

        <div className="flex justify-center">
            <ArrowDown className="h-8 w-8 text-muted-foreground animate-bounce" />
        </div>

        <WeightPanel onAiOptimize={handleAiOptimize} isAiLoading={isAiLoading} aiExplanation={aiExplanation} />
        
        <div className="text-center sticky bottom-4 z-10">
          <Button 
            type="submit" 
            size="lg" 
            disabled={isCalculating || isAiLoading} 
            className="text-lg px-10 py-7 shadow-2xl rounded-full"
          >
            {isCalculating ? 'Calculating...' : 'Calculate Fair Split'}
          </Button>
        </div>

        {results.length > 0 && (
          <div id="results-dashboard" className="scroll-m-20">
            <ResultsDashboard results={results} totalRent={formValues.totalRent} formData={formValues} initialCounters={initialCounters} />
          </div>
        )}
      </form>
    </FormProvider>
  );
}
