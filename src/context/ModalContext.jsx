import React, { createContext, useContext, useState } from 'react'
import Modal from '../components/Modal'

const ModalContext = createContext()

export const useModal = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within ModalProvider')
  }
  return context
}

export const ModalProvider = ({ children }) => {
  const [modalData, setModalData] = useState({ isOpen: false, link: null })

  const openModal = (link) => {
    setModalData({ isOpen: true, link })
  }

  const closeModal = () => {
    setModalData({ isOpen: false, link: null })
  }

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal 
        isOpen={modalData.isOpen} 
        onClose={closeModal} 
        link={modalData.link} 
      />
    </ModalContext.Provider>
  )
}