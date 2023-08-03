import React from "react";

const useModal = () => {
  const [showModal, setShowModal] = React.useState(false);

  const toggle = () => setShowModal(!showModal);

  return { showModal, setShowModal, toggle };
};

export default useModal;
