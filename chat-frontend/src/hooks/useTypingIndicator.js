import { useEffect, useRef, useState } from "react";
import { getTyping, setTyping, clearTyping } from "../services/typing.service";

const TYPING_NOTIFY_INTERVAL = 1500;

export default function useTypingIndicator(conversationId) {
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const clearTimer = useRef(null);
  const lastSentAt = useRef(0);
  const conversationRef = useRef(conversationId);

  // Keep the ref in sync without touching it during render
  useEffect(() => {
    conversationRef.current = conversationId;
  }, [conversationId]);

  // Poll for typing users while a conversation is open
  useEffect(() => {
    if (!conversationId) return;

    let cancelled = false;

    const poll = async () => {
      try {
        const users = await getTyping(conversationId);

        if (!cancelled) {
          setTypingUsers(Array.isArray(users) ? users : []);
        }
      } catch {
        if (!cancelled) setTypingUsers([]);
      }
    };

    poll();
    const interval = setInterval(poll, 2500);

    return () => {
      cancelled = true;
      clearInterval(interval);
      clearTimeout(clearTimer.current);
      setTypingUsers([]);
      setIsTyping(false);

      clearTyping(conversationId).catch(() => {});
    };
  }, [conversationId]);

  const notifyTyping = () => {
    const current = conversationRef.current;

    if (!current) return;

    const now = Date.now();

    setIsTyping(true);

    if (now - lastSentAt.current >= TYPING_NOTIFY_INTERVAL) {
      lastSentAt.current = now;
      setTyping(current).catch(() => {});
    }

    clearTimeout(clearTimer.current);
    clearTimer.current = setTimeout(() => {
      clearTyping(current).catch(() => {});
      setIsTyping(false);
    }, 3000);
  };

  return { typingUsers, isTyping, notifyTyping };
}
