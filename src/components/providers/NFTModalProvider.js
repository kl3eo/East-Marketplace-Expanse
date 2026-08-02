import { createContext, useState } from 'react'

const currentDomain = 'room-house.com'
const contextDefaultValues = {
  modalNFT: undefined,
  isModalOpen: false,
  isCategChangedInMenu: false,
  isDescOpen: true,
  isReqFormOpen: typeof window !== 'undefined' && (window.location.hostname === 'happyminter' + '.' + currentDomain || window.location.hostname === 'happydox' + '.' + currentDomain || window.location.hostname.match(/tokenizer/ig)),
  // currLang: typeof window !== 'undefined' && window.location.hostname === 'happydox' + '.' + currentDomain ? 'RU' : 'EN',
  currLang: 'EN',
  currSize: '138%',
  setModalNFT: () => {},
  setIsModalOpen: () => {},
  setIsCategChangedInMenu: () => {},
  setIsDescOpen: () => {},
  setIsReqFormOpen: () => {},
  setCurrLang: () => {},
  setCurrSize: () => {}
}

export const NFTModalContext = createContext(
  contextDefaultValues
)

export default function NFTModalProvider ({ children }) {
  const [modalNFT, setModalNFT] = useState(contextDefaultValues.modalNFT)
  const [isModalOpen, setIsModalOpen] = useState(contextDefaultValues.isModalOpen)
  const [isCategChangedInMenu, setIsCategChangedInMenu] = useState(contextDefaultValues.isCategChangedInMenu)
  const [isDescOpen, setIsDescOpen] = useState(contextDefaultValues.isDescOpen)
  const [isReqFormOpen, setIsReqFormOpen] = useState(contextDefaultValues.isReqFormOpen)
  const [currLang, setCurrLang] = useState(contextDefaultValues.currLang)
  const [currSize, setCurrSize] = useState(contextDefaultValues.currSize)

  return (
    <NFTModalContext.Provider
      value={{
        modalNFT,
        isModalOpen,
        isDescOpen,
        isCategChangedInMenu,
        isReqFormOpen,
        currLang,
        currSize,
        setModalNFT,
        setIsModalOpen,
        setIsCategChangedInMenu,
        setIsDescOpen,
        setIsReqFormOpen,
        setCurrLang,
        setCurrSize
      }}
    >
      {children}
    </NFTModalContext.Provider>
  )
};
