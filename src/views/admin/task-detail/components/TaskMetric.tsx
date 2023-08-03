import { IconType } from "react-icons";

interface Props<T> {
  title: string;
  metric: T;
  icon: IconType;
}

const TaskMetric = ({ title, metric, icon }: Props<string | number | null>) => {
  return (
    <div className="flex items-center gap-5">
      <div className="flex h-10 min-w-[40px] items-center justify-center rounded-xl bg-brand-500">
        {icon({ size: 24, color: "white" })}
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <p className="truncate text-lg font-semibold">
          {metric == null ? "-" : metric}
        </p>
        <h4>{title}</h4>
      </div>
    </div>
  );
};

export default TaskMetric;
