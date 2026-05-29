import { motion } from "framer-motion";
import { BookmarkPlus } from "lucide-react";

interface HeaderProps {
  extensionEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  onSavePage: () => void;
  queueCount: number;
}

export default function Header({ extensionEnabled, onToggle, onSavePage }: HeaderProps) {
  return (
    <div
      style={{
        padding: "14px 16px 12px",
        borderBottom: "1px solid var(--border-subtle)",
        background: "var(--bg-elevated)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "var(--accent-dim)",
              border: "1px solid var(--accent-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <div>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-primary)",
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              No-Fluff Reader
            </p>
            <motion.p
              key={extensionEnabled ? "on" : "off"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                fontSize: 10.5,
                color: extensionEnabled ? "var(--accent)" : "var(--text-muted)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                fontWeight: 500,
                lineHeight: 1,
                marginTop: 2,
              }}
            >
              {extensionEnabled ? "Active" : "Paused"}
            </motion.p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSavePage}
            title="Save current page to queue"
            data-testid="button-save-page"
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BookmarkPlus size={13} />
          </motion.button>

          <label className="toggle-switch" title={extensionEnabled ? "Pause extension" : "Resume extension"}>
            <input
              type="checkbox"
              checked={extensionEnabled}
              onChange={(e) => onToggle(e.target.checked)}
              data-testid="toggle-extension"
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>
    </div>
  );
}
