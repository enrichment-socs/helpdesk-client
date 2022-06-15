import { InformationCircleIcon } from '@heroicons/react/solid';

type Props = {
  message: string;
  className?: string;
};

export default function InfoAlert({ message, className }: Props) {
  return (
    <div
      className={`rounded-md bg-blue-50 p-4 border border-blue-400 ${
        className ?? ''
      }`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon
            className="h-5 w-5 text-blue-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p
            className="text-sm text-blue-700"
            dangerouslySetInnerHTML={{ __html: message }}></p>
        </div>
      </div>
    </div>
  );
}
