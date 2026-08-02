import { useEffect, useRef, useState } from "react";
import { editMessage as editMessageApi, deleteMessage as deleteMessageApi } from "../services/message.service";
import { getDetailedReactions, toggleReaction as toggleReactionApi } from "../services/reaction.service";
import { pinMessage as pinMessageApi, unpinMessage as unpinMessageApi } from "../services/pin.service";
import { bookmarkMessage as bookmarkMessageApi, unbookmarkMessage as unbookmarkMessageApi } from "../services/bookmark.service";

export default function useMessageActions(messages, setMessages, currentUser) {
  const [reactions, setReactions] = useState({});
  const [myReactions, setMyReactions] = useState({});
  const [bookmarks, setBookmarks] = useState(() => new Set());

  const userId = currentUser?.id;
  const lastLoadedKey = useRef("");

  // Load reactions for all currently loaded messages (re-runs when the set of
  // message ids changes, e.g. switching conversation or receiving new messages)
  useEffect(() => {
    const messageKey = messages.map((m) => m.id).join(",");

    if (messageKey === lastLoadedKey.current) return;
    lastLoadedKey.current = messageKey;

    const realMessages = messages.filter((m) => Number.isFinite(m.id));

    if (realMessages.length === 0) return;

    let cancelled = false;

    Promise.all(
      realMessages.map((m) =>
        getDetailedReactions(m.id)
          .then((data) => ({ id: m.id, data }))
          .catch(() => ({ id: m.id, data: [] }))
      )
    ).then((results) => {
      if (cancelled) return;

      const nextReactions = {};
      const nextMine = {};

      results.forEach(({ id, data }) => {
        const counts = {};
        const mine = new Set();

        (Array.isArray(data) ? data : []).forEach((group) => {
          counts[group.emoji] = group.count;

          const reactedByMe = (group.users || []).some(
            (u) => u.user_id === userId
          );

          if (reactedByMe) mine.add(group.emoji);
        });

        nextReactions[id] = counts;
        nextMine[id] = mine;
      });

      setReactions((prev) => ({ ...prev, ...nextReactions }));
      setMyReactions((prev) => ({ ...prev, ...nextMine }));
    });

    return () => {
      cancelled = true;
    };
  }, [messages, userId]);

  const getReactionsFor = (messageId) => reactions[messageId] || {};

  const myReactionsFor = (messageId) => [
    ...(myReactions[messageId] || new Set()),
  ];

  const isMyReaction = (messageId, emoji) =>
    myReactions[messageId]?.has(emoji) || false;

  const toggleReaction = async (messageId, emoji) => {
    const hadIt = isMyReaction(messageId, emoji);

    setReactions((prev) => {
      const counts = { ...(prev[messageId] || {}) };
      const next = (counts[emoji] || 0) + (hadIt ? -1 : 1);

      if (next <= 0) delete counts[emoji];
      else counts[emoji] = next;

      return { ...prev, [messageId]: counts };
    });

    setMyReactions((prev) => {
      const mine = new Set(prev[messageId] || []);

      if (hadIt) mine.delete(emoji);
      else mine.add(emoji);

      return { ...prev, [messageId]: mine };
    });

    try {
      await toggleReactionApi(messageId, emoji);
    } catch (error) {
      setReactions((prev) => {
        const counts = { ...(prev[messageId] || {}) };
        const next = (counts[emoji] || 0) + (hadIt ? 1 : -1);

        if (next <= 0) delete counts[emoji];
        else counts[emoji] = next;

        return { ...prev, [messageId]: counts };
      });

      setMyReactions((prev) => {
        const mine = new Set(prev[messageId] || []);

        if (hadIt) mine.add(emoji);
        else mine.delete(emoji);

        return { ...prev, [messageId]: mine };
      });

      throw error;
    }
  };

  const editMessage = async (messageId, newBody) => {
    await editMessageApi(messageId, newBody);

    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? {
              ...m,
              body: newBody,
              edited_at: new Date().toISOString(),
              edit_count: (m.edit_count || 0) + 1,
            }
          : m
      )
    );
  };

  const deleteMessage = async (messageId) => {
    await deleteMessageApi(messageId);

    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  };

  const togglePin = async (messageId) => {
    const message = messages.find((m) => m.id === messageId);
    const isPinned = !!message?.is_pinned;

    if (isPinned) {
      await unpinMessageApi(messageId);
    } else {
      await pinMessageApi(messageId);
    }

    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, is_pinned: !isPinned } : m
      )
    );
  };

  const isBookmarked = (messageId) => bookmarks.has(messageId);

  const toggleBookmark = async (messageId) => {
    const current = bookmarks.has(messageId);

    if (current) {
      await unbookmarkMessageApi(messageId);
    } else {
      await bookmarkMessageApi(messageId);
    }

    setBookmarks((prev) => {
      const next = new Set(prev);

      if (current) next.delete(messageId);
      else next.add(messageId);

      return next;
    });
  };

  return {
    reactions,
    getReactionsFor,
    myReactionsFor,
    isMyReaction,
    toggleReaction,
    editMessage,
    deleteMessage,
    togglePin,
    isBookmarked,
    toggleBookmark,
  };
}
