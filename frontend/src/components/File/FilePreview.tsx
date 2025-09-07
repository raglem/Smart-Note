import { FileType } from "@/types";

export default function FilePreview({ file, isPDF, children } : { 
    file: FileType, 
    isPDF?: boolean,
    children?: React.ReactNode 
}){
    const path = file.file
    const handleFullPreview = () => {
        if (children) return;
        window.open(path, "_blank");
    }

    return (
        <div onClick={children ? undefined : handleFullPreview} className={`relative file-wrapper ${children ? '' : 'hover:cursor-pointer hover:opacity-80'}`}>
            <div className="flex justify-center items-center relative w-full aspect-[8/10] bg-gray-100">
            {isPDF ? (
                <object
                    data={path}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                    onClick={(e) => e.stopPropagation()}
                >
                    <p>
                    This PDF cannot be displayed.{" "}
                    <a href={path} target="_blank" rel="noopener noreferrer">Open PDF</a>
                    </p>
                </object>
                ) : (
                <img src={path} alt={file.name} className="w-full h-full object-contain" />
                )}
                {children}
            </div>
            <div className="flex flex-row items-center h-[28px] min-h-fit max-w-full border-box p-2 bg-primary text-white text-sm">
                {file.name}
            </div>
        </div>
    );
}
