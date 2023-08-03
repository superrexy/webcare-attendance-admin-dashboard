export interface ITaskCreate {
  title: string;
  description: string;
  deadline: Date;
  user_id: number;
}

export interface TodoPayload {
  title?: string;
  is_done?: boolean;
}

export interface CommentPayload {
  comment: string;
}
