import { User } from "./login.model";

export interface AttendanceModel {
  id: number;
  date: Date;
  time_sign_in: Date;
  time_sign_out: Date;
  latitude_in: number;
  longitude_in: number;
  latitude_out: number;
  longitude_out: number;
  work_time: string;
  file_absence: string | null;
  type: string;
  absence_type: string | null;
  user: User;
}
