type AttemptRecord = {
  count: number;
  firstAttemptAt: number;
  blockedUntil: number;
};

const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const BLOCK_MS = 15 * 60 * 1000;

const globalStore = globalThis as typeof globalThis & {
  __loginRateLimitStore__?: Map<string, AttemptRecord>;
};

const store = globalStore.__loginRateLimitStore__ ?? new Map<string, AttemptRecord>();
globalStore.__loginRateLimitStore__ = store;

export function getLoginRateLimitKey(identity: string, ipAddress: string) {
  return `${identity.toLowerCase()}::${ipAddress}`;
}

export function checkLoginRateLimit(key: string) {
  const now = Date.now();
  const record = store.get(key);

  if (!record) {
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (record.blockedUntil > now) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((record.blockedUntil - now) / 1000),
    };
  }

  if (now - record.firstAttemptAt > WINDOW_MS) {
    store.delete(key);
    return { allowed: true, retryAfterSeconds: 0 };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

export function recordLoginFailure(key: string) {
  const now = Date.now();
  const current = store.get(key);

  if (!current || now - current.firstAttemptAt > WINDOW_MS) {
    store.set(key, {
      count: 1,
      firstAttemptAt: now,
      blockedUntil: 0,
    });
    return { blocked: false, retryAfterSeconds: 0, remainingAttempts: MAX_ATTEMPTS - 1 };
  }

  const nextCount = current.count + 1;

  if (nextCount >= MAX_ATTEMPTS) {
    const blockedUntil = now + BLOCK_MS;
    store.set(key, {
      count: nextCount,
      firstAttemptAt: current.firstAttemptAt,
      blockedUntil,
    });

    return {
      blocked: true,
      retryAfterSeconds: Math.ceil(BLOCK_MS / 1000),
      remainingAttempts: 0,
    };
  }

  store.set(key, {
    ...current,
    count: nextCount,
  });

  return {
    blocked: false,
    retryAfterSeconds: 0,
    remainingAttempts: Math.max(0, MAX_ATTEMPTS - nextCount),
  };
}

export function clearLoginFailures(key: string) {
  store.delete(key);
}
