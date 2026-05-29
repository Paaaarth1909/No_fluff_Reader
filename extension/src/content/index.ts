import type { Rule, MessageType } from "@/lib/types";

let rules: Rule[] = [];
let extensionEnabled = true;
let observer: MutationObserver | null = null;
const processedNodes = new WeakSet<Element>();
let limitOverlay: HTMLElement | null = null;
let scanTimeout: ReturnType<typeof setTimeout> | null = null;

function init() {
  chrome.runtime.sendMessage({ type: "GET_RULES" } as MessageType, (response) => {
    if (response?.type === "RULES_RESPONSE") {
      rules = response.rules;
    }
    chrome.runtime.sendMessage({ type: "GET_EXTENSION_STATE" } as MessageType, (stateResponse) => {
      if (stateResponse?.type === "EXTENSION_STATE_RESPONSE") {
        extensionEnabled = stateResponse.enabled;
      }
      if (extensionEnabled) {
        scanAndApplyRules();
        startObserver();
      }
    });
  });
}

function getTextContent(element: Element): string {
  return element.textContent?.toLowerCase().trim() ?? "";
}

function applyRuleToElement(element: Element) {
  if (processedNodes.has(element)) return;
  const text = getTextContent(element);
  if (!text || text.length < 10) return;

  processedNodes.add(element);

  const hideRules = rules.filter((r) => r.type === "hide" && r.enabled);
  const highlightRules = rules.filter((r) => r.type === "highlight" && r.enabled);

  let shouldHide = false;
  let matchedHighlight = false;

  for (const rule of hideRules) {
    if (text.includes(rule.keyword.toLowerCase())) {
      shouldHide = true;
      break;
    }
  }

  if (shouldHide) {
    hideElement(element);
    return;
  }

  for (const rule of highlightRules) {
    if (text.includes(rule.keyword.toLowerCase())) {
      matchedHighlight = true;
      highlightElement(element, rule.color ?? "#2dd4bf");
    }
  }

  if (!matchedHighlight) {
    clearElementStyle(element);
  }
}

function hideElement(element: Element) {
  const el = element as HTMLElement;
  const existing = el.querySelector(".nfr-hidden-toggle");
  if (existing) return;

  el.style.transition = "opacity 0.25s ease, transform 0.25s ease";
  el.style.opacity = "0.15";
  el.style.transform = "scale(0.99)";
  el.setAttribute("data-nfr-hidden", "true");

  const toggle = document.createElement("button");
  toggle.className = "nfr-hidden-toggle";
  toggle.textContent = "Hidden — show anyway?";
  toggle.style.cssText = `
    display: block;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    color: rgba(255,255,255,0.35);
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 6px;
    padding: 4px 10px;
    cursor: pointer;
    margin: 4px 0;
    transition: all 0.15s ease;
    text-transform: uppercase;
  `;

  toggle.addEventListener("mouseenter", () => {
    toggle.style.color = "rgba(255,255,255,0.6)";
    toggle.style.background = "rgba(255,255,255,0.08)";
  });
  toggle.addEventListener("mouseleave", () => {
    toggle.style.color = "rgba(255,255,255,0.35)";
    toggle.style.background = "rgba(255,255,255,0.04)";
  });

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    el.style.opacity = "1";
    el.style.transform = "scale(1)";
    el.removeAttribute("data-nfr-hidden");
    toggle.remove();
  });

  el.insertAdjacentElement("afterend", toggle);
}

function highlightElement(element: Element, color: string) {
  const el = element as HTMLElement;
  el.style.borderLeft = `2.5px solid ${color}`;
  el.style.paddingLeft = "10px";
  el.style.borderRadius = "2px";
  el.style.transition = "border-left-color 0.3s ease";
  el.setAttribute("data-nfr-highlighted", "true");
}

function clearElementStyle(element: Element) {
  const el = element as HTMLElement;
  if (el.getAttribute("data-nfr-highlighted")) {
    el.style.borderLeft = "";
    el.style.paddingLeft = "";
    el.style.borderRadius = "";
    el.removeAttribute("data-nfr-highlighted");
  }
}

function getPostCandidates(): Element[] {
  const selectors = [
    '[data-testid="tweet"]',
    '[data-testid="tweetText"]',
    ".feed-shared-update-v2",
    ".update-components-text",
    ".thing",
    ".entry-list-item",
    "article",
    ".post",
    ".card",
    ".item",
    '[role="article"]',
    ".stream-item",
    ".tweet",
  ];

  const candidates: Element[] = [];
  const seen = new Set<Element>();

  for (const selector of selectors) {
    try {
      document.querySelectorAll(selector).forEach((el) => {
        if (!seen.has(el)) {
          seen.add(el);
          candidates.push(el);
        }
      });
    } catch {}
  }

  if (candidates.length === 0) {
    document.querySelectorAll("p, li, h2, h3").forEach((el) => {
      if (!seen.has(el) && (el.textContent?.length ?? 0) > 30) {
        seen.add(el);
        candidates.push(el);
      }
    });
  }

  return candidates;
}

