import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Globe, Plus, X } from "lucide-react";
import type { DailyLimitSettings } from "@/lib/types";

interface SettingsTabProps {
  dailyLimit: DailyLimitSettings;
  onSave: (settings: DailyLimitSettings) => void;
}

export default function SettingsTab({ dailyLimit, onSave }: SettingsTabProps) {
  const [settings, setSettings] = useState(dailyLimit);
  const [domainInput, setDomainInput] = useState("");

  function update(patch: Partial<DailyLimitSettings>) {
    const next = { ...settings, ...patch };
    setSettings(next);
    onSave(next);
  }

  function addDomain() {
    const trimmed = domainInput.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
    if (!trimmed || settings.trackedDomains.includes(trimmed)) return;
    update({ trackedDomains: [...settings.trackedDomains, trimmed] });
    setDomainInput("");
  }

  function removeDomain(domain: string) {
    update({ trackedDomains: settings.trackedDomains.filter((d) => d !== domain) });
  }

  return (
    <div style={{ padding: "16px" }}>
      <SectionLabel icon={<Clock size={11} />} title="Daily Reading Limit" />

      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 10,
          padding: "12px 14px",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: settings.enabled ? 12 : 0,
          }}
        >
          <div>
            <p style={{ fontSize: 12.5, fontWeight: 500, color: "var(--text-primary)" }}>
              Enable limit reminder
            </p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
              Soft overlay after reaching your limit
            </p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) => update({ enabled: e.target.checked })}
              data-testid="toggle-daily-limit"
            />
            <span className="toggle-slider" />
          </label>
        </div>

        {settings.enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.18 }}
          >
            <div
              style={{
                paddingTop: 12,
                borderTop: "1px solid var(--border-subtle)",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  fontWeight: 500,
                }}
              >
                Limit (minutes per day)
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  type="range"
                  min={5}
                  max={120}
                  step={5}
                  value={settings.limitMinutes}
                  onChange={(e) => update({ limitMinutes: Number(e.target.value) })}
                  data-testid="input-limit-minutes"
                  style={{
                    flex: 1,
                    accentColor: "var(--accent)",
                    height: 3,
                    cursor: "pointer",
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--accent)",
                    minWidth: 40,
                    textAlign: "right",
                  }}
                >
                  {settings.limitMinutes}m
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <SectionLabel icon={<Globe size={11} />} title="Tracked Domains" />

      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 10,
          padding: "12px 14px",
        }}
      >
        <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10 }}>
          Monitor reading time on these domains
        </p>

        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          <input
            type="text"
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addDomain()}
            placeholder="e.g. twitter.com"
            data-testid="input-tracked-domain"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addDomain}
            data-testid="button-add-domain"
            style={{
              width: 30,
              height: 30,
              borderRadius: 6,
              background: "var(--accent-dim)",
              border: "1px solid var(--accent-border)",
              color: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Plus size={14} />
          </motion.button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {settings.trackedDomains.map((domain) => (
            <motion.div
              key={domain}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="chip"
              style={{
                background: "rgba(255,255,255,0.04)",
                borderColor: "var(--border)",
                color: "var(--text-secondary)",
              }}
            >
              {domain}
              <button
                className="chip-remove"
                onClick={() => removeDomain(domain)}
                data-testid={`button-remove-domain-${domain}`}
              >
                <X size={10} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 20, padding: "10px 14px", borderRadius: 8, background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)" }}>
        <p style={{ fontSize: 10.5, color: "var(--text-muted)", lineHeight: 1.7 }}>
          No-Fluff Reader v1.0.0 · All data is stored locally.<br />
          Rules sync via <code style={{ fontFamily: "monospace", fontSize: 10 }}>chrome.storage.sync</code>.
          Reading queue via IndexedDB.
        </p>
      </div>
    </div>
  );
}

function SectionLabel({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
      <span style={{ color: "var(--accent)", opacity: 0.8 }}>{icon}</span>
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
        }}
      >
        {title}
      </span>
    </div>
  );
}
