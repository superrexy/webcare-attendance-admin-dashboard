import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import InputField from "../../../components/fields/InputField";
import SelectField from "../../../components/fields/SelectField";
import TextAreaField from "../../../components/fields/TextAreaField";
import Modal from "../../../components/modal/Modal";
import useUsers from "../../../hooks/useUsers";
import { TaskModel } from "../../../models/task.interface";
import { createTask, getTasks } from "../../../services/Task/task.service";
import TaskCard from "./components/TaskCard";

const Task = () => {
  const [showModal, setShowModal] = React.useState(false);
  const [tasks, setTasks] = React.useState<TaskModel[]>([]);
  const { fetchUsersPromise } = useUsers();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateTask = async (data: any) => {
    try {
      const response: Promise<TaskModel> = new Promise(
        async (resolve, reject) => {
          return await createTask({
            title: data.title,
            description: data.description,
            user_id: data.user_id.value,
            deadline: data.deadline,
          })
            .then((res) => {
              resolve(res);
              reset();
              fetchTasks();
            })
            .catch((err) => {
              reject(err.response.data.message);
            })
            .finally(() => {
              setShowModal(false);
            });
        }
      );

      await toast.promise(response, {
        error: {
          render({ data }) {
            return `${data}`;
          },
        },
        success: {
          render({ data }) {
            return `Task ${data.title} Created`;
          },
        },
        pending: "Loading...",
      });
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="mt-3 h-full">
      <div className="h-fit w-full">
        <div className="mb-4 mt-5 flex flex-col justify-between px-4 md:flex-row md:items-center">
          <div className="flex items-center">
            <h4 className="ml-1 text-2xl font-bold text-navy-700 dark:text-white">
              Task
            </h4>
            <div className="mx-3 h-full w-0.5 bg-gray-300">&nbsp;</div>
            <p>{`${tasks.length} Task Running`}</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-[20px] bg-brand-500 px-5 py-2 text-white transition-colors duration-200 hover:bg-brand-600"
          >
            + Create Task
          </button>
        </div>

        <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task, idx) => (
            <TaskCard task={task} key={idx} />
          ))}
        </div>
      </div>

      {/* Modal */}
      <Modal title="Create Task" isOpen={showModal} setIsOpen={setShowModal}>
        <form onSubmit={handleSubmit(handleCreateTask)}>
          <InputField
            id="title"
            name="title"
            label="Title"
            placeholder="Title"
            extra="mb-2"
            register={register}
            errors={errors}
            validation={{ required: "Title is required" }}
          />
          <TextAreaField
            id="description"
            name="description"
            label="Description"
            placeholder="Description"
            extra="mb-2"
            register={register}
            errors={errors}
          />
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-1">
              <Controller
                name="user_id"
                control={control}
                rules={{
                  required: "User is required",
                }}
                render={({ field, formState: { errors } }) => (
                  <SelectField
                    name="user_id"
                    label="User"
                    className="mb-2"
                    loadOptions={fetchUsersPromise}
                    field={field}
                    errors={errors}
                    validation={{ required: "User is required" }}
                  />
                )}
              />
            </div>
            <div className="col-span-1">
              <InputField
                id="deadline"
                name="deadline"
                label="Deadline"
                placeholder="Deadline"
                type="date"
                extra="mb-2"
                register={register}
                errors={errors}
              />
            </div>
          </div>
          <div className="mt-5 flex items-center justify-end">
            <button
              type="submit"
              className="rounded-[20px] bg-brand-400 px-5 py-2 text-white transition-colors duration-200 hover:bg-brand-500"
            >
              Create
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Task;
