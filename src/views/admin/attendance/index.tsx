import moment from "moment-timezone";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { IoMdOptions } from "react-icons/io";
import InputField from "../../../components/fields/InputField";
import Modal from "../../../components/modal/Modal";
import useModal from "../../../hooks/useModal";
import { AttendanceModel } from "../../../models/attendance.model";
import { IAttendanceSettingPayload } from "../../../services/Attendance/attendance.interface";
import {
  getAllAttendancesService,
  getAttendanceSettingService,
  updateAttendanceSettingService,
} from "../../../services/Attendance/attendance.service";
import AttendanceTable from "./components/AttendanceTable";
import { toast } from "react-toastify";

const Attendance = () => {
  const { showModal, setShowModal } = useModal();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<IAttendanceSettingPayload>();

  const [attendances, setAttendances] = React.useState<AttendanceModel[]>([]);

  const fetchAttendances = async () => {
    try {
      const response = await getAllAttendancesService();
      const settings = await getAttendanceSettingService();

      setAttendances(response);

      setValue("time_sign_in", moment(settings.time_sign_in).format("HH:mm"));
      setValue("time_sign_out", moment(settings.time_sign_out).format("HH:mm"));
      setValue("delay_minutes", settings.delay_minutes);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAttendaceOptions = async (data: IAttendanceSettingPayload) => {
    try {
      const result = await updateAttendanceSettingService({
        ...data,
        time_sign_in: moment(data.time_sign_in, "HH:mm").toISOString(),
        time_sign_out: moment(data.time_sign_out, "HH:mm").toISOString(),
      });
      if (result.statusCode === 200) {
        setShowModal(false);
        reset();
        fetchAttendances();

        toast.success("Attendance setting updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update attendance setting");
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
            <button
              onClick={() => {
                setShowModal(true);
              }}
              className="inline-flex items-center gap-3 rounded-xl bg-brand-500 px-5 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
            >
              <IoMdOptions /> Attendance Options
            </button>
          </div>
        </div>
      </div>

      <div>
        <AttendanceTable attendances={attendances} />
      </div>

      <Modal
        isOpen={showModal}
        setIsOpen={setShowModal}
        title="Attendance Options"
      >
        <form onSubmit={handleSubmit(handleAttendaceOptions)}>
          <div className="grid grid-cols-2 gap-5">
            <InputField
              register={register}
              errors={errors}
              validation={{
                required: true,
              }}
              name="time_sign_in"
              label="Time Sign In"
              type="time"
            />
            <InputField
              register={register}
              errors={errors}
              validation={{
                required: true,
              }}
              name="time_sign_out"
              label="Time Sign Out"
              type="time"
            />
            <InputField
              register={register}
              errors={errors}
              validation={{
                required: true,
              }}
              name="delay_minutes"
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
    </div>
  );
};

export default Attendance;
