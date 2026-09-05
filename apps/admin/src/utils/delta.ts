import dayjs from 'dayjs';

export interface DeltaOptions<T> {
  /** Keys that should never be included in the delta */
  ignoredKeys?: (keyof T | string)[];
  /** Keys that should always be included in the delta if at least one other field changed */
  alwaysIncludeKeys?: (keyof T | string)[];
  /** Passwords or masked values to ignore if unchanged or dummy (e.g. '********') */
  maskedFields?: (keyof T | string)[];
  /** Custom comparison functions for specific keys */
  customComparators?: Partial<Record<keyof T | string, (origVal: any, currVal: any) => boolean>>;
}

/**
 * Checks whether two values are semantically equal.
 */
function areValuesEqual(origVal: any, currVal: any): boolean {
  // Exact reference / value equality
  if (origVal === currVal) return true;

  // Both are "empty" (null, undefined, or empty string)
  const isOrigEmpty = origVal === null || origVal === undefined || origVal === '';
  const isCurrEmpty = currVal === null || currVal === undefined || currVal === '';
  if (isOrigEmpty && isCurrEmpty) return true;

  // One is empty and the other is not -> changed
  if (isOrigEmpty !== isCurrEmpty) return false;

  // Dayjs / Date comparisons
  if (dayjs.isDayjs(currVal)) {
    if (!origVal) return false;
    const origDayjs = dayjs(origVal);
    return origDayjs.isValid() && currVal.isValid() && origDayjs.valueOf() === currVal.valueOf();
  }
  if (dayjs.isDayjs(origVal)) {
    if (!currVal) return false;
    const currDayjs = dayjs(currVal);
    return origVal.isValid() && currDayjs.isValid() && origVal.valueOf() === currDayjs.valueOf();
  }

  // Array comparison
  if (Array.isArray(origVal) && Array.isArray(currVal)) {
    if (origVal.length !== currVal.length) return false;
    return JSON.stringify(origVal) === JSON.stringify(currVal);
  }

  // Numeric comparison (handles '10' vs 10)
  if (
    (typeof origVal === 'number' || typeof currVal === 'number') &&
    origVal !== '' && currVal !== ''
  ) {
    const numOrig = Number(origVal);
    const numCurr = Number(currVal);
    if (!isNaN(numOrig) && !isNaN(numCurr)) {
      return numOrig === numCurr;
    }
  }

  // Boolean comparison
  if (typeof origVal === 'boolean' || typeof currVal === 'boolean') {
    return Boolean(origVal) === Boolean(currVal);
  }

  return false;
}

/**
 * Computes the delta (only changed fields) between an original record and submitted form values.
 * 
 * @param original The initial record loaded from the backend (or null if creating new)
 * @param current The form values submitted by the user
 * @param options Customization options (ignored keys, masked fields, custom comparators)
 * @returns An object containing ONLY the keys that were modified
 */
export function computeDelta<T extends Record<string, any>>(
  original: T | null | undefined,
  current: Record<string, any>,
  options: DeltaOptions<T> = {}
): Partial<T> {
  const {
    ignoredKeys = ['id', 'createdAt', 'updatedAt'],
    alwaysIncludeKeys = [],
    maskedFields = ['smtpPassword'],
    customComparators = {},
  } = options;

  // If there is no original record (i.e. creating a new record), return all defined fields
  if (!original) {
    const result: any = {};
    for (const [key, value] of Object.entries(current)) {
      if (value !== undefined && !ignoredKeys.includes(key)) {
        // Convert dayjs objects to ISO strings if present
        result[key] = dayjs.isDayjs(value) ? value.toISOString() : value;
      }
    }
    return result;
  }

  const delta: any = {};
  const ignoredSet = new Set(ignoredKeys);
  const maskedSet = new Set(maskedFields);

  for (const [key, currVal] of Object.entries(current)) {
    // Skip ignored keys
    if (ignoredSet.has(key)) continue;

    // Skip masked dummy password fields
    if (maskedSet.has(key)) {
      if (currVal === '********' || currVal === '' || currVal === null || currVal === undefined) {
        continue;
      }
    }

    const origVal = (original as any)[key];

    // Check custom comparator if provided
    const customComp = (customComparators as Record<string, any>)[key];
    if (customComp) {
      if (!customComp(origVal, currVal)) {
        delta[key] = dayjs.isDayjs(currVal) ? currVal.toISOString() : currVal;
      }
      continue;
    }

    // Default semantic equality check
    if (!areValuesEqual(origVal, currVal)) {
      delta[key] = dayjs.isDayjs(currVal) ? currVal.toISOString() : currVal;
    }
  }

  // If changes exist and alwaysIncludeKeys are requested, add them
  if (Object.keys(delta).length > 0 && alwaysIncludeKeys.length > 0) {
    for (const key of alwaysIncludeKeys) {
      if ((original as any)[key] !== undefined) {
        delta[key] = (original as any)[key];
      }
    }
  }

  return delta;
}

/**
 * Checks whether a computed delta has any changes.
 */
export function hasDelta(delta: Record<string, any>): boolean {
  return Object.keys(delta).length > 0;
}
