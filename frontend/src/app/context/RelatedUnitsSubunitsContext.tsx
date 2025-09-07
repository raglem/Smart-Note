"use client"

import { createContext } from "react";
import { UnitSimpleType, SubunitSimpleType } from "@/types/Sections";

type RelatedUnitSubunitsContextType = {
    units: UnitSimpleType[],
    subunits: SubunitSimpleType[]
}
const RelatedUnitSubunitsContext = createContext<RelatedUnitSubunitsContextType>({
    units: [], subunits: []
})
export default RelatedUnitSubunitsContext