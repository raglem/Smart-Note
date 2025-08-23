"use client"

import { useState, createContext } from "react";
import { ClassType, UnitSimpleType, SubunitSimpleType } from "@/types/Sections";

type RelatedUnitSubunitsContextType = {
    units: UnitSimpleType[],
    subunits: SubunitSimpleType[]
}
const RelatedUnitSubunitsContext = createContext<RelatedUnitSubunitsContextType>({
    units: [], subunits: []
})
export default RelatedUnitSubunitsContext