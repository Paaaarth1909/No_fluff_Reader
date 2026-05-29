import {
  getRules,
  saveRules,
  getDailyLimit,
  getExtensionEnabled,
  setExtensionEnabled,
  addReadingTime,
  getReadingTime,
} from "@/lib/storage";
import { addToQueue, getQueue, removeFromQueue, clearQueue } from "@/lib/indexeddb";
import type { MessageType } from "@/lib/types";

chrome.runtime.onInstalled.addListener(() => {
  console.log("[NoFluff] Extension installed");
});

chrome.runtime.onMessage.addListener((message: MessageType, _sender, sendResponse) => {
  handleMessage(message).then(sendResponse).catch((err) => {
    console.error("[NoFluff] Message error:", err);
    sendResponse(null);
  });
  return true;
});

async function handleMessage(message: MessageType): Promise<unknown> {
  switch (message.type) {
    case "GET_RULES": {
      const rules = await getRules();
      return { type: "RULES_RESPONSE", rules };
    }

    case "SAVE_RULES": {
      await saveRules(message.rules);
      broadcastToTabs({ type: "RULES_UPDATED", rules: message.rules });
      return { type: "RULES_RESPONSE", rules: message.rules };
    }

    case "ADD_TO_QUEUE": {
      const item = await addToQueue(message.item);
      return { type: "QUEUE_ITEM_ADDED", item };
    }

    case "GET_QUEUE": {
      const items = await getQueue();
      return { type: "QUEUE_RESPONSE", items };
    }

    case "REMOVE_FROM_QUEUE": {
      await removeFromQueue(message.id);
      return { type: "QUEUE_RESPONSE", items: await getQueue() };
    }

    case "CLEAR_QUEUE": {
      await clearQueue();
      return { type: "QUEUE_RESPONSE", items: [] };
    }

    case "TRACK_TIME": {
      await addReadingTime(message.domain, message.minutes);
      return null;
    }

    case "GET_READING_TIME": {
      const date = new Date().toISOString().split("T")[0];
      const minutes = await getReadingTime(message.domain, date);
      return { type: "READING_TIME_RESPONSE", minutes };
    }

    case "GET_EXTENSION_STATE": {
      const enabled = await getExtensionEnabled();
      return { type: "EXTENSION_STATE_RESPONSE", enabled };
    }

    case "TOGGLE_EXTENSION": {
      await setExtensionEnabled(message.enabled);
      broadcastToTabs({ type: "TOGGLE_EXTENSION", enabled: message.enabled });
      return { type: "EXTENSION_STATE_RESPONSE", enabled: message.enabled };
    }

    default:
      return null;
  }
}

async function broadcastToTabs(message: MessageType) {
  const tabs = await chrome.tabs.query({ url: ["http://*/*", "https://*/*"] });
  for (const tab of tabs) {
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, message).catch(() => {});
    }
  }
}

chrome.alarms.create("trackReadingTime", { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "trackReadingTime") {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];
    if (!activeTab?.url) return;

    try {
      const url = new URL(activeTab.url);
      const domain = url.hostname.replace("www.", "");
      const enabled = await getExtensionEnabled();
      if (!enabled) return;

      const dailyLimit = await getDailyLimit();
      if (!dailyLimit.enabled) return;

      if (dailyLimit.trackedDomains.some((d) => domain.includes(d) || d.includes(domain))) {
        await addReadingTime(domain, 1);
        const date = new Date().toISOString().split("T")[0];
        const totalMinutes = await getReadingTime(domain, date);

        if (totalMinutes >= dailyLimit.limitMinutes && activeTab.id) {
          chrome.tabs.sendMessage(activeTab.id, {
            type: "SHOW_LIMIT_OVERLAY",
            minutes: totalMinutes,
            limit: dailyLimit.limitMinutes,
          } as unknown as MessageType).catch(() => {});
        }
      }
    } catch {
    }
  }
});
