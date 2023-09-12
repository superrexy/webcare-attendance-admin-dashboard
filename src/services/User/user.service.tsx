import { AxiosResponse } from "axios";
import axios from "../../config/api.config";
import { ResponseAPI } from "../../models/response-api.model";
import { User } from "../../models/login.model";
import { IUserPayload } from "./user.interface";
import { formatToFormData } from "../../utils/formatToFormData";

export const getUsers = async ({
  role = null,
  name = null,
}: {
  role?: "admin" | "user";
  name?: string;
}) => {
  const response: AxiosResponse<ResponseAPI<User[]>, any> = await axios.get(
    "/api/v1/users",
    {
      params: {
        role,
        name,
      },
    }
  );

  return response.data.data;
};

export const getUser = async (id: string) => {
  const response: AxiosResponse<ResponseAPI<User>, any> = await axios.get(
    `/api/v1/users/${id}`
  );

  return response.data.data;
};

export const createUser = async (payload: IUserPayload) => {
  const formData = formatToFormData(payload);
  const response: AxiosResponse<ResponseAPI<User>, any> = await axios.post(
    `/api/v1/users/create`,
    formData
  );

  return response.data;
};

export const updateUser = async (id: string, payload: IUserPayload) => {
  const formData = formatToFormData(payload);
  const response: AxiosResponse<ResponseAPI<User>, any> = await axios.patch(
    `/api/v1/users/${id}/update`,
    formData
  );

  return response.data;
};

export const deleteUser = async (id: string) => {
  const response: AxiosResponse<ResponseAPI<User>, any> = await axios.delete(
    `/api/v1/users/${id}/remove`
  );

  return response.data;
};
