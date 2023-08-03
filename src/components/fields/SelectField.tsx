import {
  ControllerRenderProps,
  FieldErrors,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import AsyncSelect from "react-select/async";

const SelectField = (props: {
  name: string;
  label: string;
  className?: string;
  loadOptions: () => Promise<{ label: string; value: string }[]>;
  field: ControllerRenderProps<FieldValues, any>;
  validation?: RegisterOptions;
  errors: FieldErrors<FieldValues>;
}) => {
  const { name, label, className, loadOptions, field, validation, errors } =
    props;

  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="text-sm font-bold text-navy-700 dark:text-white"
      >
        {`${label} ${validation?.required ? "*" : ""}`}
      </label>
      <AsyncSelect
        value={field.value}
        onChange={field.onChange}
        ref={field.ref}
        cacheOptions
        defaultOptions
        loadOptions={loadOptions}
        classNames={{
          container: () => "mt-2 rounded-xl",
          control: () =>
            "flex h-12 items-center justify-center !rounded-xl !border text-sm !border-gray-200",
          menuList: () => "",
        }}
      />
      {errors[field.name] && (
        <p className="mt-1 text-xs text-red-500">
          {errors[field.name].message.toString()}
        </p>
      )}
    </div>
  );
};

export default SelectField;
