import React from 'react';

/**
 * Safe text rendering utility to prevent React Error #31
 * 
 * React cannot render plain objects as children. This utility extracts
 * displayable text from complex objects that may come from the backend.
 * 
 * Common object structures this handles:
 * - { acao, origem, situacao }
 * - { texto, origem_insight }
 * - { conteudo, descricao }
 * - { titulo, mensagem }
 */

/**
 * Extracts safe text from any value, handling objects with nested properties
 */
export function extractSafeText(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    
    // Priority order for extracting text from objects
    const textValue = 
      obj.texto ?? 
      obj.conteudo ?? 
      obj.acao ?? 
      obj.situacao ?? 
      obj.descricao ?? 
      obj.resumo ?? 
      obj.titulo ?? 
      obj.mensagem ??
      obj.regra ??
      obj.comportamento ??
      obj.significado ??
      obj.significa;
    
    if (typeof textValue === 'string' && textValue.trim().length > 0) {
      return textValue;
    }
    
    // Fallback: stringify
    try {
      return JSON.stringify(value);
    } catch {
      return '[objeto]';
    }
  }
  
  return String(value);
}

/**
 * React-safe rendering of any value
 * Returns a React node that can be safely rendered
 */
export function renderSafeText(value: unknown): React.ReactNode {
  if (value == null) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    
    // Extract main text content
    const text =
      obj.texto ??
      obj.conteudo ??
      obj.resumo ??
      obj.titulo ??
      obj.mensagem ??
      obj.acao ??
      obj.situacao ??
      obj.regra ??
      obj.comportamento ??
      obj.significado ??
      obj.significa;

    // Extract origin/source annotation if present
    const origin = obj.origem ?? obj.origem_insight;

    if (typeof text === 'string' && text.trim().length > 0) {
      // If there's an origin annotation, include it
      if (typeof origin === 'string' && origin.trim().length > 0) {
        return React.createElement(
          React.Fragment,
          null,
          text,
          React.createElement('span', { className: 'block text-xs text-muted-foreground mt-1' }, origin)
        );
      }
      return text;
    }

    // Last resort: stringify (keeps UI alive and prevents crash)
    try {
      return React.createElement(
        'span',
        { className: 'text-xs text-muted-foreground font-mono break-words' },
        JSON.stringify(value)
      );
    } catch {
      return React.createElement('span', { className: 'text-xs text-muted-foreground' }, '[objeto]');
    }
  }

  return String(value);
}

/**
 * Safely render an array of items
 */
export function renderSafeArray(items: unknown[]): React.ReactNode[] {
  return items.map((item, index) => {
    const safeContent = renderSafeText(item);
    return React.createElement('span', { key: index }, safeContent);
  });
}
