import { type HTMLAttributes } from "react";
import { PongSpinner } from "react-spinners-kit";
import { cn } from "~/utils/helpers";

type LoadingProps = HTMLAttributes<HTMLDivElement>;

const Loading: React.FC<LoadingProps> = ({ ...rest }) => {
  const { className, ...props } = rest;
  return (
    <div
      {...props}
      className={cn(
        "flex flex-1 flex-col items-center justify-center ",
        className,
      )}
    >
      <PongSpinner />
    </div>
  );
};

export default Loading;
