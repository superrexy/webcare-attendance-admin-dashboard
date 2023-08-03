import React from "react";
import {
  FieldErrors,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

interface TextAreaFieldProps
  extends React.ComponentPropsWithoutRef<"textarea"> {
  extra?: string;
  variant?: string;
  state?: string;
  label?: string;
  name: string;
  register: UseFormRegister<FieldValues>;
  validation?: RegisterOptions;
  errors: FieldErrors<FieldValues>;
}

const TextAreaField = ({
  id,
  label,
  extra,
  placeholder,
  state,
  disabled,
  name,
  onChange,
  register,
  validation,
  errors,
  ...rest
}: TextAreaFieldProps) => {
  return (
    <div className={`${extra}`}>
      <label
        htmlFor={id}
        className={`text-sm font-bold text-navy-700 dark:text-white`}
      >
        {`${label} ${validation?.required ? "*" : ""}`}
      </label>
      <textarea
        onChange={onChange}
        autoComplete="off"
        name={name}
        id={id}
        placeholder={placeholder}
        className={`h-30 mt-2 flex w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none ${
          disabled === true
            ? "!border-none !bg-gray-100 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]"
            : state === "error"
            ? "border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400"
            : state === "success"
            ? "border-green-500 text-green-500 placeholder:text-green-500 dark:!border-green-400 dark:!text-green-400 dark:placeholder:!text-green-400"
            : "border-gray-200 dark:!border-white/10 dark:text-white"
        }`}
        {...register(name, validation)}
        {...rest}
      />
      {errors[name] && (
        <p className="mt-1 text-xs text-red-500">
          {errors[name].message.toString()}
        </p>
      )}
    </div>
  );
};

export default TextAreaField;
