
type HeaderProps = {
    setAuthPanelOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function Header({ setAuthPanelOpen }: HeaderProps ) {

    return(
            <div className="bg-green-400 border-2 border-white rounded-lg p-4 mt-12 w-9/10 mx-auto">
                <h2 className="inter-bold text-2xl text-white">
                    Do Date
                </h2>
                <h4 className="open-sans-regular text-white text-lg">Do future you a favor!</h4>
                <button className="border-2 border-yellow-400 bg-white text-green-400 p-1 rounded-md"
                onClick={() => setAuthPanelOpen(true)}>Try it!</button>
            </div>
    )
}