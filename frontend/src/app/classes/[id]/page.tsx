import { ClassType } from "../../../../types/Sections"
import ClassClientShell from "./ClassClientShell";

export default async function Page({ params } : { params: { id: string}}){
    const { id } = await params
    const classInfo: ClassType = {
        id: "class-101",
        name: "Biology 101",
        course_number: "BIO101",
        join_code: "BIO123",
        members: [
          { id: "m1", name: "Alice" },
          { id: "m2", name: "Bob" }
        ],
        units: [
          {
            id: "unit-1",
            class_id: "class-101",
            name: "Cell Biology",
            course_number: "BIO101-U1",
            members: [
              { id: "m1", name: "Alice" }
            ],
            subunits: [
              {
                id: "subunit-1",
                unit_id: "unit-1",
                name: "Cell Structure",
                course_number: "BIO101-U1-S1",
                members: [
                  { id: "m2", name: "Bob" }
                ],
                note_category: 
                  {
                    id: "cat-1",
                    section_id: "section-1",
                    section: "Subunit",
                    notes: [
                      {
                        id: "note-1",
                        owner: { id: "m1", name: "Alice" },
                        category_id: "cat-1",
                        updated_date: "2025-07-04",
                        file: {
                          name: "cell-structure.pdf",
                          previewUrl: "/Activity 6_ sed _ Part 1.pdf",
                        }
                      }
                    ]
                    }
                }
            ],
            note_category: {
                id: "cat-1",
                section_id: "section-1",
                section: "Subunit",
                notes: [
                  {
                    id: "note-1",
                    owner: { id: "m1", name: "Alice" },
                    category_id: "cat-1",
                    updated_date: "2025-07-04",
                    file: {
                      name: "cell-structure.pdf",
                      previewUrl: "/Activity 6_ sed _ Part 1.pdf",
                    }
                  },
                  {
                    id: "note-5",
                    owner: { id: "m1", name: "Alice" },
                    category_id: "cat-1",
                    updated_date: "2025-07-04",
                    file: {
                      name: "cell-structure.pdf",
                      previewUrl: "/Activity 6_ sed _ Part 1.pdf",
                    }
                  },
                  {
                    id: "note-2",
                    owner: { id: "m1", name: "Alice" },
                    category_id: "cat-1",
                    updated_date: "2025-07-04",
                    file: {
                      name: "cell-structure.pdf",
                      previewUrl: "/Activity 6_ sed _ Part 1.pdf",
                    }
                  },
                  {
                    id: "note-3",
                    owner: { id: "m1", name: "Alice" },
                    category_id: "cat-1",
                    updated_date: "2025-07-04",
                    file: {
                      name: "cell-structure.pdf",
                      previewUrl: "/Activity 6_ sed _ Part 1.pdf",
                    }
                  },
                  {
                    id: "note-4",
                    owner: { id: "m1", name: "Alice" },
                    category_id: "cat-1",
                    updated_date: "2025-07-04",
                    file: {
                      name: "cell-structure.pdf",
                      previewUrl: "/Activity 6_ sed _ Part 1.pdf",
                    }
                  },
                ]
                }
            },
            {
                id: "unit-2",
                class_id: "class-101",
                name: "Cell Biology",
                course_number: "BIO101-U1",
                members: [
                  { id: "m1", name: "Alice" }
                ],
                subunits: [
                  {
                    id: "subunit-1",
                    unit_id: "unit-1",
                    name: "Cell Structure",
                    course_number: "BIO101-U1-S1",
                    members: [
                      { id: "m2", name: "Bob" }
                    ],
                    note_category: 
                      {
                        id: "cat-1",
                        section_id: "section-1",
                        section: "Subunit",
                        notes: [
                          {
                            id: "note-1",
                            owner: { id: "m1", name: "Alice" },
                            category_id: "cat-1",
                            updated_date: "2025-07-04",
                            file: {
                              name: "cell-structure.pdf",
                              previewUrl: "/Activity 6_ sed _ Part 1.pdf",
                            }
                          }
                        ]
                        }
                    }
                ],
                note_category: {
                    id: "cat-1",
                    section_id: "section-1",
                    section: "Subunit",
                    notes: [
                      {
                        id: "note-1",
                        owner: { id: "m1", name: "Alice" },
                        category_id: "cat-1",
                        updated_date: "2025-07-04",
                        file: {
                          name: "cell-structure.pdf",
                          previewUrl: "/Activity 6_ sed _ Part 1.pdf",
                        }
                      }
                    ]
                    }
                },
        ],
        note_category: {
            id: "cat-1",
            section_id: "section-1",
            section: "Subunit",
            notes: [
                {
                id: "note-1",
                owner: { id: "m1", name: "Alice" },
                category_id: "cat-1",
                updated_date: "2025-07-04",
                file: {
                    name: "cell-structure.pdf",
                    previewUrl: "/Activity 6_ sed _ Part 1.pdf",
                }
                }
            ]
        }
      };

    return (
        <ClassClientShell classInfo={classInfo} />
    )
}