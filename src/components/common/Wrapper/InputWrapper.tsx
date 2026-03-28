import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

interface IInputWrapperProps {
  children: ReactNode;
  error?: string | undefined;
  label: string;
  labelFor?: string;
  className?: string;
}

const InputWrapper: FC<IInputWrapperProps> = ({
  children,
  error,
  label,
  labelFor,
  className,
}) => {
  return (
    <div className={cn("w-full flex flex-col p-1", className)}>
      {label && (
        <label
          className="text-sm max-w-none truncate inline-block leading-8"
          htmlFor={labelFor || ""}
        >
          {label.replace("✽", "")}{" "}
          {label.includes("✽") && <span className="text-red-600 font-bold text-base">✽</span>}
        </label>
      )}
      {children}
      {error && (
        <label
          className="text-sm text-destructive max-w-none block mt-1"
          htmlFor={labelFor || ""}
        >
          {error || ""}
        </label>
      )}
    </div>
  );
};


export default InputWrapper;
