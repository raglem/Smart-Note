import { LuFolderX } from "react-icons/lu";

export default function Empty({ message }: { message?: string}){
    return (
        <div className="flex flex-col justify-center items-center gap-y-4">
          <div className="flex flex-col justify-center items-center gap-y-4">
            <div className="flex items-center w-full justify-center">
              <div className="flex-1 border-t-2 border-secondary mr-2"></div>
              <LuFolderX className="text-secondary text-[5rem] md:text-[8rem] xl:text-[10rem]" />
              <div className="flex-1 border-t-2 border-secondary ml-2"></div>
            </div>
            <div className="flex flex-col gap-y-2 items-center w-full">
              <p className="text-primary text-2xl font-normal text-center">{message}</p>
            </div>
          </div>
        </div>
      );
}