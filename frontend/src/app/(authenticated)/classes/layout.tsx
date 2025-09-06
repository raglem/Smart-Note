import { ClassContextProvider } from "@/app/context/ClassContext";
export default function ClassesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ClassContextProvider>
        <div className="flex flex-col h-full w-full p-5 lg:p-10">
            { children }
        </div>
    </ClassContextProvider>
}