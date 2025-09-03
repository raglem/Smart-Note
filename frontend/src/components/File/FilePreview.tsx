import { FileType } from "@/types";

export default function FilePreview({ file, isPDF, children } : { 
    file: FileType, 
    isPDF?: boolean,
    children?: React.ReactNode 
}){
    const baseUrl = "http://localhost:8000";
    const path = file.file.startsWith("/media") ? `${baseUrl}${file.file}` : file.file;

    const handleFullPreview = () => {
        if (children) return;
        window.open(path, "_blank");
    }

    return (
        <div onClick={children ? undefined : handleFullPreview} className={`relative file-wrapper ${children ? '' : 'hover:cursor-pointer hover:opacity-80'}`}>
            <div className="flex justify-center items-center relative w-full aspect-[8/10] bg-gray-100">
                {isPDF ? (
                    <iframe src={path} width="100%" height="100%" />
                ) : (
                    <img src={path} alt={file.name} className="w-full h-full object-contain" />
                )}
                {children}
            </div>
            <div className="flex flex-row items-center h-[28px] max-w-full border-box p-2 bg-primary text-white text-sm">
                {file.name}
            </div>
        </div>
    );
}
