import LoadingSpinner from "@/components/LoadingSpinner";

export default function LoadingClass(){
    return (
        <div>
            <header className="w-full text-black">
                <h1 className="animate-pulse">Loading Class</h1>
            </header>
            <div className="h-[calc(100vh-230px)] w-full flex justify-center items-center">
                <LoadingSpinner />
            </div>
        </div>
    )
}