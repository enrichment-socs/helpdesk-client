import { XCircleIcon } from '@heroicons/react/solid';
import { ReactNode } from 'react';
import clsx from 'clsx';

type Props = {
  children: ReactNode;
  className?: string;
};

export default function ErrorAlert({ children, className = '' }: Props) {
  return (
    <div
      className={clsx(
        'rounded-md border border-red-200 bg-red-50 p-4',
        className
      )}>
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">{children}</div>
      </div>
    </div>
  );
}
