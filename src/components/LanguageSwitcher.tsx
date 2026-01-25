"use client";

import React from 'react';
import { useLanguage } from './language/LanguageContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Languages, Check } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = React.useState(false);

  // This ensures we only render after the language is loaded on the client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (lang: 'en' | 'it') => {
    setLanguage(lang);
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Languages className="h-4 w-4" />
          <span>{language === 'en' ? 'English' : 'Italiano'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
          {language === 'en' && <Check className="mr-2 h-4 w-4" />}
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange('it')}>
          {language === 'it' && <Check className="mr-2 h-4 w-4" />}
          Italiano
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;