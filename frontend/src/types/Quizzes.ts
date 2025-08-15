import { ClassSimpleType, SubunitSimpleType, UnitSimpleType } from "./Sections"

export type QuizType = {
    id: number,
    name: string,
    image: File,
    related_class: ClassSimpleType,
    related_units: UnitSimpleType[],
    related_subunits: SubunitSimpleType[]
}