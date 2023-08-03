import { AxiosResponse } from "axios";
import axios from "../../config/api.config";
import { AttendanceSettingModel } from "../../models/attendance-setting.model";
import { ResponseAPI } from "../../models/response-api.model";
import { IAttendanceSettingPayload } from "./attendance.interface";
import { AttendanceModel } from "../../models/attendance.model";

export const getAttendanceSettingService = async () => {
  const result: AxiosResponse<ResponseAPI<AttendanceSettingModel>> =
    await axios.get("/api/v1/attendances/setting");

  return result.data.data;
};

export const updateAttendanceSettingService = async (
  payload: IAttendanceSettingPayload
) => {
  const result: AxiosResponse<ResponseAPI<AttendanceSettingModel>> =
    await axios.post("/api/v1/attendances/setting/update", payload);

  return result.data;
};

export const getAllAttendancesService = async () => {
  const result: AxiosResponse<ResponseAPI<AttendanceModel[]>> = await axios.get(
    "/api/v1/attendances/all"
  );

  return result.data.data;
};

export const getAttendancesByUserIDService = async (userId: number) => {
  const result: AxiosResponse<ResponseAPI<AttendanceModel[]>> = await axios.get(
    `/api/v1/attendances/user/all/${userId}`
  );

  return result.data.data;
};
