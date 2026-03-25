/**
 * Anonymous session management
 * Creates and manages temporary anonymous user sessions without requiring sign-up
 */

import { generateAnonymousName } from '../api/auth';

export interface AnonymousSession {
  id: string;
  anonymousName: string;
  deviceFingerprint: string;
  createdAt: string;
  lastActive: string;
}

const SESSION_KEY = 'campus_pulse_anonymous_session';
const SESSION_DURATION_DAYS = 30;

/**
 * Generate a simple device fingerprint based on browser characteristics
 */
function generateDeviceFingerprint(): string {
  const nav = window.navigator;
  const screen = window.screen;
  
  const components = [
    nav.userAgent,
    nav.language,
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
  ];
  
  // Simple hash function
  const str = components.join('|');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return Math.abs(hash).toString(36);
}

/**
 * Generate a unique anonymous user ID
 */
function generateAnonymousId(): string {
  return `anon_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Create a new anonymous session
 */
export function createAnonymousSession(): AnonymousSession {
  const session: AnonymousSession = {
    id: generateAnonymousId(),
    anonymousName: generateAnonymousName(),
    deviceFingerprint: generateDeviceFingerprint(),
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  };
  
  // Save to localStorage
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  
  return session;
}

/**
 * Get the current anonymous session, or create one if it doesn't exist
 */
export function getAnonymousSession(): AnonymousSession {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    
    if (stored) {
      const session: AnonymousSession = JSON.parse(stored);
      
      // Check if session is still valid (not expired)
      const createdAt = new Date(session.createdAt);
      const now = new Date();
      const daysSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSinceCreation < SESSION_DURATION_DAYS) {
        // Update last active time
        session.lastActive = now.toISOString();
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return session;
      }
    }
  } catch (err) {
    console.error('Error reading anonymous session:', err);
  }
  
  // Create new session if none exists or expired
  return createAnonymousSession();
}

/**
 * Check if user has an active anonymous session
 */
export function hasAnonymousSession(): boolean {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    return !!stored;
  } catch {
    return false;
  }
}

/**
 * Clear the anonymous session
 */
export function clearAnonymousSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Update the anonymous name
 */
export function updateAnonymousName(newName: string): void {
  const session = getAnonymousSession();
  session.anonymousName = newName;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}
