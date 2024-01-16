import React, { useRef } from "react";

import UserTable from "./components/UserTable";
import useUsers from "../../../hooks/useUsers";
import Modal from "../../../components/modal/Modal";
import useModal from "../../../hooks/useModal";
import { Controller, useForm } from "react-hook-form";
import InputField from "../../../components/fields/InputField";
import {
  createUser,
  deleteUser,
  updateUser,
} from "../../../services/User/user.service";
import { toast } from "react-toastify";
import { User } from "../../../models/login.model";
import ModalDelete from "../../../components/modal/ModalDelete";
import { StringParam, useQueryParam } from "use-query-params";
import { FiSearch } from "react-icons/fi";
import { debounce } from "lodash";
import SelectField from "../../../components/fields/SelectField";

const Users = () => {
  const { users, fetchUsers } = useUsers();
  const [options, setOptions] = React.useState({
    isUpdate: false,
    selectedUserID: null,
    selectedUser: null,
  });

  const [name, setName] = useQueryParam("name", StringParam);

  const { showModal, setShowModal, toggle } = useModal();

  const { showModal: showModalDelete, setShowModal: setShowModalDelete } =
    useModal();

  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
    setValue,
    control,
  } = useForm();

  const handleUserForm = async (data: any) => {
    data.role = data.role.value;

    try {
      const response: Promise<User> = new Promise(async (resolve, reject) => {
        if (options.isUpdate) {
          await updateUser(options.selectedUserID, data)
            .then((res) => {
              if (res.statusCode === 200) {
                setOptions({
                  ...options,
                  isUpdate: false,
                  selectedUserID: null,
                });
                resolve(res.data);
                reset();
                setShowModal(false);
              }
            })
            .catch((err) => {
              console.error(err);
              reject(err);
            });
        } else {
          await createUser(data)
            .then((res) => {
              if (res.statusCode === 201) {
                setOptions({
                  ...options,
                  isUpdate: false,
                  selectedUserID: null,
                });
                resolve(res.data);
                reset();
                setShowModal(false);
              }
            })
            .catch((err) => {
              console.error(err);
              reject(err);
            });
        }
      });

      await toast.promise(response, {
        error: {
          render({ data }) {
            return `${data}`;
          },
        },
        success: {
          render({ data }) {
            fetchUsers({});

            return `User ${data.name} ${
              options.isUpdate ? "updated" : "created"
            } successfully!`;
          },
        },
        pending: "Loading...",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getValueUser = (id: number) => {
    const user = users.find((user) => user.id === Number(id));
    setOptions({ ...options, selectedUser: user });
  };

  const handleUpdate = (id: number) => {
    setOptions({
      ...options,
      isUpdate: true,
      selectedUserID: id,
    });
    setShowModal(true);

    const user = users.find((user) => user.id === Number(id));

    setValue("name", user?.name);
    setValue("email", user?.email);
    setValue("username", user?.username);
    setValue("role", {
      label: user?.role === "admin" ? "Admin" : "Karyawan",
      value: user?.role,
    });
  };

  const handleDelete = async () => {
    try {
      const response = await deleteUser(options.selectedUser?.id);
      if (response.statusCode === 200) {
        toast.success(
          `User ${options.selectedUser?.name} deleted successfully!`
        );
        fetchUsers({});
        setShowModalDelete(false);
        setOptions({
          ...options,
          selectedUserID: null,
          selectedUser: null,
        });
      }
    } catch (error) {
      toast.error(error.toString());
      console.error(error);
    }
  };

  const fetchRolePromise = async (): Promise<
    { label: string; value: string }[]
  > => {
    return new Promise(async (resolve) => {
      resolve([
        {
          label: "Admin",
          value: "admin",
        },
        {
          label: "Karyawan",
          value: "user",
        },
      ]);
    });
  };

  const handleSearch = useRef(
    debounce(async (name) => {
      await fetchUsers({ name });
    }, 1000)
  ).current;

  React.useEffect(() => {
    if (name) {
      handleSearch(name);
    } else {
      fetchUsers({});
    }

    return () => {
      handleSearch.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleSearch, name]);

  return (
    <div className="mt-3 h-full">
      <div className="h-fit w-full">
        <div className="mb-4 mt-5 flex flex-col justify-between px-4 md:flex-row md:items-center">
          <div className="flex w-full items-center">
            <h4 className="ml-1 text-2xl font-bold text-navy-700 dark:text-white">
              Users
            </h4>
            <div className="mx-3 h-full w-0.5 bg-gray-300">&nbsp;</div>
            <p>{`${users.length} User`}</p>

            <div className="ml-5">
              <div className="flex h-12 w-full items-center overflow-hidden rounded-full border-2 border-gray-300 bg-gray-100 text-navy-700 dark:bg-navy-900 dark:text-white">
                <input
                  name="search"
                  className="w-96 rounded-xl p-3 text-sm outline-none"
                  placeholder="Search by name, email, username"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
                <p className="pl-3 pr-4 text-xl">
                  <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setOptions({
                ...options,
                isUpdate: false,
                selectedUserID: null,
              });
              reset();
              toggle();
            }}
            className="min-w-max rounded-[20px] bg-brand-500 px-5 py-2 text-white transition-colors duration-200 hover:bg-brand-600"
          >
            + Create User
          </button>
        </div>
      </div>

      <div>
        <UserTable
          users={users}
          onEdit={(id) => handleUpdate(id)}
          onDelete={(id) => {
            getValueUser(id);
            setShowModalDelete(true);
          }}
        />
      </div>

      <Modal
        title={`${options.isUpdate ? "Update" : "Create"} User`}
        isOpen={showModal}
        setIsOpen={setShowModal}
      >
        <form onSubmit={handleSubmit(handleUserForm)}>
          <div className="grid grid-cols-2 gap-3">
            <InputField
              errors={errors}
              register={register}
              validation={{
                required: "This field is required",
              }}
              name="name"
              label="Name"
              extra="mb-5"
            />
            <Controller
              name="role"
              control={control}
              rules={{
                required: "User is required",
              }}
              render={({ field, formState: { errors } }) => (
                <SelectField
                  name="role"
                  label="Role"
                  className="mb-2"
                  loadOptions={fetchRolePromise}
                  field={field}
                  errors={errors}
                  validation={{ required: "User is required" }}
                />
              )}
            />
          </div>
          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className="col-span-1">
              <InputField
                errors={errors}
                register={register}
                validation={{
                  required: "This field is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "invalid email address",
                  },
                }}
                name="email"
                label="Email"
                type="email"
              />
            </div>
            <div className="col-span-1">
              <InputField
                errors={errors}
                register={register}
                validation={{
                  required: "This field is required",
                }}
                name="username"
                label="Username"
              />
            </div>
          </div>
          <InputField
            errors={errors}
            register={register}
            name="password"
            label="Password"
            type="password"
            validation={
              options.isUpdate
                ? {
                    required: false,
                    minLength: 8,
                  }
                : {
                    required: "This field is required",
                    minLength: 8,
                  }
            }
            extra="mb-5"
          />

          <div className="flex justify-end">
            <button className="rounded-full bg-brand-500 px-5 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
              {`${options.isUpdate ? "Update" : "Create"} User`}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Remove User */}
      <ModalDelete
        isOpen={showModalDelete}
        setIsOpen={setShowModalDelete}
        title="Remove User"
        detail={options.selectedUser?.name}
        onDelete={() => handleDelete()}
      />
    </div>
  );
};

export default Users;
