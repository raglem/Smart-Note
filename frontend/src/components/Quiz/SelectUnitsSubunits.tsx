"use client"

import { useEffect, useMemo, useState } from "react";
import useUnitsStore from "@/stores/unitsStore";
import { SubunitSimpleType, UnitSimpleType } from "@/types/Sections";
import { CiCircleRemove } from "react-icons/ci";

export default function SelectUnitsSubunits({selectedUnits, setSelectedUnits, selectedSubunits, setSelectedSubunits, classId}: {
    selectedUnits: UnitSimpleType[],
    setSelectedUnits: (units: UnitSimpleType[]) => void,
    selectedSubunits: SubunitSimpleType[],
    setSelectedSubunits: (subunits: SubunitSimpleType[]) => void,
    classId: number,
}){
    const loading = useUnitsStore(state => state.isLoading)
    const units = useUnitsStore(state => state.units)
    const subunits = useUnitsStore(state => state.subunits)
    const fetchUnitsAndSubunits = useUnitsStore(state => state.fetchUnitsAndSubunits)

    const [unitQuery, setUnitQuery] = useState<string>("")
    const [filteredUnits, setFilteredUnits] = useState<UnitSimpleType[]>([])
    const [unitIsFocused, setUnitIsFocused] = useState<boolean>(false)

    const [subunitQuery, setSubunitQuery] = useState<string>("")
    const [filteredSubunits, setFilteredSubunits] = useState<UnitSimpleType[]>([])
    const [subunitIsFocused, setSubunitIsFocused] = useState<boolean>(false)

    useEffect(() => {
        fetchUnitsAndSubunits(classId)
        console.log(units)
    }, [classId])

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (!target?.closest('#unit-input-wrapper')) {
                setUnitIsFocused(false);
            }
            if (!target?.closest('#subunit-input-wrapper')) {
                setSubunitIsFocused(false);
            }
        };
    
        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    })

    // Filter available units to select
    useMemo(() => {
        if (unitQuery.length === 0) {
            setFilteredUnits(
                units.filter(option => !selectedUnits.find(u => u.id === option.id))
                    .sort((a, b) => a.name.localeCompare(b.name))
            );
            return;
        }
    
        setFilteredUnits(
            units.filter(option =>
                option.name.trim().toLowerCase().includes(unitQuery.trim().toLowerCase()) &&
                !selectedUnits.find(u => u.id === option.id)
            ).sort((a, b) => a.name.localeCompare(b.name))
        );
    }, [unitQuery, units, selectedUnits]);

    // Filter available subunits to select
    useMemo(() => {
        if (subunitQuery.length === 0) {
            setFilteredSubunits(
                subunits.filter(option => !selectedSubunits.find(s => s.id === option.id))
                    .sort((a, b) => a.name.localeCompare(b.name))
            );
            return;
        }
    
        setFilteredSubunits(
            subunits.filter(option =>
                option.name.trim().toLowerCase().includes(unitQuery.trim().toLowerCase()) &&
                !selectedSubunits.find(s => s.id === option.id)
            ).sort((a, b) => a.name.localeCompare(b.name))
        );
    }, [subunitQuery, subunits, selectedSubunits]);

    const handleAddUnit = (unit: UnitSimpleType) => {
        if(selectedUnits.find(u => u.id === unit.id)) return
        setSelectedUnits([...selectedUnits, unit])
        setUnitQuery("")
    }

    const handleAddSubunit = (subunit: SubunitSimpleType) => {
        if(selectedSubunits.find(s => s.id === subunit.id)) return
        setSelectedSubunits([...selectedSubunits, subunit])
        setSubunitQuery("")
    }

    return (
        <>
            <div className="flex flex-col w-full">
                <label htmlFor="unit-select">Related Units (Optional)</label>
                <div id="unit-input-wrapper" className="flex flex-col gap-y-2">
                    <input 
                        type="text" className="border-1 border-primary outline-none p-2" id="unit-select"
                        value={unitQuery} onChange={(e) => setUnitQuery(e.target.value)}
                        onFocus={() => setUnitIsFocused(true)}
                    />
                    <div className="flex flex-wrap gap-2">
                        { selectedUnits.map((unit) => (
                            <div key={unit.id} className="flex flex-row justify-between items-center gap-x-2 p-2 rounded-md bg-primary text-white">
                                {unit.name}
                                <CiCircleRemove className="icon-responsive hover:cursor-pointer text-3xl" onClick={() => setSelectedUnits(selectedUnits.filter(u => u.id !== unit.id))} />
                            </div>
                        ))}
                    </div>
                    {unitIsFocused && selectedUnits.length !== units.length && <div className="flex flex-col border-1 border-primary rounded-md bg-white">
                        {filteredUnits.length > 0 && filteredUnits.map((option: UnitSimpleType) => (
                            <option 
                                key={option.id} className="flex flex-row items-center w-full gap-x-2 p-2 border-b-1 border-b-primary last-of-type:border-none hover:cursor-pointer hover:bg-gray-100"
                                onClick={() => handleAddUnit(option)}
                            >
                                {option.name}
                            </option>
                        ))}
                        {units.length === 0 && <div className="flex p-2 border-primary rounded-md bg-white">
                            No Available Units
                        </div>}
                    </div>}
                </div>
            </div>
            <div className="flex flex-col w-full">
                <label htmlFor="subunit-select">Related Subunits (Optional)</label>
                <div id="subunit-input-wrapper" className="flex flex-col gap-y-2">
                    <input 
                        type="text" className="border-1 border-primary outline-none p-2" id="unit-select"
                        value={subunitQuery} onChange={(e) => setSubunitQuery(e.target.value)}
                        onFocus={() => setSubunitIsFocused(true)}
                    />
                    <div className="flex flex-wrap gap-2">
                        { selectedSubunits.map((subunit) => (
                            <div key={subunit.id} className="flex flex-row justify-between items-center gap-x-2 p-2 rounded-md bg-primary text-white">
                                {subunit.name}
                                <CiCircleRemove className="icon-responsive hover:cursor-pointer text-3xl" onClick={() => setSelectedSubunits(selectedUnits.filter(s => s.id !== subunit.id))} />
                            </div>
                        ))}
                    </div>
                    {subunitIsFocused && selectedSubunits.length !== subunits.length && <div className="flex flex-col border-1 border-primary rounded-md bg-white">
                        {filteredSubunits.length > 0 && filteredSubunits.map((option: SubunitSimpleType) => (
                            <option 
                                key={option.id} className="flex flex-row items-center w-full gap-x-2 p-2 border-b-1 border-b-primary last-of-type:border-none hover:cursor-pointer hover:bg-gray-100"
                                onClick={() => handleAddSubunit(option)}
                            >
                                {option.name}
                            </option>
                        ))}
                        {subunits.length === 0 && <div className="flex p-2 border-primary rounded-md bg-white">
                            No Available Subunits
                        </div>}
                    </div>}
                </div>
            </div>
        </>
    )
}