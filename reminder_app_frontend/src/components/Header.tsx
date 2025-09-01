
type HeaderProps = {
    setAuthPanelOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function Header({ setAuthPanelOpen }: HeaderProps ) {

    return(
            <div className="bg-indigo-100 shadow-md rounded-lg p-4 mt-12 w-9/10 mx-auto">
                <h2 className="inter-bold text-2xl text-indigo-600">
                    Do Date
                </h2>
                <h4 className="open-sans-regular text-indigo-500 text-lg">Do future you a favor!</h4>
                <button className="bg-indigo-400 px-2 rounded-md text-white w-max shadow-md my-2"
                onClick={() => setAuthPanelOpen(true)}>Try it!</button>
            </div>
    )
}