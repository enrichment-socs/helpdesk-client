type Props = {
  containerWidth?: string;
  lineCount?: number;
  width?: string;
  height?: string;
};

export default function MultiLineSkeletonLoading({
  containerWidth = '100%',
  lineCount = 5,
  width = '100%',
  height = '20px',
}: Props) {
  return (
    <div style={{ width: containerWidth }}>
      <ul className="flex flex-col space-y-2">
        {Array(lineCount)
          .fill(0)
          .map((line, idx) => (
            <li
              className="rounded bg-gray-300 animate-pulse"
              style={{ width, height }}
              key={idx}></li>
          ))}
      </ul>
    </div>
  );
}
