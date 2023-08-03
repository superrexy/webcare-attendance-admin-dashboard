export interface TaskModel {
  id: number;
  user_id: number;
  title: string;
  description: string;
  deadline: {
    date: string;
    formatted: string;
  };
  is_finished: boolean;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
  todo_metrics: {
    total?: number;
    completed?: number;
    percentage?: number;
  };
  todos?: {
    id: number;
    task_id: number;
    title: string;
    is_done: boolean;
    created_at: string;
    updated_at: string;
  }[];
  comments?: CommentModel[];
}

export interface CommentModel {
  id: number;
  name: number;
  avatar: number;
  comment: string;
  created_at: string;
}
