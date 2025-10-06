import { createPortal } from "react-dom";

type ModalProps = {
    modalMessage: string,
    setModalMessage: React.Dispatch<React.SetStateAction<string>>
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
    setAuthPanelOpen: React.Dispatch<React.SetStateAction<boolean>>
}


export function Modal({
    modalMessage,
    setModalMessage,
    setShowModal,
    }: ModalProps) {

    const handleCloseModal = () => {
        setModalMessage('')
        setShowModal(false)
    }

    return createPortal(
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-50 via-gray-100 to-blue-50 pt-10
                        lg:w-96 lg:h-[800px] lg:bg-black lg:rounded-[2.5rem] lg:overflow-y-auto lg:border-4 border-gray-300 lg:pb-8 lg:pt-12 lg:mx-auto lg:mt-20"
            onClick={() => {
                handleCloseModal()
            }}>
            <div className="w-2/3 h-max p-2 bg-indigo-100 shadow-md rounded-lg mx-auto z-30 mt-40">
                <p className="italic">
                    {modalMessage}
                </p>
                <button className="bg-white px-2 rounded-md text-green-500 w-max shadow-md my-2"
                onClick={() => {
                    handleCloseModal()
                }}>
                    Ok
                </button>
            </div>
        </div>,
        document.body
    )
}