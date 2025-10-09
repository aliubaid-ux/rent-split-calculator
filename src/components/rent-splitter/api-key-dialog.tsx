
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
  onKeySubmit: () => void;
}

export function ApiKeyDialog({ isOpen, onOpenChange, onKeySubmit }: ApiKeyDialogProps) {
  const [apiKey, setApiKey] = useState('');
  const [hasCheckedCookie, setHasCheckedCookie] = useState(false);
  const { toast } = useToast();

  const getCookie = (name: string): string | undefined => {
    if (typeof document === 'undefined') return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  };

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
    if (isOpen) {
      const existingKey = getCookie('gemini_api_key');
      if (existingKey) {
          onOpenChange(false);
          onKeySubmit();
      } else {
        setHasCheckedCookie(true);
      }
    }
  }, [isOpen, onOpenChange, onKeySubmit]);

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
        description: "Your Gemini API key has been securely saved in your browser's cookies.",
    });
    onOpenChange(false);
    onKeySubmit();
  };
  
  if (!hasCheckedCookie && isOpen) {
      return null;
  }

  return (
    <Dialog open={isOpen && hasCheckedCookie} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter Gemini API Key</DialogTitle>
          <DialogDescription>
            To use the AI optimization feature, you need to provide your own Gemini API key. Your key will be stored securely in your browser's cookies.
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
