
type HeaderProps = {
    setAuthPanelOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function Header({ setAuthPanelOpen }: HeaderProps ) {

    return(
        <>
            <div className="bg-indigo-100 shadow-md rounded-lg p-4 w-9/10 mx-auto">
                <div className="flex justify-between">
                    <div className="">
                        <h2 className="montserrat-bold-italic text-5xl text-indigo-600 ml-2">
                            Do Date
                        </h2>
                        <h4 className="inter-regular text-indigo-600 text-lg mt-2 ml-4">Do future-you a favor!</h4>
                    </div>
                    <div>
                        <img src="/img/noun-schedule-256135-4C25E1.png"
                        className="h-[85px] w-[85px]"/>
                    </div>
                </div>
            </div>
            <div className="bg-indigo-100 shadow-md rounded-lg p-4 mt-8 w-9/10 mx-auto">
                <p className="inter-bold text-indigo-600 text-xl">What is it?</p>
                <p className="bold italic">Do Date is a lightweight app that helps you stay on top of tasks by sending you text reminders!</p>
            </div>
            <div className="bg-indigo-100 shadow-md rounded-lg p-4 mt-8 w-9/10 mx-auto">
                <p className="inter-bold text-indigo-600 text-xl">Using Do Date is easy!</p>
                <div className="flex mt-4">
                    <div className="w-1 bg-indigo-600 mr-4 rounded-lg"></div>
                    <div className="pl-2">
                        <p className="inter-regular"><span className="text-green-600 mr-2">Step 1:</span> Sign up (it's free!)</p>
                        <p className="inter-regular mt-2"><span className="text-green-600 mr-2">Step 2:</span> Add your phone number</p>
                        <p className="inter-regular mt-2"><span className="text-green-600 mr-2">Step 3:</span> Set a reminder</p>
                        <p className="inter-regular mt-2"><span className="text-green-600 mr-2">Step 4:</span> Succeed!</p>
                    </div>
                </div>
                <div className="flex justify-between mt-4 px-4">
                    <img src="/img/noun-sign-up-6478-007435.png" className="h-[50px] w-[50px]"></img>
                    <img src="/img/noun-phone-8036162-007435.png" className="h-[50px] w-[50px]"></img>
                    <img src="/img/noun-schedule-256135-007435.png" className="h-[50px] w-[50px]"></img>
                    <img src="/img/noun-success-8043471-007435.png" className="h-[50px] w-[50px]"></img>
                </div>
            </div>
            <div className="bg-indigo-100 shadow-md rounded-lg p-4 w-2/3 flex justify-between mt-8 ml-5">
                <div>
                    <p className="italic">Ready to get started?</p>
                </div>
                <div>
                    <button className="bg-white px-2 rounded-md text-green-600 w-max shadow-md"
                    onClick={() => setAuthPanelOpen(true)}>Begin</button>
                </div>
            </div>
        </>
    )
}