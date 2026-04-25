import { useState } from 'react';

export const usePermissions = () => {
  const [locationAsked] = useState(false);
  const [contactsAsked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);

  const showLocationPrompt = () => {
    setModalType('location');
    setShowModal(true);
  };

  const showSharePrompt = () => {
    setModalType('contacts');
    setShowModal(true);
  };

  const handleAllow = (callback) => {
    setShowModal(false);

    if (typeof callback === 'function') {
      callback();
    }
  };

  const handleDeny = () => {
    setShowModal(false);
  };

  return {
    locationAsked,
    contactsAsked,
    showLocationPrompt,
    showSharePrompt,
    handleAllow,
    handleDeny,
    showModal,
    modalType,
  };
};
// TODO: implement
