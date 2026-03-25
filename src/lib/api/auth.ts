/**
 * Email validation utilities
 */

export function isValidUniversityEmail(email: string): boolean {
  const allowedDomain =
    process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN || "@fshnstudent.info";

  // Support multiple domains
  const allowedDomains = process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAINS
    ? process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAINS.split(",").map((d) =>
        d.trim()
      )
    : [allowedDomain];

  return allowedDomains.some((domain) =>
    email.toLowerCase().endsWith(domain.toLowerCase())
  );
}

export function getUniversityFromEmail(email: string): string {
  const domain = email.split("@")[1];
  if (!domain) return "Unknown University";

  // Extract university name from domain
  // e.g., stanford.edu -> Stanford
  const name = domain.split(".")[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Generate random anonymous name
 */
export function generateAnonymousName(): string {
  const adjectives = [
    "Sleepy",
    "Curious",
    "Wise",
    "Happy",
    "Tired",
    "Honest",
    "Brave",
    "Clever",
    "Gentle",
    "Bold",
    "Quiet",
    "Loud",
    "Silly",
    "Serious",
    "Chill",
    "Hyper",
    "Calm",
    "Wild",
    "Tame",
    "Free",
  ];

  const animals = [
    "Owl",
    "Cat",
    "Fox",
    "Penguin",
    "Raccoon",
    "Badger",
    "Otter",
    "Wolf",
    "Bear",
    "Eagle",
    "Panda",
    "Koala",
    "Sloth",
    "Dolphin",
    "Tiger",
    "Lion",
    "Hawk",
    "Raven",
    "Deer",
    "Moose",
  ];

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];

  return `${adjective} ${animal}`;
}
