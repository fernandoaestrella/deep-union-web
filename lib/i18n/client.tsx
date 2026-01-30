'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import type { Dictionary } from './types';

const I18nContext = createContext<Dictionary | null>(null);

export function I18nProvider({ dictionary, children }: { dictionary: Dictionary; children: ReactNode }) {
  return <I18nContext.Provider value={dictionary}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const dictionary = useContext(I18nContext);
  if (!dictionary) {
    throw new Error('useTranslation must be used within I18nProvider');
  }

  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let value: any = dictionary;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (typeof value !== 'string') {
      return key;
    }

    // Replace parameters in the format {paramName}
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramName) => {
        return params[paramName] || match;
      });
    }
    
    return value;
  };

  return { t };
}

