import { RiErrorWarningFill } from "react-icons/ri";

export default function ErrorPage({ message }: { message?: string}){
    return (
        <div className="full-screen-wrapper flex flex-col justify-center items-center gap-y-4">
          <div className="flex flex-col justify-center items-center gap-y-4">
            <div className="flex items-center w-full justify-center">
              <div className="flex-1 border-t-2 border-secondary mr-2"></div>
              <RiErrorWarningFill className="text-secondary text-[5rem]" />
              <div className="flex-1 border-t-2 border-secondary ml-2"></div>
            </div>
            <div className="flex flex-col gap-y-2 items-center w-full">
              <p className="text-primary text-2xl font-bold text-center">{message}</p>
              <p className="text-primary text-lg text-center">
                Sorry for the inconvenience. Please refresh or try again later
              </p>
            </div>
          </div>
        </div>
      );
}