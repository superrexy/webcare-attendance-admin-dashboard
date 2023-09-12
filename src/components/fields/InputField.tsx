// Custom components
import { ErrorMessage } from "@hookform/error-message";
import React from "react";
import {
  FieldErrors,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

interface InputFieldProps<T> extends React.ComponentPropsWithoutRef<"input"> {
  extra?: string;
  variant?: string;
  state?: string;
  label?: string;
  name: Path<T>;
  register?: UseFormRegister<T>;
  validation?: RegisterOptions;
  errors?: FieldErrors<T>;
}

function InputField<T>({
  extra,
  variant,
  state,
  id,
  label,
  name,
  onChange,
  disabled,
  type,
  placeholder,
  register,
  validation,
  errors,

  ...rest
}: InputFieldProps<T>) {
  return (
    <div className={`${extra} relative`}>
      {label && (
        <label
          htmlFor={id}
          className={`text-sm text-navy-700 dark:text-white ${
            variant === "auth" ? "ml-1.5 font-medium" : "font-bold"
          }`}
        >
          {`${label} ${validation?.required ? "*" : ""}`}
        </label>
      )}
      <input
        autoComplete="off"
        name={name}
        onChange={onChange}
        disabled={disabled}
        type={type}
        id={id}
        placeholder={placeholder}
        className={`mt-2 flex h-12 w-full items-center justify-center rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none dark:!border-white/10
        dark:text-white`}
        {...register(name, validation)}
        {...rest}
      />
      <ErrorMessage
        errors={errors}
        name={name as any}
        render={({ message }) => (
          <p className="absolute mt-1 text-xs text-red-500">{message}</p>
        )}
      />
    </div>
  );
}

export default InputField;
