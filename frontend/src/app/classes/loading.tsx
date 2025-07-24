export default async function LoadingClasses(){
    const cards = new Array(20).fill(1)
    return (
        <div className="flex flex-col w-full gap-y-5">
            <header className="w-full text-2xl text-black">
                <h1>Loading Classes</h1>
            </header>
            <div className="default-grid gap-8">
                {
                    cards.map((card, i) => (
                        <div className="card w-full aspect-square loading" key={i}>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}