export type RuleType = "hide" | "highlight";

export interface Rule {
  id: string;
  keyword: string;
  type: RuleType;
  enabled: boolean;
  createdAt: number;
  color?: string;
}

export interface QueueItem {
  id: string;
  url: string;
  title: string;
  savedAt: number;
  favicon?: string;
  domain?: string;
  excerpt?: string;
}

export interface ReadingStats {
  domain: string;
  minutes: number;
  date: string;
}

export interface DailyLimitSettings {
  enabled: boolean;
  limitMinutes: number;
  trackedDomains: string[];
}

export interface StorageData {
  rules: Rule[];
  dailyLimit: DailyLimitSettings;
  extensionEnabled: boolean;
}

export type MessageType =
  | { type: "GET_RULES" }
  | { type: "RULES_RESPONSE"; rules: Rule[] }
  | { type: "SAVE_RULES"; rules: Rule[] }
  | { type: "APPLY_RULES"; rules: Rule[] }
  | { type: "ADD_TO_QUEUE"; item: Omit<QueueItem, "id" | "savedAt"> }
  | { type: "QUEUE_ITEM_ADDED"; item: QueueItem }
  | { type: "GET_QUEUE" }
  | { type: "QUEUE_RESPONSE"; items: QueueItem[] }
  | { type: "REMOVE_FROM_QUEUE"; id: string }
  | { type: "CLEAR_QUEUE" }
  | { type: "GET_READING_TIME"; domain: string }
  | { type: "READING_TIME_RESPONSE"; minutes: number }
  | { type: "TRACK_TIME"; domain: string; minutes: number }
  | { type: "GET_EXTENSION_STATE" }
  | { type: "EXTENSION_STATE_RESPONSE"; enabled: boolean }
  | { type: "TOGGLE_EXTENSION"; enabled: boolean }
  | { type: "RULES_UPDATED"; rules: Rule[] };

export const HIGHLIGHT_COLORS: Record<string, string> = {
  teal: "#2dd4bf",
  sage: "#84cc16",
  indigo: "#818cf8",
  amber: "#fbbf24",
  rose: "#fb7185",
};
