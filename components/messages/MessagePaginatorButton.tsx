type Props = {
  number: number;
  changePage: (number: number) => void;
  currentPageNumber: number;
};

export default function MessagePaginatorButton({
  number,
  changePage,
  currentPageNumber,
}: Props) {
  return (
    <button
      onClick={() => changePage(number)}
      className={`${
        number === currentPageNumber
          ? 'bg-primary text-white'
          : 'hover:bg-gray-50 text-gray-700'
      } relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium`}>
      {number}
    </button>
  );
}
