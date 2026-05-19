import { useEffect } from "react";
import echo from "../lib/echo";

export default function useChatRealtime({
  conversationId,
  onMessageReceived,
}) {

  // Listen for new messages in the selected conversation
  useEffect(() => {

    if (!conversationId) return;

    const channel = echo.private(
      `conversation.${conversationId}`
    );

    channel.listen(".message.sent", (event) => {

      onMessageReceived(event.message);

    });

    return () => {

      echo.leave(
        `conversation.${conversationId}`
      );

    };

  }, [conversationId]);
}