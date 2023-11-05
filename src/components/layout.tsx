import Head from "next/head";
import { Github } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import Avatar from "boring-avatars";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import PageTransition from "./pageTransition";
import Orbs from "./orbs";

const SideNavbar = () => {
  return (
    <nav className="mr-2 hidden w-[300px] shrink-0 flex-col justify-end border lg:flex">
      <Orbs
        identifier="side-nav-orb"
        bounds={30}
        blur="backdrop-blur-2xl"
        size="w-2/5"
        className="w-full border-b"
      />
      <div className="relative flex-1 p-2">
        <Link href="/" className="text-2xl font-medium">
          Arcade
        </Link>
        <p className="mt-4 text-sm">
          A growing collection of video games created using JavaScript, WebGL,
          or Unreal Engine.
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

const Navbar: React.FC = () => {
  return (
    <nav className="mb-2 flex h-[80px] w-full shrink-0 justify-between gap-2 border p-2 lg:hidden">
      <Orbs identifier="nav-orb" bounds={5} className="h-full border" />
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Menu</Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-3/4 p-2">
          <Link href="/" className="text-2xl font-medium">
            Arcade
          </Link>
          <p className="mt-4 text-sm">
            A growing collection of video games created using JavaScript, WebGL,
            or Unreal Engine.
          </p>
          <div className="mt-12 space-y-2">
            <Button variant="nav" size="nav" asChild>
              <Link href="/" className="flex gap-2">
                <Avatar square name="Library" />
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
                <Avatar square name="Tetris" />
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
                <Avatar square name="Saivamsi" />
                <div>
                  <p className="text-sm">Portfolio</p>
                  <p className="font-normal text-destructive">
                    View my Personal Portfolio.
                  </p>
                </div>
              </Link>
            </Button>
          </div>
          <div className="relative mt-auto">
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
        </SheetContent>
      </Sheet>
    </nav>
  );
};

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
      <div className="flex h-screen w-screen flex-col p-2 font-sans lg:flex-row">
        <SideNavbar />
        <Navbar />
        {children}
        <PageTransition />
      </div>
    </>
  );
};
export default Layout;
