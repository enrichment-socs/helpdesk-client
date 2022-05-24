import { DownloadIcon } from '@heroicons/react/solid';
import { OutlookMessage } from '../../models/OutlookMessage';
import { OutlookMessageAttachmentValue } from '../../models/OutlookMessageAttachment';
import { DownloadHelper } from '../../shared/libs/download-helper';
import MultiLineSkeletonLoading from '../../widgets/MultiLineSkeletonLoading';

type Props = {
  message: OutlookMessage;
  attachments: OutlookMessageAttachmentValue[];
};

export default function MessageDetailModalBody({
  message,
  attachments,
}: Props) {
  const downloadAttachment = (attachment: OutlookMessageAttachmentValue) => {
    DownloadHelper.download(
      attachment.name,
      attachment.contentBytes,
      attachment.contentType
    );
  };

  return (
    <div className="border border-gray-300 rounded mt-4">
      <div className="bg-gray-300 text-gray-700 p-2">Content</div>
      <div className="p-4">
        {!message ? (
          <MultiLineSkeletonLoading />
        ) : (
          <div>
            <div
              className="max-h-[42rem] overflow-auto"
              dangerouslySetInnerHTML={{
                __html: message.body.content,
              }}></div>

            {message.hasAttachments && (
              <div className="border-t border-gray-300 mt-4">
                <h3 className="font-semibold text-sm mt-4">Attachments</h3>

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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
