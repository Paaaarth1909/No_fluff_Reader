import type { MessageType } from "./types";

export function sendMessage(message: MessageType): Promise<MessageType> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
}

export function sendToTab(tabId: number, message: MessageType): Promise<MessageType> {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
}

export function onMessage(
  handler: (message: MessageType, sender: chrome.runtime.MessageSender) => void | Promise<unknown>
): void {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const result = handler(message as MessageType, sender);
    if (result instanceof Promise) {
      result.then(sendResponse).catch(() => sendResponse(null));
      return true;
    }
  });
}
