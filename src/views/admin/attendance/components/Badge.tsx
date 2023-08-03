import React from "react";
import { IconType } from "react-icons";

interface BadgeProps {
  withIcon?: boolean;
  icon?: IconType;
  color?: React.HTMLAttributes<HTMLDivElement>["className"];
  text?: string;
}

const Badge = ({ color, icon, text = "Default", withIcon }: BadgeProps) => {
  return (
    <div
      className={`flex w-fit min-w-max flex-row items-center rounded-lg px-3 py-2 text-center text-xs font-bold uppercase text-white transition duration-200 ${
        color ? color : "bg-brand-500 dark:bg-brand-400"
      }`}
    >
      {withIcon && (
        <div className="flex h-5 w-5 items-center justify-center">
          {icon({ size: 24, color: "white" })}
        </div>
      )}
      {text}
    </div>
  );
};

export default Badge;
