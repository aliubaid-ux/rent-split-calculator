
"use client";

import { useFormContext, Controller } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { FormItem } from '@/components/ui/form';

export function WeightPanel() {
  const { control, watch, setValue } = useFormContext();
  const weights = watch('weights');

  const handleSliderChange = (changedField: 'size' | 'features' | 'comfort', value: number) => {
    const currentTotal = weights.size + weights.features + weights.comfort;
    const othersTotal = currentTotal - weights[changedField];
    let newTotal = value + othersTotal;

    const updatedWeights = { ...weights };
    updatedWeights[changedField] = value;

    if (newTotal !== 100) {
      const diff = newTotal - 100;
      const otherFields = (['size', 'features', 'comfort'] as const).filter(f => f !== changedField);

      let field1 = otherFields[0];
      let field2 = otherFields[1];
      
      let val1 = updatedWeights[field1];
      let val2 = updatedWeights[field2];

      if (val1 === 0 && val2 === 0) {
        updatedWeights[field1] = Math.max(0, val1 - Math.ceil(diff / 2));
        updatedWeights[field2] = Math.max(0, val2 - Math.floor(diff / 2));
      } else if (val1 + val2 > 0) {
        const ratio1 = val1 / (val1 + val2);
        const ratio2 = val2 / (val1 + val2);
        updatedWeights[field1] = Math.max(0, val1 - diff * ratio1);
        updatedWeights[field2] = Math.max(0, val2 - diff * ratio2);
      }
    }

    let finalSum = Math.round(updatedWeights.size) + Math.round(updatedWeights.features) + Math.round(updatedWeights.comfort);
    let roundingError = 100 - finalSum;
    
    // Distribute rounding error
    if (roundingError !== 0) {
        const fields = ['size', 'features', 'comfort'];
        for(let i = 0; i < Math.abs(roundingError); i++) {
            // Add or subtract from the largest weight that is not the one being changed
            const fieldToAdjust = fields.filter(f => f !== changedField).sort((a,b) => updatedWeights[b] - updatedWeights[a])[i % 2];
            updatedWeights[fieldToAdjust] += Math.sign(roundingError);
        }
    }
    
    // Ensure no value is negative and the total is 100
    updatedWeights.size = Math.max(0, Math.round(updatedWeights.size));
    updatedWeights.features = Math.max(0, Math.round(updatedWeights.features));
    updatedWeights.comfort = Math.max(0, Math.round(updatedWeights.comfort));

    finalSum = updatedWeights.size + updatedWeights.features + updatedWeights.comfort;
    if (finalSum !== 100) {
        const fieldToAdjust = (['size', 'features', 'comfort'] as const).filter(f => f !== changedField)[0];
        updatedWeights[fieldToAdjust] += (100 - finalSum);
    }
    
    setValue('weights.size', updatedWeights.size);
    setValue('weights.features', updatedWeights.features);
    setValue('weights.comfort', updatedWeights.comfort);
  };
  
  return (
    <Card className="shadow-lg border-2 border-primary/20">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="font-headline text-2xl">Step 2: Adjust Weights</CardTitle>
            <CardDescription className="mt-1">
              Tell us what matters most to your group. The weights must add up to 100%.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        <div className="grid md:grid-cols-3 gap-8 pt-4">
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
