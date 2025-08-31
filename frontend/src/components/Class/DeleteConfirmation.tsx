export default function DeleteConfirmation({ deletionType, name, remove, close} : {
    deletionType: 'Class' | 'Unit' | 'Subunit' | 'File',
    name: string, 
    remove: () => void,
    close: () => void,
}){
    return (
        <div className="overlay">
            <div className="card flex flex-col py-4 gap-y-2 min-w-[300px] w-[50vw] max-w-[768px] bg-secondary">
                <header className="flex flex-row items-center px-2 text-3xl border-b-1 border-b-primary">
                    Delete { deletionType}
                </header>
                <p className="px-2">
                    <span className="text-2xl">Are you sure you want to delete {name}?</span>
                    <br/>
                    <i className="text-md">This action cannot be undone</i>
                </p>
                <div className="form-btn-toolbar px-2">
                    <button onClick={remove} className="form-btn bg-primary text-white">Delete</button>
                    <button onClick={close} className="form-btn bg-secondary text-primary">Cancel</button>
                </div>
            </div>
        </div>
    )
}