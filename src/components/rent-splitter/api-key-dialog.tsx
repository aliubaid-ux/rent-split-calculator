
"use client";

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ApiKeyDialog({ isOpen, onOpenChange }: ApiKeyDialogProps) {
  const [apiKey, setApiKey] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  
  const setCookie = (name: string, value: string, days: number) => {
    if (typeof document === 'undefined') return;
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/; SameSite=Lax; Secure";
  };
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = () => {
    if (!apiKey.trim()) {
      toast({
        variant: "destructive",
        title: "API Key Required",
        description: "Please enter a valid Gemini API key.",
      });
      return;
    }
    setCookie('gemini_api_key', apiKey, 365);
    toast({
        title: "API Key Saved",
        description: "Your Gemini API key has been securely saved.",
    });
    onOpenChange(false);
  };
  
  if (!isMounted) {
      return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter Gemini API Key</DialogTitle>
          <DialogDescription>
            To use the AI optimization feature, please provide your Google AI Studio API key. Your key is stored in your browser's cookies and never sent to our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api-key" className="text-right">
              API Key
            </Label>
            <Input
              id="api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="col-span-3"
              placeholder="Enter your Gemini API key"
            />
          </div>
          <p className="text-sm text-center text-muted-foreground">
            Don&apos;t have a key? Get one from{' '}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-primary"
            >
              Google AI Studio
            </a>
            .
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit}>
            Save & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
