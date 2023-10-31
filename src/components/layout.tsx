import Head from "next/head";
import { Inter, JetBrains_Mono } from "next/font/google";
import { cn } from "~/utils/helpers";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

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
        <title>Tetris</title>
        <meta name="description" content="Tetris - Saivamsi Addagada" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={cn(
          "h-screen w-screen font-sans",
          sans.variable,
          mono.variable,
        )}
      >
        {children}
      </div>
    </>
  );
};
export default Layout;
