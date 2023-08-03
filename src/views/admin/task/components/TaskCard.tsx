import React from "react";
import Card from "../../../../components/card";
import { TaskModel } from "../../../../models/task.interface";
import { Link } from "react-router-dom";

const TaskCard = ({ task }: { task: TaskModel }) => {
  return (
    <Card extra="!p-6">
      <div className="flex h-full w-full flex-col justify-between">
        <div className="flex h-full flex-col justify-between">
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="mb-3 flex items-center justify-between gap-5 overflow-ellipsis">
                <Link to={`detail/${task.id}`} className="line-clamp-1">
                  <h4 className="font-semibold">{task.title}</h4>
                </Link>
                <div
                  className={`min-w-max rounded-lg ${
                    task.is_finished ? "bg-green-500" : "bg-brand-500"
                  } px-3 py-1 text-sm font-medium text-white`}
                >
                  {`${task.is_finished ? "Finished" : "On Progress"}`}
                </div>
              </div>
              <p className="line-clamp-3 text-justify">{task.description}</p>
            </div>
            <div className="mb-3 mt-5">
              <p className="text-sm text-gray-700">Deadline</p>
              <span className="mt-1 font-medium">
                {task.deadline.formatted}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-4">
              <div className="relative h-full w-full">
                <div className="flex h-2 overflow-hidden rounded bg-lightPrimary text-xs">
                  <div
                    style={{ width: `${task.todo_metrics.percentage}%` }}
                    className="animate-pulse whitespace-nowrap bg-brand-500 text-center text-white shadow-none"
                  ></div>
                </div>
              </div>
              <span className="font-bold">{`${
                task.todo_metrics.percentage || 0
              }%`}</span>
            </div>
            <span className="text-xs">{`${task.todo_metrics.completed} / ${task.todo_metrics.total} Task Completed`}</span>
          </div>
        </div>

        <div>
          <div className="-mx-6 my-3 h-0.5 w-auto border border-gray-100"></div>
          <div className="flex items-center justify-between">
            <p className="text-gray-700">Assigned To</p>
            <div className="flex items-center gap-3">
              <span className="truncate text-sm">{task.user.name}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
