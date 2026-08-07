import { useEffect } from "react";
import echo from "../lib/echo";

export default function useChatRealtime({
  conversationId,
  onMessageReceived,
}) {
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

    channel.bind("subscription_succeeded", () => {
      console.log(
        `[Realtime] subscribed OK to conversation.${conversationId}`,
      );
    });

    channel.bind("subscription_error", (status) => {
      console.error(
        `[Realtime] subscription FAILED for conversation.${conversationId}`,
        status,
      );
    });

    channel.listen(".message.sent", (event) => {
      console.log("[Realtime] message.sent event received:", event);
      onMessageReceived(event.message);
    });

    return () => {
      console.log(
        `[Realtime] leaving channel conversation.${conversationId}`,
      );
      echo.leave(`conversation.${conversationId}`);
    };
  }, [conversationId, onMessageReceived]);
}