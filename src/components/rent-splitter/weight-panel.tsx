"use client";

import { useFormContext, Controller } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Sparkles, Bot } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FormItem } from '@/components/ui/form';

interface WeightPanelProps {
  onAiOptimize: () => void;
  isAiLoading: boolean;
  aiExplanation: string;
}

export function WeightPanel({ onAiOptimize, isAiLoading, aiExplanation }: WeightPanelProps) {
  const { control, watch, setValue } = useFormContext();
  const weights = watch('weights');

  const handleSliderChange = (changedField: 'size' | 'features' | 'comfort', value: number) => {
    const currentTotal = weights.size + weights.features + weights.comfort;
    const othersTotal = currentTotal - weights[changedField];
    const newTotal = value + othersTotal;

    let { size, features, comfort } = weights;
    const updatedWeights = { size, features, comfort };
    updatedWeights[changedField] = value;

    const otherFields = (['size', 'features', 'comfort'] as const).filter(f => f !== changedField);

    if (newTotal !== 100) {
        const diff = newTotal - 100;

        let field1 = otherFields[0];
        let field2 = otherFields[1];
        
        let val1 = updatedWeights[field1];
        let val2 = updatedWeights[field2];

        if (val1 + val2 > 0) {
            let new_val1 = val1 - (val1 / (val1 + val2)) * diff;
            let new_val2 = val2 - (val2 / (val1 + val2)) * diff;
            
            if(new_val1 < 0) {
                new_val2 += new_val1;
                new_val1 = 0;
            }
            if(new_val2 < 0) {
                new_val1 += new_val2;
                new_val2 = 0;
            }

            updatedWeights[field1] = Math.round(new_val1);
            updatedWeights[field2] = 100 - updatedWeights[changedField] - updatedWeights[field1];
        } else {
            // Both are 0, distribute equally
            updatedWeights[field1] = Math.round(-diff / 2);
            updatedWeights[field2] = -diff - Math.round(-diff / 2);
        }
    }
    
    // Final check to ensure sum is 100
    const sum = Math.round(updatedWeights.size) + Math.round(updatedWeights.features) + Math.round(updatedWeights.comfort);
    if (sum !== 100) {
        const lastField = otherFields[1];
        updatedWeights[lastField] += (100 - sum);
    }
    
    setValue('weights.size', updatedWeights.size);
    setValue('weights.features', updatedWeights.features);
    setValue('weights.comfort', updatedWeights.comfort);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="font-headline text-2xl">Step 2: Adjust Weights</CardTitle>
            <Button variant="outline" onClick={onAiOptimize} disabled={isAiLoading}>
                {isAiLoading ? 'Optimizing...' : <><Sparkles className="mr-2 h-4 w-4" /> Auto Optimize with AI</>}
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {aiExplanation && (
          <Alert>
            <Bot className="h-4 w-4" />
            <AlertTitle>AI Suggestion</AlertTitle>
            <AlertDescription>
              {aiExplanation}
            </AlertDescription>
          </Alert>
        )}
        <div className="grid md:grid-cols-3 gap-8">
            <Controller
                name="weights.size"
                control={control}
                render={({ field }) => (
                    <FormItem>
                        <Label className="text-lg">Size Weight ({field.value}%)</Label>
                        <Slider value={[field.value]} onValueChange={(v) => handleSliderChange('size', v[0])} max={100} step={1} />
                    </FormItem>
                )}
            />
            <Controller
                name="weights.features"
                control={control}
                render={({ field }) => (
                    <FormItem>
                        <Label className="text-lg">Features Weight ({field.value}%)</Label>
                        <Slider value={[field.value]} onValueChange={(v) => handleSliderChange('features', v[0])} max={100} step={1} />
                    </FormItem>
                )}
            />
            <Controller
                name="weights.comfort"
                control={control}
                render={({ field }) => (
                    <FormItem>
                        <Label className="text-lg">Comfort Weight ({field.value}%)</Label>
                        <Slider value={[field.value]} onValueChange={(v) => handleSliderChange('comfort', v[0])} max={100} step={1} />
                    </FormItem>
                )}
            />
        </div>
      </CardContent>
    </Card>
  );
}
