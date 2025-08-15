export default function QuizzesLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>){
    return (
        <div className="flex flex-col w-full items-center py-10 px-5 scroll-auto">
            {children}
        </div>
    )
  }