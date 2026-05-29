import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, EyeOff, Highlighter } from "lucide-react";
import type { Rule, RuleType } from "@/lib/types";

interface RulesTabProps {
  rules: Rule[];
  onSave: (rules: Rule[]) => void;
}

export default function RulesTab({ rules, onSave }: RulesTabProps) {
  const [hideInput, setHideInput] = useState("");
  const [highlightInput, setHighlightInput] = useState("");
  const hideInputRef = useRef<HTMLInputElement>(null);
  const highlightInputRef = useRef<HTMLInputElement>(null);

  const hideRules = rules.filter((r) => r.type === "hide");
  const highlightRules = rules.filter((r) => r.type === "highlight");

  function addRule(keyword: string, type: RuleType) {
    const trimmed = keyword.trim().toLowerCase();
    if (!trimmed) return;
    if (rules.some((r) => r.keyword === trimmed && r.type === type)) return;

    const newRule: Rule = {
      id: crypto.randomUUID(),
      keyword: trimmed,
      type,
      enabled: true,
      createdAt: Date.now(),
    };
    onSave([...rules, newRule]);
    if (type === "hide") setHideInput("");
    else setHighlightInput("");
  }

  function removeRule(id: string) {
    onSave(rules.filter((r) => r.id !== id));
  }

  function toggleRule(id: string) {
    onSave(rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  }

  return (
    <div style={{ padding: "16px" }}>
      <RuleSection
        title="Hide"
        icon={<EyeOff size={11} />}
        description="Posts containing these keywords get collapsed"
        rules={hideRules}
        inputValue={hideInput}
        onInputChange={setHideInput}
        onAdd={() => addRule(hideInput, "hide")}
        onRemove={removeRule}
        onToggle={toggleRule}
        inputRef={hideInputRef}
        chipClass="chip-hide"
        placeholder="e.g. AI will replace, 10x productivity"
        accentColor="var(--accent)"
      />

      <div style={{ height: 1, background: "var(--border-subtle)", margin: "14px 0" }} />

      <RuleSection
        title="Highlight"
        icon={<Highlighter size={11} />}
        description="Posts matching these keywords get a visual marker"
        rules={highlightRules}
        inputValue={highlightInput}
        onInputChange={setHighlightInput}
        onAdd={() => addRule(highlightInput, "highlight")}
        onRemove={removeRule}
        onToggle={toggleRule}
        inputRef={highlightInputRef}
        chipClass="chip-highlight"
        placeholder="e.g. research, case study, paper"
        accentColor="var(--highlight)"
      />

      {rules.length === 0 && <EmptyRulesPrompt />}
    </div>
  );
}

interface RuleSectionProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  rules: Rule[];
  inputValue: string;
  onInputChange: (v: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  chipClass: string;
  placeholder: string;
  accentColor: string;
}

function RuleSection({
  title,
  icon,
  description,
  rules,
  inputValue,
  onInputChange,
  onAdd,
  onRemove,
  onToggle,
  inputRef,
  chipClass,
  placeholder,
  accentColor,
}: RuleSectionProps) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <span style={{ color: accentColor, opacity: 0.8 }}>{icon}</span>
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
        {rules.length > 0 && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 500,
              color: accentColor,
              background: `${accentColor}14`,
              padding: "1px 6px",
              borderRadius: 100,
              marginLeft: 2,
            }}
          >
            {rules.length}
          </span>
        )}
      </div>

      <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10 }}>{description}</p>

      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onAdd();
          }}
          placeholder={placeholder}
          data-testid={`input-${title.toLowerCase()}-keyword`}
          style={{ flex: 1 }}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAdd}
          data-testid={`button-add-${title.toLowerCase()}`}
          style={{
            width: 30,
            height: 30,
            borderRadius: 6,
            background: `${accentColor}18`,
            border: `1px solid ${accentColor}30`,
            color: accentColor,
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
        <AnimatePresence>
          {rules.map((rule) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: rule.enabled ? 1 : 0.4, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15, type: "spring", stiffness: 400, damping: 25 }}
              className={`chip ${chipClass}`}
              style={{ opacity: rule.enabled ? 1 : 0.35 }}
              title={rule.enabled ? "Click to disable" : "Click to enable"}
            >
              <span
                onClick={() => onToggle(rule.id)}
                style={{ cursor: "pointer" }}
                data-testid={`chip-${rule.keyword}`}
              >
                {rule.keyword}
              </span>
              <button
                className="chip-remove"
                onClick={() => onRemove(rule.id)}
                data-testid={`button-remove-${rule.keyword}`}
                title="Remove rule"
              >
                <X size={10} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function EmptyRulesPrompt() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      style={{
        marginTop: 20,
        padding: "16px",
        borderRadius: 10,
        background: "rgba(255,255,255,0.02)",
        border: "1px dashed rgba(255,255,255,0.07)",
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
        No rules yet. Add keywords above to start<br />filtering your web experience.
      </p>
    </motion.div>
  );
}
