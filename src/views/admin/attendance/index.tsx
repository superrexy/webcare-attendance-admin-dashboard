import moment from "moment-timezone";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaRegFileExcel } from "react-icons/fa";
import { IoMdOptions } from "react-icons/io";
import { toast } from "react-toastify";
import InputField from "../../../components/fields/InputField";
import SelectField from "../../../components/fields/SelectField";
import Modal from "../../../components/modal/Modal";
import useModal from "../../../hooks/useModal";
import useUsers from "../../../hooks/useUsers";
import { AttendanceModel } from "../../../models/attendance.model";
import {
  IAttendanceExportPayload,
  IAttendanceSettingPayload,
} from "../../../services/Attendance/attendance.interface";
import {
  exportAttendanceService,
  getAllAttendancesService,
  getAttendanceSettingService,
  updateAttendanceSettingService,
} from "../../../services/Attendance/attendance.service";
import AttendanceTable from "./components/AttendanceTable";
import { IoFilter } from "react-icons/io5";

const Attendance = () => {
  const {
    showModal: showAttendanceOptionModal,
    setShowModal: setShowAttendanceOptionModal,
  } = useModal();

  const {
    showModal: showAttendanceExportModal,
    setShowModal: setShowAttendanceExportModal,
  } = useModal();

  const { fetchUsersPromise } = useUsers();

  const {
    register: registerAttendanceOption,
    handleSubmit: handleSubmitAttendanceOption,
    reset: resetAttendanceOption,
    setValue: setValueAttendanceOption,
    formState: { errors: errorsAttendanceOption },
  } = useForm<IAttendanceSettingPayload>();

  const {
    register: registerAttendanceExport,
    handleSubmit: handleSubmitAttendanceExport,
    reset: resetAttendanceExport,
    control,
    formState: { errors: errorsAttendanceExport },
  } = useForm<IAttendanceExportPayload>();

  const [attendances, setAttendances] = React.useState<AttendanceModel[]>([]);

  const fetchAttendances = async () => {
    try {
      const response = await getAllAttendancesService();
      const settings = await getAttendanceSettingService();

      setAttendances(response.data);

      setValueAttendanceOption(
        "time_sign_in",
        moment(settings.time_sign_in).format("HH:mm")
      );
      setValueAttendanceOption(
        "time_sign_out",
        moment(settings.time_sign_out).format("HH:mm")
      );
      setValueAttendanceOption("delay_minutes", settings.delay_minutes);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAttendaceOptions = async (data: any) => {
    try {
      const result = await updateAttendanceSettingService({
        ...data,
        time_sign_in: moment(data.time_sign_in, "HH:mm").toISOString(),
        time_sign_out: moment(data.time_sign_out, "HH:mm").toISOString(),
      });
      if (result.statusCode === 200) {
        setShowAttendanceOptionModal(false);
        resetAttendanceOption();
        fetchAttendances();

        toast.success("Attendance setting updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update attendance setting");
      console.error(error);
    }
  };

  const handleAttendanceExport = async (data: any) => {
    try {
      const result = await exportAttendanceService({
        ...data,
        user_id: data.user_id.value,
      });

      if (result.status === 200) {
        const url = window.URL.createObjectURL(result.data);
        const link = document.createElement("a");

        link.href = url;
        link.download = "attendance.xlsx";

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setShowAttendanceExportModal(false);
        resetAttendanceExport();
      }
    } catch (error) {
      toast.error("Failed to export attendance");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAttendances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-3 h-full">
      <div className="h-fit w-full">
        <div className="mb-4 mt-5 flex flex-col justify-between px-4 md:flex-row md:items-center">
          <div className="flex w-full items-center justify-between">
            <h4 className="ml-1 text-2xl font-bold text-navy-700 dark:text-white">
              Attendance
            </h4>
            <div className="flex items-center gap-5">
              <button
                onClick={() => {
                  setShowAttendanceOptionModal(true);
                }}
                className="inline-flex items-center gap-3 rounded-xl bg-brand-500 px-5 py-3 text-sm font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
              >
                <IoFilter className="h-4 w-4" /> Filter
              </button>
              <button
                onClick={() => {
                  setShowAttendanceOptionModal(true);
                }}
                className="inline-flex items-center gap-3 rounded-xl bg-brand-500 px-5 py-3 text-sm font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
              >
                <IoMdOptions className="h-4 w-4" /> Attendance Options
              </button>
              <button
                onClick={() => {
                  setShowAttendanceExportModal(true);
                }}
                className="inline-flex items-center gap-3 rounded-xl bg-brand-500 px-5 py-3 text-sm font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
              >
                <FaRegFileExcel className="h-4 w-4" /> Export Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <AttendanceTable attendances={attendances} />
      </div>

      <Modal
        isOpen={showAttendanceOptionModal}
        setIsOpen={setShowAttendanceOptionModal}
        title="Attendance Options"
      >
        <form onSubmit={handleSubmitAttendanceOption(handleAttendaceOptions)}>
          <div className="grid grid-cols-2 gap-5">
            <InputField
              register={registerAttendanceExport}
              errors={errorsAttendanceExport}
              validation={{
                required: true,
              }}
              name="start_date"
              label="Tanggal Mulai"
              type="time"
            />
            <InputField
              register={registerAttendanceExport}
              errors={errorsAttendanceExport}
              validation={{
                required: true,
              }}
              name="end_date"
              label="Tanggal Selesai"
              type="time"
            />
            <InputField
              register={registerAttendanceExport}
              errors={errorsAttendanceExport}
              validation={{
                required: true,
              }}
              name="user_id"
              label="Minute To Late"
              type="number"
            />
          </div>
          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-brand-500 px-5 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showAttendanceExportModal}
        setIsOpen={setShowAttendanceExportModal}
        title="Attendance Export XLS"
      >
        <form onSubmit={handleSubmitAttendanceExport(handleAttendanceExport)}>
          <div className="grid grid-cols-2 gap-5">
            <InputField
              register={registerAttendanceExport}
              errors={errorsAttendanceExport}
              name="start_date"
              label="Mulai Tanggal"
              type="date"
              validation={{
                required: true,
              }}
            />
            <InputField
              register={registerAttendanceExport}
              errors={errorsAttendanceExport}
              name="end_date"
              label="Selesai Tanggal"
              type="date"
              validation={{
                required: true,
              }}
            />
            <Controller
              name="user_id"
              control={control}
              render={({ field, formState: { errors } }) => (
                <SelectField
                  name="user_id"
                  label="User"
                  className="mb-2"
                  loadOptions={fetchUsersPromise}
                  field={field}
                  errors={errors}
                />
              )}
            />
          </div>
          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-brand-500 px-5 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
            >
              Export
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Attendance;
