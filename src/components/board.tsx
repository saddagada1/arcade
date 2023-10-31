import {
  defaultCellCols,
  defaultCellRows,
  defaultCellSize,
} from "~/utils/constants";

const Board: React.FC = () => {
  return (
    <>
      <div
        style={{
          gridTemplateColumns: `repeat(${defaultCellCols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${defaultCellRows}, minmax(0, 1fr))`,
        }}
        className="grid border"
      >
        {Array.from({ length: 200 }).map((_, index) => (
          <div
            style={{
              width: defaultCellSize,
              height: defaultCellSize,
            }}
            key={index}
            className="border"
          />
        ))}
      </div>
    </>
  );
};
export default Board;
