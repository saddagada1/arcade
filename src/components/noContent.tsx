import { type HTMLAttributes } from "react";
import { cn } from "~/utils/helpers";

const NoContent: React.FC<HTMLAttributes<HTMLParagraphElement>> = ({
  ...props
}) => {
  const { className, children, ...rest } = props;
  return (
    <p {...rest} className={cn("text-sm text-muted-foreground", className)}>
      {children}
    </p>
  );
};

export default NoContent;
