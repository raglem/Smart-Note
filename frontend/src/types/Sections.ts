import { MemberType, SimpleMemberType, NoteCategoryType, FileType } from ".";

export interface ClassType{
    id: number,
    name: string,
    image: string,
    join_code: string,
    course_number?: string,
    owner: SimpleMemberType,
    members: SimpleMemberType[],
    number_of_notes: number
}
export interface ClassDetailType {
    id: number;
    name: string;
    course_number?: string;
    join_code: string;
    owner: SimpleMemberType;
    members: SimpleMemberType[];
    units: UnitType[];
    files: FileType[];
}
export interface UnitType {
    id: number;
    class_id: number;
    name: string;
    course_number: string;
    order: number;
    members: SimpleMemberType[];
    subunits: SubunitType[];
    files: FileType[];
}
export interface SubunitType {
    id: number;
    unit_id: number;
    name: string;
    course_number: string;
    order: number;
    members: SimpleMemberType[];
    files: FileType[];
}
export type SectionType = UnitType | SubunitType;
  
export function isUnitType(section: SectionType): section is UnitType {
    return "subunits" in section
}
export function isSubunitType(section: SectionType): section is SubunitType{
    return !("subunits" in section)
}