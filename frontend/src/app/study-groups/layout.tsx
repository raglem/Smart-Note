import StudyGroupSidebar from "../components/Study Group/StudyGroupSidebar";
import { StudyGroupProvider } from "../context/StudyGroupContext";
export default function StudyGroupsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <StudyGroupProvider>
        <div className="flex flex-row min-h[calc(100vh-100px)] w-full">
            <StudyGroupSidebar />
            { children }
        </div>
    </StudyGroupProvider>
}