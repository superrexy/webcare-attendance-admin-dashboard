import React from "react";
import { CommentModel } from "../../../../models/task.interface";

const ChatMessage = ({ data }: { data: CommentModel }) => {
  return (
    <div className="rounded bg-gray-50 p-3">
      <p className="font-semibold">{data.name}</p>
      <p className="my-1">{data.comment}</p>
      <p className="text-xs text-gray-500">{data.created_at}</p>
    </div>
  );
};

export default ChatMessage;
