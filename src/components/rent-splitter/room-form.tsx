"use client";

import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, PlusCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';

export function RoomForm() {
  const { control, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rooms',
  });
  const { fields: customFields, append: appendCustom, remove: removeCustom } = useFieldArray({
    control,
    name: `rooms.${fields.length - 1}.customFeatures` // This is tricky, needs to be handled per room
  });
  
  const addRoom = () => {
    append({
      id: uuidv4(),
      name: `Room ${fields.length + 1}`,
      size: 100,
      hasPrivateBathroom: false,
      hasCloset: false,
      hasBalcony: false,
      hasAirConditioning: false,
      noiseLevel: 3,
      naturalLight: 3,
      customFeatures: [],
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Step 1: Enter Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="totalRent"
          render={({ field }) => (
            <FormItem className="max-w-xs">
              <Label htmlFor="totalRent" className="text-lg">Total Monthly Rent ($)</Label>
              <FormControl>
                <Input
                  id="totalRent"
                  type="number"
                  {...field}
                  onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                  className="text-lg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4">
          <Label className="text-lg">Rooms</Label>
          {fields.map((room, index) => (
            <Card key={room.id} className="bg-background/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-headline">
                  <FormField
                    control={control}
                    name={`rooms.${index}.name`}
                    render={({ field }) => (
                        <Input {...field} className="text-xl font-bold border-0 shadow-none -ml-3 w-auto focus-visible:ring-1" />
                    )}
                  />
                </CardTitle>
                {fields.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name={`rooms.${index}.size`}
                    render={({ field }) => (
                      <FormItem>
                        <Label>Size (sq ft)</Label>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Features</Label>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {['hasPrivateBathroom', 'hasCloset', 'hasBalcony', 'hasAirConditioning'].map(feature => (
                      <FormField
                        key={feature}
                        control={control}
                        name={`rooms.${index}.${feature}`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3">
                             <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                             </FormControl>
                            <Label className="font-normal capitalize">{feature.replace('has','').replace(/([A-Z])/g, ' $1').trim()}</Label>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
                <div>
                   <Label className="mb-2 block">Comfort</Label>
                   <div className="grid sm:grid-cols-2 gap-6">
                     <FormField control={control} name={`rooms.${index}.noiseLevel`} render={({field}) => (
                        <FormItem>
                            <Label>Noise Level (1=Quiet, 5=Noisy)</Label>
                            <div className="flex items-center gap-4">
                                <span>{field.value}</span>
                                <Slider defaultValue={[3]} min={1} max={5} step={1} value={[field.value]} onValueChange={(vals) => field.onChange(vals[0])} />
                            </div>
                        </FormItem>
                     )} />
                     <FormField control={control} name={`rooms.${index}.naturalLight`} render={({field}) => (
                        <FormItem>
                            <Label>Natural Light (1=Dark, 5=Bright)</Label>
                             <div className="flex items-center gap-4">
                                <span>{field.value}</span>
                                <Slider defaultValue={[3]} min={1} max={5} step={1} value={[field.value]} onValueChange={(vals) => field.onChange(vals[0])} />
                            </div>
                        </FormItem>
                     )} />
                   </div>
                </div>
                <CustomFeatures arrayName={`rooms.${index}.customFeatures`} />

              </CardContent>
            </Card>
          ))}
        </div>
        
        <Button variant="secondary" onClick={addRoom} type="button">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Another Room
        </Button>
      </CardContent>
    </Card>
  );
}

function CustomFeatures({ arrayName }: { arrayName: string}) {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: arrayName,
  });

  return (
    <div>
      <Label>Custom Features</Label>
      <div className="space-y-2 mt-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-center">
            <FormField control={control} name={`${arrayName}.${index}.name`} render={({field}) => (
                <Input placeholder="e.g., Ocean View" {...field} />
            )} />
            <FormField control={control} name={`${arrayName}.${index}.importance`} render={({field: sliderField}) => (
                <div className="flex-1 min-w-[150px] flex items-center gap-2">
                    <Slider defaultValue={[3]} min={1} max={5} step={1} value={[sliderField.value]} onValueChange={(v) => sliderField.onChange(v[0])} />
                    <span>{sliderField.value}</span>
                </div>
            )} />
            <Button variant="ghost" size="icon" onClick={() => remove(index)} type="button">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={() => append({ id: uuidv4(), name: '', importance: 3 })}
        type="button"
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Add Custom Feature
      </Button>
    </div>
  );
}