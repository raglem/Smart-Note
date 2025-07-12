export interface MemberType {
    id: string;
    name: string;
    friends: SimpleMemberType[];
}
export interface SimpleMemberType{
    id: string;
    name: string;
}
export interface FilePreviewType {
    name: string;
    previewUrl: string;
}
export interface NoteCategoryType{
    id: string;
    section: SectionEnumType
    section_id: string,
    notes: NoteType[]
}
export interface NoteType {
    id: string;
    file: FilePreviewType;
    owner: SimpleMemberType;
    category_id: string;
    updated_date: string;

}
export type SectionEnumType = "Class" | "Unit" | "Subunit";
export interface StudyGroupType {
    id: string;
    name: string;
    dateTime: Date;
    visibility: "Public" | "Private";
    members: StudyGroupMemberType[];
}
export interface StudyGroupMemberType{
    member: SimpleMemberType;
    status: "Invited" | "Joined";
}
