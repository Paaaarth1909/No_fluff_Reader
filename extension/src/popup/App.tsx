import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./components/Header";
import RulesTab from "./components/RulesTab";
import QueueTab from "./components/QueueTab";
import SettingsTab from "./components/SettingsTab";
import type { Rule, QueueItem, DailyLimitSettings } from "@/lib/types";

type Tab = "rules" | "queue" | "settings";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("rules");
  const [rules, setRules] = useState<Rule[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [extensionEnabled, setExtensionEnabled] = useState(true);
  const [dailyLimit, setDailyLimit] = useState<DailyLimitSettings>({
    enabled: false,
    limitMinutes: 30,
    trackedDomains: ["twitter.com", "x.com", "linkedin.com", "reddit.com", "news.ycombinator.com"],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const rulesRes = await chrome.runtime.sendMessage({ type: "GET_RULES" });
        if (rulesRes?.rules) setRules(rulesRes.rules);

        const queueRes = await chrome.runtime.sendMessage({ type: "GET_QUEUE" });
        if (queueRes?.items) setQueue(queueRes.items);

        const stateRes = await chrome.runtime.sendMessage({ type: "GET_EXTENSION_STATE" });
        if (typeof stateRes?.enabled === "boolean") setExtensionEnabled(stateRes.enabled);
      } catch (e) {
        console.error("[NoFluff Popup]", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSaveRules(newRules: Rule[]) {
    setRules(newRules);
    await chrome.runtime.sendMessage({ type: "SAVE_RULES", rules: newRules });
  }

  async function handleToggleExtension(enabled: boolean) {
    setExtensionEnabled(enabled);
    await chrome.runtime.sendMessage({ type: "TOGGLE_EXTENSION", enabled });
  }

  async function handleRemoveFromQueue(id: string) {
    await chrome.runtime.sendMessage({ type: "REMOVE_FROM_QUEUE", id });
    setQueue((q) => q.filter((item) => item.id !== id));
  }

  async function handleClearQueue() {
    await chrome.runtime.sendMessage({ type: "CLEAR_QUEUE" });
    setQueue([]);
  }

  async function handleSaveCurrentPage() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.url || !tab?.title) return;
      const url = new URL(tab.url);
      const res = await chrome.runtime.sendMessage({
        type: "ADD_TO_QUEUE",
        item: {
          url: tab.url,
          title: tab.title,
          domain: url.hostname.replace("www.", ""),
          favicon: `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=32`,
        },
      });
      if (res?.item) setQueue((q) => [res.item, ...q]);
    } catch (e) {
      console.error("[NoFluff]", e);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[520px]">
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.08)",
            borderTopColor: "var(--accent)",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--bg)" }}>
      <Header
        extensionEnabled={extensionEnabled}
        onToggle={handleToggleExtension}
        onSavePage={handleSaveCurrentPage}
        queueCount={queue.length}
      />

      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--border-subtle)",
          padding: "0 16px",
        }}
      >
        {(["rules", "queue", "settings"] as Tab[]).map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
            data-testid={`tab-${tab}`}
          >
            {tab}
            {tab === "queue" && queue.length > 0 && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "var(--accent-dim)",
                  color: "var(--accent)",
                  fontSize: 9,
                  fontWeight: 600,
                  marginLeft: 5,
                }}
              >
                {queue.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 scrollable" style={{ minHeight: 0 }}>
        <AnimatePresence mode="wait">
          {activeTab === "rules" && (
            <motion.div
              key="rules"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              style={{ height: "100%" }}
            >
              <RulesTab rules={rules} onSave={handleSaveRules} />
            </motion.div>
          )}
          {activeTab === "queue" && (
            <motion.div
              key="queue"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              style={{ height: "100%" }}
            >
              <QueueTab
                items={queue}
                onRemove={handleRemoveFromQueue}
                onClear={handleClearQueue}
              />
            </motion.div>
          )}
          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              style={{ height: "100%" }}
            >
              <SettingsTab
                dailyLimit={dailyLimit}
                onSave={setDailyLimit}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
