// src/utils/referenceGenerator.js

export function generateReferenceNumber() {
  const year = new Date().getFullYear();
  const prefix = "CVP"; // CivicPulse
  const randomNum = Math.floor(100 + Math.random() * 900); // 3-digit random number
  return `${prefix}-${year}-${randomNum}`;
}

export function formatReferenceNumber(ref) {
  // Just returns the reference number as-is, but can be used for formatting
  return ref;
}