const rowBtnClasses =
  "flex justify-center items-center py-2 px-3 text-sm text-blue-500/60 hover:text-blue-500 transition-colors cursor-pointer";

export default function LoadMore({
  direction,
  onClick,
  onGoToTop,
}: {
  direction: "up" | "down";
  onClick: () => void;
  onGoToTop?: () => void;
}) {
  return (
    <tr className="bg-blue-500/5">
      <td colSpan={6} className="p-0">
        <div className="flex justify-center items-center gap-2">
          <button onClick={onClick} className={rowBtnClasses}>
            {direction === "up" ? "↑ Load previous 5" : "↓ Load next 5"}
          </button>
          {onGoToTop && (
            <>
              <span className="text-blue-500/20">|</span>
              <button onClick={onGoToTop} className={rowBtnClasses}>
                ↑↑ Go to top
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
