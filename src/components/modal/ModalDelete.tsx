import React from "react";
import Modal from "./Modal";

const ModalDelete = (props: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  detail?: string;
  onDelete?: () => void;
}) => {
  const {
    isOpen,
    setIsOpen,
    title = "Confirm Delete",
    detail,
    onDelete,
  } = props;

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={title}>
      Are you sure you want to delete this {detail} ?
      <div className="mt-3 flex justify-end gap-5">
        <button
          onClick={() => setIsOpen(false)}
          className="rounded-xl bg-brand-500 px-5 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
        >
          Cancel
        </button>
        <button
          onClick={onDelete}
          className="rounded-xl bg-red-500 px-5 py-3 text-base font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-700 dark:bg-red-400 dark:text-white dark:hover:bg-red-300 dark:active:bg-red-200"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
};

export default ModalDelete;
