import React from "react";
import Checkbox from "../../../../components/checkbox";
import { MdDelete, MdEdit } from "react-icons/md";

interface Props {
  title: string;
  completed: boolean;
  onEdit: () => void;
  onDelete: () => void;
  toggleTodo: () => void;
}

const TodoCard = ({
  title,
  completed,
  onEdit,
  toggleTodo,
  onDelete,
}: Props) => {
  return (
    <div className="flex items-center">
      <div className="flex w-11/12 items-center">
        <Checkbox checked={completed} onChange={toggleTodo} />
        <p className="ml-2 text-justify">{title}</p>
      </div>
      <MdEdit
        onClick={onEdit}
        className="ml-auto hover:cursor-pointer"
        color="orange"
      />
      <MdDelete
        onClick={onDelete}
        className="ml-2 hover:cursor-pointer"
        color="red"
      />
    </div>
  );
};

export default TodoCard;
