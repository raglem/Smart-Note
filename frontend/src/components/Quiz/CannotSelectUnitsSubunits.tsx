export default function CannotSelectUnitsSubunits(){
    return (
        <div className="flex flex-col gap-y-2 opacity-50 hover:cursor-not-allowed">
            <div className="flex flex-col gap-y-1">
                <label htmlFor="units-input" className="hover:cursor-not-allowed">
                    Units
                </label>
                <input 
                    type="text" id="units-input" 
                    className="w-full border-1 border-primary outline-none p-2 hover:cursor-not-allowed"
                    placeholder="Select a class first"
                    disabled
                />
            </div>
            <div className="flex flex-col gap-y-1">
                <label htmlFor="units-input" className="hover:cursor-not-allowed">
                    Subunits
                </label>
                <input 
                    type="text" id="units-input" 
                    className="w-full border-1 border-primary outline-none p-2 hover:cursor-not-allowed"
                    placeholder="Select a class first"
                    disabled
                />
            </div>
        </div>
    )
}