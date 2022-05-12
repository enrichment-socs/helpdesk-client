type Props = {
  width?: string;
  height?: string;
};

export default function SkeletonLoading({
  width = '240px',
  height = '20px',
}: Props) {
  return (
    <div
      style={{ width, height }}
      className="rounded bg-gray-300 animate-pulse"></div>
  );
}
