import { ChangeEvent } from "react"

export default function FRQRubricGrade({ awardedPoints, setAwardedPoints, totalPossiblePoints, criteria, status }: {
    awardedPoints: number,
    setAwardedPoints: (newAwardedPoints: number) => void,
    totalPossiblePoints: number,
    criteria: string,
    status: "Pending" | "Graded"
}){
    const handlePointInput = (e: ChangeEvent<HTMLInputElement>) => {
        if(status === 'Graded') return
        const parsedInt = parseInt(e.target.value)
        if(parsedInt < 0 || parsedInt > totalPossiblePoints)    return
        setAwardedPoints(parsedInt)
    }
    return (
        <div className="flex flex-row items-center gap-x-4 border-b-1 border-b-primary last-of-type:border-b-0">
            <div className="flex flex-row items-center gap-x-2 py-2">
                <label htmlFor="awarded-points">Points: </label>
                <input 
                    type="number" id="awarded-points" disabled={status === 'Graded'}
                    className={`aspect-[2/1] w-[50px] p-1 border-1 border-primary outline-none text-right ${status === 'Graded' && 'cursor-not-allowed'}`}
                    value={awardedPoints} onChange={handlePointInput}
                />
                <span className="whitespace-nowrap">/ {totalPossiblePoints}</span>
            </div>
            <p className="text-md">
                Criteria: {criteria}
            </p>
        </div>
    )
}