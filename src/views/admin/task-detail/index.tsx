import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BiStation, BiTimeFive, BiUser } from "react-icons/bi";
import { BsCalendar2DateFill } from "react-icons/bs";
import { GrAddCircle } from "react-icons/gr";
import { MdDone, MdSend, MdTask } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "../../../components/fields/InputField";
import Modal from "../../../components/modal/Modal";
import { TaskModel } from "../../../models/task.interface";

import { toast } from "react-toastify";
import SelectField from "../../../components/fields/SelectField";
import TextAreaField from "../../../components/fields/TextAreaField";
import useModal from "../../../hooks/useModal";
import useUsers from "../../../hooks/useUsers";
import {
  addTodo,
  commentAPost,
  deleteTask,
  deleteTodo,
  getTask,
  toggleTodo,
  updateTask,
  updateTodo,
} from "../../../services/Task/task.service";
import ChatMessage from "../task/components/ChatMessage";
import TaskMetric from "./components/TaskMetric";
import TodoCard from "./components/TodoCard";
import ModalDelete from "../../../components/modal/ModalDelete";

const TaskDetail = () => {
  const [task, setTask] = useState<TaskModel | null>(null);

  const { showModal: showModalTodo, setShowModal: setShowModalTodo } =
    useModal();

  const { showModal: showModalTask, setShowModal: setShowModalTask } =
    useModal();

  const { showModal: showModalDelete, setShowModal: setShowModalDelete } =
    useModal();

  const { fetchUsersPromise } = useUsers();

  const navigate = useNavigate();

  const [options, setOptions] = useState({
    isUpdateTodo: false,
    todoId: null,
    deleteDetailName: null,
  });

  const {
    register: taskRegister,
    reset: taskReset,
    formState: { errors: taskErrors },
    handleSubmit: taskHandleSubmit,
    setValue: taskSetValue,
    control: taskControl,
  } = useForm();

  const {
    register: todoRegister,
    reset: todoReset,
    formState: { errors: todoErrors },
    handleSubmit: todoHandleSubmit,
    setValue: todoSetValue,
  } = useForm();

  const {
    register: commentRegister,
    reset: commentReset,
    formState: { errors: commentErrors },
    handleSubmit: commentHandleSubmit,
  } = useForm();

  const params = useParams<{ id: string }>();

  const fetchTask = async (taskId: number) => {
    try {
      const task = await getTask(taskId);
      setTask(task);
    } catch (error) {
      navigate("/admin/task");
      toast.error("Task not found");
      console.error(error);
    }
  };

  const handleTodo = async (data: any) => {
    try {
      if (options.isUpdateTodo) {
        const todo = await updateTodo(
          Number(params.id),
          Number(options.todoId),
          data
        );
        if (todo) {
          setShowModalTodo(false);
          todoReset();
          await fetchTask(Number(params.id));
        }
      } else {
        const todo = await addTodo(Number(params.id), data);
        if (todo) {
          setShowModalTodo(false);
          todoReset();
          await fetchTask(Number(params.id));
        }
      }

      toast.success(`Todo ${options.isUpdateTodo ? "updated" : "added"}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      const result = await deleteTodo(Number(params.id), todoId);

      if (result.status === 200) {
        await fetchTask(Number(params.id));

        toast.success("Todo deleted");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleTodoToggle = async (todoId: number) => {
    try {
      const result = await toggleTodo(Number(params.id), todoId);

      if (result.status === 200) {
        await fetchTask(Number(params.id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleTaskValue = () => {
    moment.suppressDeprecationWarnings = true;

    taskSetValue("title", task?.title);
    taskSetValue("description", task?.description);
    taskSetValue("user_id", { label: task?.user?.name, value: task?.user?.id });
    taskSetValue(
      "deadline",
      moment.utc(task?.deadline.date).tz("Asia/Jakarta").format("YYYY-MM-DD")
    );
    setShowModalTask(true);
  };

  const handleTaskUpdate = async (data: any) => {
    try {
      const result: Promise<TaskModel> = new Promise(
        async (resolve, reject) => {
          await updateTask(Number(params.id), {
            ...data,
            user_id: data.user_id?.value || undefined,
          })
            .then((res) => {
              if (res) {
                resolve(res);
              }
            })
            .catch((err) => {
              reject(err);
            });
        }
      );

      await toast.promise(result, {
        error: {
          render({ data }) {
            return `${data}`;
          },
        },
        success: {
          render({ data }) {
            fetchTask(Number(params.id));
            taskReset();
            setShowModalTask(false);
            return `Task ${data.title} Updated`;
          },
        },
        pending: "Loading...",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleTaskToggle = async () => {
    try {
      await handleTaskUpdate({
        ...task,
        deadline: task.deadline.date,
        is_finished: !task?.is_finished,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleTaskDelete = async () => {
    try {
      const result = await deleteTask(Number(params.id));

      if (result.status === 200) {
        navigate("/admin/task", { replace: true });
        toast.success("Task deleted");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createComment = async (data: any) => {
    console.log(data);
    const result = await commentAPost(Number(params.id), data);

    if (result) {
      await fetchTask(Number(params.id));
      commentReset();
      toast.success("Comment added");
    }
  };

  useEffect(() => {
    if (params.id) fetchTask(Number(params.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  return (
    <div className="mt-3 h-full">
      <div className="h-fit w-full">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-8 3xl:grid-cols-5">
          <div className="col-span-2 space-y-5 3xl:col-span-1">
            <div className="rounded-lg bg-brand-500 p-4">
              <h3 className="font-bold text-white">Progress</h3>
              <div className="flex items-center gap-4">
                <div className="relative h-full w-full">
                  <div className="flex h-2 overflow-hidden rounded bg-lightPrimary text-xs">
                    <div
                      style={{
                        width: `${task?.todo_metrics?.percentage || 0}%`,
                      }}
                      className={`animate-pulse bg-orange-500 shadow-none`}
                    ></div>
                  </div>
                </div>
                <span className="font-bold text-white">{`${
                  task?.todo_metrics?.percentage || 0
                }%`}</span>
              </div>
            </div>

            <div className="space-y-4 rounded-lg bg-white p-4">
              <TaskMetric
                title="Total Task"
                icon={MdTask}
                metric={task?.todo_metrics?.total}
              />
              <TaskMetric
                title="Task Completed"
                icon={MdDone}
                metric={task?.todo_metrics?.completed}
              />
              <TaskMetric
                title="Assign To"
                icon={BiUser}
                metric={task?.user?.name}
              />
              <TaskMetric
                title="Deadline"
                icon={BsCalendar2DateFill}
                metric={task?.deadline.formatted}
              />
              <TaskMetric
                title="Status"
                icon={BiStation}
                metric={task?.is_finished ? "Done" : "On Progress"}
              />
              <TaskMetric
                title="Created At"
                icon={BiTimeFive}
                metric={moment(task?.created_at).format("DD MMMM YYYY")}
              />
            </div>

            <div className="space-y-3 rounded-lg bg-white p-4">
              {task?.is_finished ? (
                <button
                  onClick={() => handleTaskToggle()}
                  className="w-full rounded-xl bg-purple-500 px-5 py-3 text-base font-medium text-white transition duration-200 hover:bg-purple-600 active:bg-purple-700 dark:bg-purple-400 dark:text-white dark:hover:bg-purple-300 dark:active:bg-purple-200"
                >
                  Mark as Undone
                </button>
              ) : (
                <button
                  onClick={() => handleTaskToggle()}
                  className="w-full rounded-xl bg-green-500 px-5 py-3 text-base font-medium text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200"
                >
                  Mark as Done
                </button>
              )}
              <hr />
              <div className="grid grid-cols-2 gap-x-3">
                <button
                  onClick={() => handleTaskValue()}
                  className="rounded-xl bg-yellow-500 px-5 py-3 text-sm font-medium text-white transition duration-200 hover:bg-yellow-600 active:bg-yellow-700 dark:bg-yellow-400 dark:text-white dark:hover:bg-yellow-300 dark:active:bg-yellow-200"
                >
                  Edit Task
                </button>
                <button
                  onClick={() => {
                    setShowModalDelete(true);
                  }}
                  className="whitespace-nowrap rounded-xl bg-red-500 px-5 py-3 text-sm font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-700 dark:bg-red-400 dark:text-white dark:hover:bg-red-300 dark:active:bg-red-200"
                >
                  Delete Task
                </button>
              </div>
            </div>
          </div>
          <div className="col-span-6 space-y-5 3xl:col-span-4">
            <div className="rounded-lg bg-white">
              <div className="p-4">
                <h3 className="text-lg font-semibold">Detail Task</h3>
              </div>
              <hr />
              <div className="p-4">
                <h4 className="font-semibold">Title</h4>
                <p className="mb-3">{task?.title}</p>
                <h4 className="font-semibold">Description</h4>
                <p className="text-justify">
                  {task?.description ?? "No Description"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 space-x-5">
              <div className="col-span-2 h-fit rounded-lg bg-white">
                <div className="flex items-center justify-between p-4">
                  <h3 className="text-lg font-semibold">Tasks List</h3>
                  <GrAddCircle
                    className="h-5 w-5 cursor-pointer hover:opacity-50"
                    onClick={() => {
                      setShowModalTodo(true);
                      setOptions({
                        ...options,
                        isUpdateTodo: false,
                        todoId: null,
                      });
                      todoReset();
                    }}
                  />
                </div>
                <hr />
                <div className="space-y-5 p-4">
                  {task?.todos?.length !== 0 ? (
                    task?.todos?.map((todo) => (
                      <TodoCard
                        key={todo.id}
                        title={todo.title}
                        completed={todo.is_done}
                        toggleTodo={() => handleTodoToggle(todo.id)}
                        onEdit={() => {
                          setOptions({
                            ...options,
                            isUpdateTodo: true,
                            todoId: todo.id,
                          });
                          setShowModalTodo(true);
                          todoReset();
                          todoSetValue("title", todo.title);
                        }}
                        onDelete={() => handleDeleteTodo(todo.id)}
                      />
                    ))
                  ) : (
                    <p className="text-center">No Task</p>
                  )}
                </div>
              </div>
              <div className="col-span-1 h-fit rounded-lg bg-white">
                <div className="p-4">
                  <h3 className="text-lg font-semibold">Comments</h3>
                </div>
                <hr />
                <form
                  onSubmit={commentHandleSubmit(createComment)}
                  className="flex items-center gap-3 p-4"
                >
                  <InputField
                    name="comment"
                    type="text"
                    extra="w-full"
                    placeholder="Type your message here..."
                    register={commentRegister}
                    errors={commentErrors}
                    validation={{ required: "Comment is required" }}
                  />
                  <button
                    type="submit"
                    className="flex items-center rounded-xl bg-brand-500 p-3 shadow-sm hover:cursor-pointer"
                  >
                    <MdSend color="white" />
                  </button>
                </form>
                <div className="space-y-5 p-5">
                  {task?.comments?.length !== 0 ? (
                    task?.comments?.map((comment, i) => (
                      <ChatMessage key={i} data={comment} />
                    ))
                  ) : (
                    <p className="text-center">No Comment</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Todo */}

      <Modal
        title={`${options.isUpdateTodo ? "Update" : "Create"} Todo`}
        isOpen={showModalTodo}
        setIsOpen={setShowModalTodo}
      >
        <form onSubmit={todoHandleSubmit(handleTodo)}>
          <InputField
            label="Title"
            name="title"
            register={todoRegister}
            errors={todoErrors}
            validation={{
              required: "Title is required",
            }}
          />

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              className="rounded-[20px] bg-brand-400 px-5 py-2 text-white transition-colors duration-200 hover:bg-brand-500"
            >
              {`${options.isUpdateTodo ? "Update" : "Add"} Todo`}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Task */}
      <Modal
        title="Update Task"
        isOpen={showModalTask}
        setIsOpen={setShowModalTask}
      >
        <form onSubmit={taskHandleSubmit(handleTaskUpdate)}>
          <InputField
            id="title"
            name="title"
            label="Title"
            placeholder="Title"
            extra="mb-2"
            register={taskRegister}
            errors={taskErrors}
            validation={{ required: "Title is required" }}
          />
          <TextAreaField
            id="description"
            name="description"
            label="Description"
            placeholder="Description"
            extra="mb-2"
            register={taskRegister}
            errors={taskErrors}
            validation={{ required: "Description is required" }}
          />
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-1">
              <Controller
                name="user_id"
                control={taskControl}
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
                register={taskRegister}
                errors={taskErrors}
                validation={{ required: "Deadline is required" }}
              />
            </div>
          </div>
          <div className="mt-5 flex items-center justify-end">
            <button
              type="submit"
              className="rounded-[20px] bg-brand-400 px-5 py-2 text-white transition-colors duration-200 hover:bg-brand-500"
            >
              Update
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Remove Alert Task */}
      <ModalDelete
        isOpen={showModalDelete}
        setIsOpen={setShowModalDelete}
        detail={task?.title + " Task"}
        onDelete={handleTaskDelete}
      />
    </div>
  );
};

export default TaskDetail;
