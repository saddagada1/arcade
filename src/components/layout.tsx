import Head from "next/head";
import { JetBrains_Mono } from "next/font/google";
import { cn } from "~/utils/helpers";
import { Github } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import Avatar from "boring-avatars";

const SideNavbar = () => {
  return (
    <nav className="flex w-[300px] shrink-0 flex-col justify-end border-r">
      <div className="dots-pattern relative flex aspect-square w-full items-center justify-center border-b">
        <div className="absolute aspect-square w-24 translate-x-3 animate-bounce rounded-full bg-orange-500" />
        <div className="absolute aspect-square w-24 translate-y-8 animate-spin rounded-full bg-red-500" />
        <div className="absolute aspect-square w-24 -translate-x-12 animate-ping rounded-full bg-yellow-500" />
        <div className="absolute aspect-square w-24 -translate-y-8 animate-spin rounded-full bg-purple-500" />
        <div className="absolute top-0 h-full w-full backdrop-blur-xl" />
      </div>
      <div className="relative flex-1 p-2">
        <Link href="/" className="text-2xl font-medium">
          Arcade
        </Link>
        <p className="mt-4 text-sm">
          A collection of games created with Javascript, Canvas and Unreal
          Engine.
        </p>
        <div className="mt-12 space-y-2">
          <Button variant="nav" size="nav" asChild>
            <Link href="/" className="flex gap-2">
              <Avatar size={40} square name="Library" />
              <div>
                <p className="text-sm">Library</p>
                <p className="font-normal text-destructive">
                  View the Entire Collection.
                </p>
              </div>
            </Link>
          </Button>
          <Button variant="nav" size="nav" asChild>
            <Link href="/tetris" className="flex gap-2">
              <Avatar size={40} square name="Tetris" />
              <div>
                <p className="text-sm">Tetris</p>
                <p className="font-normal text-destructive">
                  Recreation of the 1984 Classic.
                </p>
              </div>
            </Link>
          </Button>
          <Button variant="nav" size="nav" asChild>
            <Link href="https://saivamsi.ca" className="flex gap-2">
              <Avatar size={40} square name="Saivamsi" />
              <div>
                <p className="text-sm">Portfolio</p>
                <p className="font-normal text-destructive">
                  View my Personal Portfolio.
                </p>
              </div>
            </Link>
          </Button>
        </div>
        <p className="absolute bottom-2 left-2 text-xs">
          2<span className="text-destructive">@</span>23
        </p>
        <Button
          className="absolute bottom-2 right-2"
          variant="outline"
          size="icon"
          asChild
        >
          <Link href="https://github.com/saddagada1/arcade">
            <Github strokeWidth={1} />
          </Link>
        </Button>
      </div>
    </nav>
  );
};

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Head>
        <meta name="description" content="Arcade" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={cn("flex h-screen w-screen font-sans", mono.variable)}>
        <SideNavbar />
        {children}
      </div>
    </>
  );
};
export default Layout;
