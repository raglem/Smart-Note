import ClassCard from "../../components/Class/ClassCard"

const classes = [
    {
        id: "1",
        name: "Class 1",
        course_number: "1234",
        join_code: "123456",
        number_of_members: 1,
        number_of_notes: 1,
        latest_notes: [
            {
                name: "Note1.pdf",
                previewUrl: "/Activity 6_ sed _ Part 1.pdf",
            },
            {
                name: "Note1.pdf",
                previewUrl: "/Activity 6_ sed _ Part 1.pdf",
            },
        ],
    },
    {
        id: "2",
        name: "Class 2",
        course_number: "5678",
        join_code: "234567",
        number_of_members: 2,
        number_of_notes: 2,
        latest_notes: [],
    },
    {
        id: "3",
        name: "Class 3",
        course_number: "9101",
        join_code: "345678",
        number_of_members: 3,
        number_of_notes: 3,
        latest_notes: [],
    },
    {
        id: "4",
        name: "Class 4",
        course_number: "1121",
        join_code: "456789",
        number_of_members: 4,
        number_of_notes: 4,
        latest_notes: [],
    },
    {
        id: "5",
        name: "Class 5",
        course_number: "3141",
        join_code: "567890",
        number_of_members: 5,
        number_of_notes: 5,
        latest_notes: [],
    }
]
export default function Page(){
    return (
        <div className="flex flex-col w-full gap-y-5">
            <header className="flex flex-row justify-between items-center">
                <h1>Classes</h1>
                <div className="input-wrapper">
                    <input type="text" placeholder="Enter Class ID" className="p-2 outline-none"/>
                    <button className="h-full box-border p-2 bg-black text-white border rounded-md">
                        Join
                    </button>
                </div>
            </header>
            <div className="default-grid gap-8">
                {
                    classes.map((classItem) => (
                        <ClassCard key={classItem.id} params={classItem} />
                    ))
                }
            
            </div>
        </div>
    )
}