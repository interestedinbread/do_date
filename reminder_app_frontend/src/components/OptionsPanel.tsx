

export function OptionsPanel () {

    return(
        <div className="w-max h-max p-2 bg-green-400 rounded-lg mx-auto mt-20">
            <h2 className="text-white text-2xl">What would you like to do?</h2>
            <button className="bg-green-400 border-2 border-yellow-300 p-2 rounded-md text-white"
            onClick={handleLogout}>Logout</button>
        </div>
    )
}