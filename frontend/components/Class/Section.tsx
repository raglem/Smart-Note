"use client"
import { useState } from "react";
import { isSubunitType, isUnitType, SectionType } from "../../types/Sections"
import { FaCaretUp, FaCaretDown } from "react-icons/fa";
import FilePreview from "../FilePreview";
export default function Section({ section, editMode }: { section: SectionType, editMode: boolean }) {
    const [showSubSections, setShowSubsections] = useState<boolean>(false)
    
    // Determine section type
    const [sectionType, setSectionType] = useState<string | null>(isUnitType(section) ? "Unit" : isSubunitType(section) ? "Subunit" : null);
    const [subSectionType, setSubSectionType] = useState<string | null>(isUnitType(section) ? "Subunit" : isSubunitType(section) ? "Unit" : null);

    const toggleSubsection = (id:string) => {
        // A subunit will not have a subsection
        if(sectionType === "Subunit")   return
        setShowSubsections(!showSubSections)
    }
    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex flex-row items-center gap-x-2">
                {isUnitType(section) && <div>
                    {
                    showSubSections ? (
                        <FaCaretUp className="icon-responsive" onClick={() => toggleSubsection(section.id)} />
                    ): (
                        <FaCaretDown className="icon-responsive" onClick={() => toggleSubsection(section.id)} />
                    )
                    }
                    </div>
                }
                <div className={`flex w-full py-2 border-b-1 border-b-primary text-${sectionType === "Unit" ? "2xl" : "xl"}`}>
                    { section.name }
                </div>
            </div>
            {showSubSections && (
                <div className="relative flex flex-col gap-y-2 pl-10">
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {section.note_category.notes.map((note) => (
                            <div key={note.id}>
                                <FilePreview params={note.file} />
                            </div>
                        ))}
                    </div>
                    {isUnitType(section) &&
                    section.subunits.map((subunit) => (
                        <Section key={subunit.id} section={subunit} editMode={editMode} />
                    ))}
                </div>
            )}
        </div> 
    )
}