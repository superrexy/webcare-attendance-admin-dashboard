import { AxiosError } from "axios";
import InputField from "components/fields/InputField";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthContext from "../../providers/Auth";
import { loginService } from "../../services/Auth/auth.service";

export default function SignIn() {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = async (data: any) => {
    try {
      const promiseLogin = new Promise(async (resolve, reject) => {
        return await loginService(data)
          .then((res) => {
            setToken({
              access_token: res.data.data.token.access_token,
              refresh_token: res.data.data.token.refresh_token,
            });

            resolve(res.data.data.user.name);
          })
          .catch((err: AxiosError<{ message: string }, {}>) =>
            reject(err.response.data.message)
          );
      });

      await toast.promise(promiseLogin, {
        error: {
          render({ data }) {
            return `${data}`;
          },
        },
        success: {
          render({ data }) {
            navigate("/admin");
            return `Selamat Datang ${data}`;
          },
        },
        pending: "Loading...",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className="flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start"
    >
      {/* Sign in section */}
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Sign In
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your username or email and password to sign in!
        </p>
        {/* Email */}
        <InputField
          variant="auth"
          extra="mb-5"
          label="Username or Email"
          placeholder="Enter your username"
          id="username"
          type="text"
          name="username"
          register={register}
          errors={errors}
          validation={{
            required: "Email or Username is required",
          }}
        />

        {/* Password */}
        <InputField
          variant="auth"
          extra="mb-5"
          label="Password"
          placeholder="Min. 8 characters"
          id="password"
          type="password"
          name="password"
          register={register}
          errors={errors}
          validation={{
            required: "Password is required",
          }}
        />
        {/* Checkbox */}
        <div className="mb-4 flex items-center justify-end px-2">
          <a
            className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
            href=" "
          >
            Forgot Password?
          </a>
        </div>
        <button className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
          Sign In
        </button>
      </div>
    </form>
  );
}
