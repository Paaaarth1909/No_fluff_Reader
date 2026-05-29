import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ExternalLink, BookOpen } from "lucide-react";
import type { QueueItem } from "@/lib/types";

interface QueueTabProps {
  items: QueueItem[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export default function QueueTab({ items, onRemove, onClear }: QueueTabProps) {
  if (items.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
          textAlign: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 4,
          }}
        >
          <BookOpen size={16} color="var(--text-muted)" />
        </div>
        <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>
          Reading queue is empty
        </p>
        <p style={{ fontSize: 11.5, color: "var(--text-muted)", lineHeight: 1.6 }}>
          Click the bookmark icon in the header<br />to save the current page.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px 6px",
        }}
      >
        <span style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.03em" }}>
          {items.length} saved {items.length === 1 ? "article" : "articles"}
        </span>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onClear}
          data-testid="button-clear-queue"
          style={{
            fontSize: 11,
            color: "var(--danger)",
            background: "var(--danger-dim)",
            border: "1px solid rgba(251,113,133,0.15)",
            borderRadius: 5,
            padding: "3px 8px",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Trash2 size={10} />
          Clear all
        </motion.button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "4px 8px 12px" }}>
        <AnimatePresence>
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20, height: 0 }}
              transition={{
                duration: 0.18,
                delay: i * 0.03,
                exit: { duration: 0.15 },
              }}
            >
              <QueueItemCard item={item} onRemove={onRemove} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function QueueItemCard({ item, onRemove }: { item: QueueItem; onRemove: (id: string) => void }) {
  function formatTime(ms: number) {
    const diff = Date.now() - ms;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "just now";
  }

  return (
    <div
      className="queue-item"
      style={{ margin: "2px 0" }}
      onClick={() => chrome.tabs.create({ url: item.url })}
      data-testid={`queue-item-${item.id}`}
    >
      {item.favicon ? (
        <img
          src={item.favicon}
          alt=""
          style={{
            width: 16,
            height: 16,
            borderRadius: 3,
            marginTop: 2,
            flexShrink: 0,
            opacity: 0.7,
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: 3,
            background: "var(--bg-hover)",
            marginTop: 2,
            flexShrink: 0,
          }}
        />
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "var(--text-primary)",
            lineHeight: 1.4,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            marginBottom: 3,
          }}
        >
          {item.title}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          {item.domain && (
            <span style={{ fontSize: 10.5, color: "var(--text-muted)" }}>{item.domain}</span>
          )}
          {item.domain && (
            <span style={{ fontSize: 10, color: "var(--text-muted)", opacity: 0.4 }}>·</span>
          )}
          <span style={{ fontSize: 10.5, color: "var(--text-muted)" }}>
            {formatTime(item.savedAt)}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
        <motion.button
          whileHover={{ scale: 1.1, color: "var(--text-primary)" }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            chrome.tabs.create({ url: item.url });
          }}
          data-testid={`button-open-${item.id}`}
          style={{
            width: 22,
            height: 22,
            borderRadius: 5,
            background: "transparent",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ExternalLink size={10} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1, color: "var(--danger)" }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item.id);
          }}
          data-testid={`button-remove-queue-${item.id}`}
          style={{
            width: 22,
            height: 22,
            borderRadius: 5,
            background: "transparent",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Trash2 size={10} />
        </motion.button>
      </div>
    </div>
  );
}