function scanAndApplyRules() {
  if (!extensionEnabled || rules.length === 0) return;
  const candidates = getPostCandidates();
  candidates.forEach(applyRuleToElement);
}

function debouncedScan() {
  if (scanTimeout) clearTimeout(scanTimeout);
  scanTimeout = setTimeout(scanAndApplyRules, 150);
}

function startObserver() {
  if (observer) observer.disconnect();

  observer = new MutationObserver((mutations) => {
    let hasNewNodes = false;
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        hasNewNodes = true;
        break;
      }
    }
    if (hasNewNodes) debouncedScan();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function showLimitOverlay(minutes: number, limit: number) {
  if (limitOverlay) return;

  limitOverlay = document.createElement("div");
  limitOverlay.id = "nfr-limit-overlay";
  limitOverlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    background: rgba(5, 5, 8, 0.92);
    backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
    animation: nfr-fade-in 0.3s ease;
  `;

  const style = document.createElement("style");
  style.textContent = `
    @keyframes nfr-fade-in { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
  `;
  document.head.appendChild(style);

  limitOverlay.innerHTML = `
    <div style="text-align:center;max-width:360px;padding:40px;">
      <div style="width:48px;height:48px;border-radius:12px;background:rgba(45,212,191,0.12);border:1px solid rgba(45,212,191,0.25);display:flex;align-items:center;justify-content:center;margin:0 auto 24px;font-size:22px;">
        &#9201;
      </div>
      <p style="font-size:22px;font-weight:600;color:rgba(255,255,255,0.92);margin:0 0 8px;letter-spacing:-0.02em;">
        Time check
      </p>
      <p style="font-size:14px;color:rgba(255,255,255,0.45);margin:0 0 32px;line-height:1.6;">
        You've spent <strong style="color:rgba(45,212,191,0.9)">${minutes} min</strong> here today — past your ${limit}-minute limit.
      </p>
      <button id="nfr-dismiss" style="
        background:rgba(45,212,191,0.12);
        border:1px solid rgba(45,212,191,0.3);
        color:rgba(45,212,191,0.9);
        font-size:13px;
        font-weight:500;
        padding:10px 24px;
        border-radius:8px;
        cursor:pointer;
        letter-spacing:0.02em;
        transition:all 0.15s ease;
        margin-right:8px;
      ">Stay anyway</button>
      <button id="nfr-close-tab" style="
        background:transparent;
        border:1px solid rgba(255,255,255,0.1);
        color:rgba(255,255,255,0.4);
        font-size:13px;
        font-weight:500;
        padding:10px 24px;
        border-radius:8px;
        cursor:pointer;
        letter-spacing:0.02em;
        transition:all 0.15s ease;
      ">Close tab</button>
    </div>
  `;

  document.body.appendChild(limitOverlay);

  const dismiss = document.getElementById("nfr-dismiss");
  const closeTab = document.getElementById("nfr-close-tab");

  dismiss?.addEventListener("click", () => {
    limitOverlay?.remove();
    limitOverlay = null;
  });

  closeTab?.addEventListener("click", () => {
    window.close();
  });
}

function resetAllStyles() {
  document.querySelectorAll("[data-nfr-hidden]").forEach((el) => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.opacity = "";
    htmlEl.style.transform = "";
    el.removeAttribute("data-nfr-hidden");
  });
  document.querySelectorAll("[data-nfr-highlighted]").forEach((el) => {
    clearElementStyle(el);
  });
  document.querySelectorAll(".nfr-hidden-toggle").forEach((el) => el.remove());
}

chrome.runtime.onMessage.addListener((message: MessageType) => {
  switch (message.type) {
    case "RULES_UPDATED":
      rules = message.rules;
      processedNodes;
      resetAllStyles();
      scanAndApplyRules();
      break;

    case "TOGGLE_EXTENSION":
      extensionEnabled = message.enabled;
      if (!extensionEnabled) {
        observer?.disconnect();
        resetAllStyles();
      } else {
        scanAndApplyRules();
        startObserver();
      }
      break;

    case "SHOW_LIMIT_OVERLAY" as MessageType["type"]:
      showLimitOverlay(
        (message as unknown as { minutes: number; limit: number }).minutes,
        (message as unknown as { minutes: number; limit: number }).limit
      );
      break;
  }
});

chrome.runtime.onMessage.addListener((message: MessageType, _sender, sendResponse) => {
  if (message.type === "ADD_TO_QUEUE") {
    chrome.runtime.sendMessage(message, sendResponse);
    return true;
  }
});

init();
