"use client"

import { CgDanger } from "react-icons/cg"

export default function DeleteConfirmation({ deletionType, name, remove, close} : {
    deletionType: 'Class' | 'Unit' | 'Subunit' | 'File',
    name: string, 
    remove: () => void,
    close: () => void,
}){
    return (
        <div className="overlay">
            <div className="card flex flex-col gap-y-2 min-w-[300px] w-[50vw] max-w-[768px]">
                <header className="flex flex-row items-center pt-4 pb-2 px-4 bg-primary text-white">
                    <h1>Delete { deletionType}</h1>
                </header>
                <section className="flex flex-row p-4 gap-x-2">
                    <CgDanger className="text-primary icon-responsive text-4xl" />
                    <div className="flex flex-grow flex-col justify-center gap-y-2">
                        <p>
                            <span className="text-2xl">Are you sure you want to delete {name}?</span>
                            <br/>
                            <i className="text-md">This action cannot be undone</i>
                        </p>
                        <div className="form-btn-toolbar px-2">
                            <button onClick={remove} className="form-btn bg-primary text-white border-0">Delete</button>
                            <button onClick={close} className="form-btn bg-white border-1 border-primary text-black">Cancel</button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}