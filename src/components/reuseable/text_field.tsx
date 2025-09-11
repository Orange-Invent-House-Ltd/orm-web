import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";

type FormInputProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  variant?: "short" | "medium" | "long";
  value?: string;
};

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = "text",
  placeholder,
  disabled,
  value,
  variant = "long",
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="mb-3">
      <label
        htmlFor={name}
        className={clsx("block text-sm mb-[6px] capitalize text-left", {
          "text-[#DA1E28]": errors[name],
          "text-white/90": !errors[name], // Added default text color
        })}
      >
        {label}
      </label>
      <input
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        defaultValue={value}
        className={clsx(
          "block w-full border border-[#B7B7B7] rounded-md p-2 outline-none focus:border-[#747373] disabled:opacity-75 disabled:hover:cursor-not-allowed",
          {
            "w-full": variant == "long",
            "max-w-[319px]": variant == "medium",
            "max-w-[165px]": variant == "short",
            "border-[#DA1E28] focus:border-[#DA1E28]": errors[name],
            "disabled disabled:opacity-75 hover:cursor-not-allowed": disabled,
          }
        )}
        {...register(name)}
      />
      {errors[name] && (
        <span className="block text-red-500 text-xs pt-1 text-left">
          {errors[name]?.message as string}
        </span>
      )}
    </div>
  );
};

// Custom Password Input with toggle
export const PasswordInput: React.FC<Omit<FormInputProps, 'type'>> = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    formState: { errors },
  } = useFormContext();
  
  return (
    <div className="mb-3">
      <label
        htmlFor={props.name}
        className={clsx("block text-sm mb-[6px] capitalize font-medium text-left", {
          "text-red-500": errors[props.name],
          "text-white/90": !errors[props.name],
        })}
      >
        {/* {props.label} */}
      </label>
      <div className="relative">
        <FormInput
          {...props}
          type={showPassword ? "text" : "password"}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[3rem] transform -translate-y-1/2 text-white/60 hover:text-white/90 transition-colors"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
};

export default FormInput;