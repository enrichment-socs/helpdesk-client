import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/solid';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Else, If, Then } from 'react-if';
import CustomPaginatorButton from './CustomPaginatorButton';

type Props = {
  take: number;
  skip: number;
  setSkip: Dispatch<SetStateAction<number>>;
  totalCount: number;
  pageNumber: number;
  setPageNumber: Dispatch<SetStateAction<number>>;
  threeFirstPageNumbers: number[];
  setThreeFirstPageNumbers: Dispatch<SetStateAction<number[]>>;
  setItem: Dispatch<SetStateAction<any[]>>;
  fetchItem: (take: number, skip: number) => Promise<any[]>;
  isDisplayCount?: boolean;
  isDisplayBorderTop?: boolean;
};

export default function CustomPaginator({
  take,
  skip,
  totalCount,
  setSkip,
  pageNumber,
  setPageNumber,
  threeFirstPageNumbers,
  setThreeFirstPageNumbers,
  setItem,
  fetchItem,
  isDisplayCount = true,
  isDisplayBorderTop = true,
}: Props) {
  const session = useSession();

  const totalPage = Math.ceil(totalCount / take);
  const lastThreePageNumbers = [totalPage - 2, totalPage - 1, totalPage];

  const changePage = async (newPageNumber) => {
    if (pageNumber > totalPage) return totalPage;
    if (pageNumber < 1) return 1;

    if (newPageNumber >= totalPage - 4)
      setThreeFirstPageNumbers([totalPage - 5, totalPage - 4, totalPage - 3]);
    else if (newPageNumber <= 1) setThreeFirstPageNumbers([1, 2, 3]);
    else
      setThreeFirstPageNumbers([
        newPageNumber - 1,
        newPageNumber,
        newPageNumber + 1,
      ]);
    setPageNumber(newPageNumber);

    const newSkip = (newPageNumber - 1) * take;
    setSkip(newSkip);

    const item = await fetchItem(take, newSkip);
    setItem(item);
  };

  const renderStaticPagination = () => {
    return (
      <>
        {Array.from({ length: totalPage }, (_, i) => i + 1).map((number) => (
          <CustomPaginatorButton
            key={number}
            number={number}
            currentPageNumber={pageNumber}
            changePage={changePage}
          />
        ))}
      </>
    );
  };

  const renderDynamicPagination = () => {
    return (
      <>
        {threeFirstPageNumbers.map((number) => (
          <CustomPaginatorButton
            key={number}
            number={number}
            currentPageNumber={pageNumber}
            changePage={changePage}
          />
        ))}

        {!shouldRenderStaticPagination() && shouldTruncate() && (
          <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
            ...
          </span>
        )}

        {totalPage > 6 &&
          lastThreePageNumbers.map((number) => (
            <CustomPaginatorButton
              key={number}
              number={number}
              currentPageNumber={pageNumber}
              changePage={changePage}
            />
          ))}
      </>
    );
  };

  const shouldRenderStaticPagination = () => {
    return totalPage <= 6;
  };

  const shouldTruncate = () => {
    return totalPage - pageNumber >= 5;
  };

  return (
    <div className={`bg-white px-4 py-3 flex items-center justify-between ${isDisplayBorderTop ? "border-t border-gray-200" : ""} sm:px-6`}>
      <div className="flex-1 flex justify-between sm:hidden">
        {pageNumber !== 1 && (
          <button
            onClick={() => changePage(Math.max(pageNumber - 1, 1))}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500">
            Previous
          </button>
        )}

        {pageNumber < totalPage && (
          <button
            onClick={() => changePage(Math.min(pageNumber + 1, totalPage))}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500">
            Next
          </button>
        )}
      </div>
      <div className={`hidden sm:flex-1 sm:flex sm:items-center ${isDisplayCount ? "sm:justify-between" : "sm:justify-end"}`}>
        {isDisplayCount && (
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{totalCount !== 0 ? skip + 1 : 0}</span> to{' '}
              <span className="font-medium">
                {Math.min(skip + take, totalCount)}
              </span>{' '}
              of <span className="font-medium">{totalCount}</span> results
            </p>
          </div>
        )}
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination">
            <button
              onClick={() => changePage(1)}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <span className="sr-only">First</span>
              <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>

            <If condition={shouldRenderStaticPagination()}>
              <Then>{renderStaticPagination()}</Then>
              <Else>{renderDynamicPagination()}</Else>
            </If>

            <button
              onClick={() => changePage(totalPage)}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <span className="sr-only">Last</span>
              <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
