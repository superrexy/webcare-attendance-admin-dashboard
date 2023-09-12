export interface IAttendanceSettingPayload {
  time_sign_in?: string;
  time_sign_out?: string;
  delay_minutes?: number;
}

export interface IAttendanceExportPayload {
  user_id?: number;
  start_date?: string;
  end_date?: string;
}
