import { createContext, useState } from "react";
import { UnitType } from "../../types/Sections";

export const ClassContext = createContext({} as ClassContextType);

export type ClassContextType = {
    addMode: boolean;
    setAddMode: React.Dispatch<React.SetStateAction<boolean>>;
    editMode: boolean;
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    units: UnitType[];
    setUnits: React.Dispatch<React.SetStateAction<UnitType[]>>;
    draggingUnit: boolean;
    setDraggingUnit: React.Dispatch<React.SetStateAction<boolean>>;
    draggingSubunit: boolean;
    setDraggingSubunit: React.Dispatch<React.SetStateAction<boolean>>;
};

