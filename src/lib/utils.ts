import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Snippet } from 'svelte';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Utility type that adds an optional ref property for element binding
 */
export type WithElementRef<T, E extends HTMLElement = HTMLElement> = T & {
  ref?: E | null;
  children?: Snippet;
};

/**
 * Utility type that removes children and child properties from a type
 */
export type WithoutChildrenOrChild<T> = Omit<T, 'children' | 'child'>;

/**
 * Utility type that removes only the child property from a type
 */
export type WithoutChild<T> = Omit<T, 'child'>;
