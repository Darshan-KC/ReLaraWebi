import { useEffect, useRef } from "react";
import echo from "../lib/echo";

export default function useChatRealtime({
  conversationId,
  onMessageReceived,
}) {
  const handlerRef = useRef(onMessageReceived);

  useEffect(() => {
    handlerRef.current = onMessageReceived;
  });

  useEffect(() => {
    if (!conversationId) {
      console.log("[Realtime] no conversationId, skipping subscribe");
      return;
    }

    console.log(
      `[Realtime] subscribing to private channel: conversation.${conversationId}`,
    );

    const channel = echo.private(
      `conversation.${conversationId}`
    );

    channel.subscribed(() => {
      console.log(
        `[Realtime] subscribed OK to conversation.${conversationId}`,
      );
    });

    channel.error((status) => {
      console.error(
        `[Realtime] subscription FAILED for conversation.${conversationId}`,
        status,
      );
    });

    channel.listen(".message.sent", (event) => {
      console.log("[Realtime] message.sent event received:", event);
      handlerRef.current(event.message);
    });

    return () => {
      console.log(
        `[Realtime] leaving channel conversation.${conversationId}`,
      );
      echo.leave(`conversation.${conversationId}`);
    };
  }, [conversationId]);
}