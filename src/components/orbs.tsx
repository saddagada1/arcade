import { useEffect, type HTMLAttributes } from "react";
import gsap from "gsap";
import { cn } from "~/utils/helpers";

interface OrbsProps extends HTMLAttributes<HTMLDivElement> {
  identifier: string;
  bounds: number;
  blur?: string;
  size?: string;
}

const Orbs: React.FC<OrbsProps> = ({
  identifier,
  bounds,
  blur,
  size,
  ...props
}) => {
  const { className, ...rest } = props;

  useEffect(() => {
    const timeline = gsap.timeline();
    gsap.to(`.${identifier}`, {
      x: `random(-${bounds}, ${bounds}, 1)`,
      y: `random(-${bounds}, ${bounds}, 1)`,
      ease: "none",
      duration: 1,
      repeat: -1,
      repeatRefresh: true,
    });
    return () => {
      timeline.kill();
    };
  }, [bounds, identifier]);
  return (
    <div
      {...rest}
      className={cn(
        className,
        "relative flex aspect-square items-center justify-center overflow-hidden",
      )}
    >
      <div
        className={cn(
          "absolute aspect-square rounded-full bg-blue-500",
          identifier,
          size ?? "w-1/3",
        )}
      />
      <div
        className={cn(
          "absolute aspect-square rounded-full bg-red-500",
          identifier,
          size ?? "w-1/3",
        )}
      />
      <div
        className={cn(
          "absolute aspect-square rounded-full bg-yellow-500",
          identifier,
          size ?? "w-1/3",
        )}
      />
      <div
        className={cn(
          "absolute aspect-square rounded-full bg-purple-500",
          identifier,
          size ?? "w-1/3",
        )}
      />
      <div
        className={cn(
          "absolute aspect-square rounded-full bg-green-500",
          identifier,
          size ?? "w-1/3",
        )}
      />
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 top-0 h-full w-full",
          blur ?? "backdrop-blur-md",
        )}
      />
    </div>
  );
};
export default Orbs;
