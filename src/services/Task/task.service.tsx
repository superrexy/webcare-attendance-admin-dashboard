import { AxiosResponse } from "axios";
import axios from "../../config/api.config";
import { TaskModel } from "../../models/task.interface";
import { ResponseAPI } from "../../models/response-api.model";
import { CommentPayload, ITaskCreate, TodoPayload } from "./task.interface";

export const getTasks = async () => {
  const response: AxiosResponse<ResponseAPI<TaskModel[]>> = await axios.get(
    "/api/v1/tasks/all"
  );
  return response.data.data;
};

export const getTask = async (id: number) => {
  const response: AxiosResponse<ResponseAPI<TaskModel>> = await axios.get(
    `/api/v1/tasks/${id}`
  );

  return response.data.data;
};

export const createTask = async (task: ITaskCreate) => {
  const response: AxiosResponse<ResponseAPI<TaskModel>> = await axios.post(
    "/api/v1/tasks/create",
    task
  );

  return response.data.data;
};

export const addTodo = async (taskId: number, task: TodoPayload) => {
  const response = await axios.post(`/api/v1/tasks/${taskId}/todo/add`, task);

  return response.data.data;
};

export const updateTodo = async (
  taskId: number,
  todoId: number,
  task: TodoPayload
) => {
  const response = await axios.patch(
    `/api/v1/tasks/${taskId}/todo/${todoId}/update`,
    task
  );

  return response.data.data;
};

export const deleteTodo = async (taskId: number, todoId: number) => {
  const response = await axios.delete(
    `/api/v1/tasks/${taskId}/todo/${todoId}/delete`
  );

  return response;
};

export const updateTask = async (taskId: number, task: ITaskCreate) => {
  const response: AxiosResponse<ResponseAPI<TaskModel>> = await axios.patch(
    `/api/v1/tasks/${taskId}/update`,
    task
  );

  return response.data.data;
};

export const deleteTask = async (taskId: number) => {
  const response: AxiosResponse<ResponseAPI<TaskModel>> = await axios.delete(
    `/api/v1/tasks/${taskId}/delete`
  );

  return response;
};

export const commentAPost = async (taskId: number, payload: CommentPayload) => {
  const response = await axios.post(`/api/v1/tasks/${taskId}/comment`, payload);

  return response.data.data;
};

export const toggleTodo = async (taskId: number, todoId: number) => {
  const response = await axios.get(
    `/api/v1/tasks/${taskId}/todo/${todoId}/toggle`
  );

  return response;
};
