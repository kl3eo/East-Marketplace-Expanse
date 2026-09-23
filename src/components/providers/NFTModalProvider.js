import { createContext, useState } from 'react'
import { useRouter } from 'next/router'
import { isMobile, isAndroid } from 'react-device-detect'

const currentDomain = 'room-house.com'
const contextDefaultValues = {
  modalNFT: undefined,
  isModalOpen: false,
  isCategChangedInMenu: false,
  isDescOpen: true,
  isAnswerShown: false,
  isReqFormOpen: typeof window !== 'undefined' && (window.location.hostname === 'nft' + '.' + currentDomain || window.location.hostname === 'happyminter' + '.' + currentDomain || window.location.hostname === 'happydox' + '.' + currentDomain || window.location.hostname.match(/tokenizer/ig) || window.location.hostname.match(/motivation/ig)),
  // currLang: typeof window !== 'undefined' && window.location.hostname === 'happydox' + '.' + currentDomain ? 'RU' : 'EN',
  currLang: typeof window !== 'undefined' && window.location.hostname.match(/motivation/ig) ? 'RU' : 'EN',
  currSize: isMobile ? isAndroid ? '120%' : '112%' : '138%',
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
  const { asPath } = useRouter()
  const defVal = asPath.match(/\?/) ? false : contextDefaultValues.isReqFormOpen
  const [modalNFT, setModalNFT] = useState(contextDefaultValues.modalNFT)
  const [isModalOpen, setIsModalOpen] = useState(contextDefaultValues.isModalOpen)
  const [isCategChangedInMenu, setIsCategChangedInMenu] = useState(contextDefaultValues.isCategChangedInMenu)
  const [isDescOpen, setIsDescOpen] = useState(contextDefaultValues.isDescOpen)
  const [isAnswerShown, setIsAnswerShown] = useState(contextDefaultValues.isAnswerShown)
  const [isReqFormOpen, setIsReqFormOpen] = useState(defVal)
  const [currLang, setCurrLang] = useState(contextDefaultValues.currLang)
  const [currSize, setCurrSize] = useState(contextDefaultValues.currSize)

  return (
    <NFTModalContext.Provider
      value={{
        modalNFT,
        isModalOpen,
        isDescOpen,
        isAnswerShown,
        isCategChangedInMenu,
        isReqFormOpen,
        currLang,
        currSize,
        setModalNFT,
        setIsModalOpen,
        setIsCategChangedInMenu,
        setIsDescOpen,
        setIsAnswerShown,
        setIsReqFormOpen,
        setCurrLang,
        setCurrSize
      }}
    >
      {children}
    </NFTModalContext.Provider>
  )
};
