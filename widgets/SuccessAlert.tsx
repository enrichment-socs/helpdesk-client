import { CheckCircleIcon } from '@heroicons/react/solid';

type Props = {
  message: string;
  className?: string;
};

export default function SuccessAlert({ message, className }: Props) {
  return (
    <div
      className={`rounded-md bg-green-50 p-4 border border-green-400 ${
        className ?? ''
      }`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon
            className="h-5 w-5 text-green-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <p
            className="text-sm font-medium text-green-800"
            dangerouslySetInnerHTML={{ __html: message }}></p>
        </div>
      </div>
    </div>
  );
}
