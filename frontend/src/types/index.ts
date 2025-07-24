export interface MemberType {
    id: number;
    name: string;
    friends: SimpleMemberType[];
}
export interface SimpleMemberType{
    id: number;
    name: string;
}
export interface FilePreviewType {
    name: string;
    previewUrl: string;
}
export interface FileType{
    id: number,
    file: string,
    name: string,
    updated_at: string,
}
export interface NoteCategoryType{
    id: number;
    section: SectionEnumType
    section_id: string,
    notes: NoteType[]
}
export interface NoteType {
    id: number;
    file: FilePreviewType;
    owner: SimpleMemberType;
    category_id: string;
    updated_date: string;

}
export type SectionEnumType = "Class" | "Unit" | "Subunit";
export interface StudyGroupType {
    id: number;
    name: string;
    dateTime: Date;
    visibility: "Public" | "Private";
    members: StudyGroupMemberType[];
}
export interface StudyGroupMemberType{
    member: SimpleMemberType;
    status: "Invited" | "Joined";
}
