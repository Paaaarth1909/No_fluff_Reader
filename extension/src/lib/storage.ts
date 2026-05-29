import type { Rule, DailyLimitSettings, StorageData } from "./types";

const DEFAULT_STORAGE: StorageData = {
  rules: [],
  dailyLimit: {
    enabled: false,
    limitMinutes: 30,
    trackedDomains: ["twitter.com", "x.com", "linkedin.com", "reddit.com", "news.ycombinator.com"],
  },
  extensionEnabled: true,
};

export async function getRules(): Promise<Rule[]> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["rules"], (result) => {
      resolve(result.rules ?? DEFAULT_STORAGE.rules);
    });
  });
}

export async function saveRules(rules: Rule[]): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ rules }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

export async function getDailyLimit(): Promise<DailyLimitSettings> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["dailyLimit"], (result) => {
      resolve(result.dailyLimit ?? DEFAULT_STORAGE.dailyLimit);
    });
  });
}

export async function saveDailyLimit(settings: DailyLimitSettings): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ dailyLimit: settings }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

export async function getExtensionEnabled(): Promise<boolean> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["extensionEnabled"], (result) => {
      resolve(result.extensionEnabled ?? DEFAULT_STORAGE.extensionEnabled);
    });
  });
}

export async function setExtensionEnabled(enabled: boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ extensionEnabled: enabled }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

export async function getReadingTime(domain: string, date: string): Promise<number> {
  const key = `rt_${domain}_${date}`;
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => {
      resolve(result[key] ?? 0);
    });
  });
}

export async function addReadingTime(domain: string, minutes: number): Promise<void> {
  const date = new Date().toISOString().split("T")[0];
  const key = `rt_${domain}_${date}`;
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => {
      const current = result[key] ?? 0;
      chrome.storage.local.set({ [key]: current + minutes }, () => resolve());
    });
  });
}
