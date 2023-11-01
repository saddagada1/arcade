import TetrisProvider from "./tetris/context";

interface ContextsProviderProps {
  children: React.ReactNode;
}

const Contexts: React.FC<ContextsProviderProps> = ({ children }) => {
  return <TetrisProvider>{children}</TetrisProvider>;
};

export default Contexts;
