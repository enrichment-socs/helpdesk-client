import { DownloadIcon } from '@heroicons/react/solid';
import { OutlookMessageAttachmentValue } from '../models/OutlookMessageAttachment';
import { DownloadHelper } from '../shared/libs/download-helper';

type Props = {
  attachments: OutlookMessageAttachmentValue[];
};

export default function MessageAttachmentList({ attachments }: Props) {
  const downloadAttachment = (attachment: OutlookMessageAttachmentValue) => {
    DownloadHelper.download(
      attachment.name,
      attachment.contentBytes,
      attachment.contentType
    );
  };

  return (
    <ul className="flex flex-wrap space-x-2">
      {attachments
        .filter((att) => !att.isInline)
        .map((attachment, idx) => (
          <li key={idx}>
            <button
              onClick={() => downloadAttachment(attachment)}
              className="flex space-x-2 items-center border border-blue-100 py-2 px-4 text-sm rounded bg-blue-100 hover:bg-blue-200">
              <span>{attachment.name}</span>
              <DownloadIcon className="w-4 h-4 ml-2" />
            </button>
          </li>
        ))}
    </ul>
  );
}
