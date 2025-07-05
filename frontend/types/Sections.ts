import { MemberType, SimpleMemberType, NoteCategoryType } from ".";

export interface ClassType {
    id: string;
    name: string;
    course_number?: string;
    join_code: string;
    members: SimpleMemberType[];
    units: UnitType[];
    note_category: NoteCategoryType;
}
export interface UnitType {
    id: string;
    class_id: string;
    name: string;
    course_number: string;
    members: SimpleMemberType[];
    subunits: SubunitType[];
    note_category: NoteCategoryType;
}
export interface SubunitType {
    id: string;
    unit_id: string;
    name: string;
    course_number: string;
    members: SimpleMemberType[];
    note_category: NoteCategoryType;
}
export type SectionType = UnitType | SubunitType;
  
export function isUnitType(section: SectionType): section is UnitType {
    return "subunits" in section
}
export function isSubunitType(section: SectionType): section is SubunitType{
    return !("subunits" in section)
}