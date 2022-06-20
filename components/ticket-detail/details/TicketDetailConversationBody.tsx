import { DownloadIcon } from '@heroicons/react/solid';
import { OutlookMessage } from '../../../models/OutlookMessage';
import { OutlookMessageAttachmentValue } from '../../../models/OutlookMessageAttachment';
import { DownloadHelper } from '../../../shared/libs/download-helper';

type Props = {
  message: OutlookMessage;
  attachments: OutlookMessageAttachmentValue[];
  useUniqueBody?: boolean;
};

const TicketDetailConversationBody = ({
  message,
  attachments,
  useUniqueBody = true,
}: Props) => {
  const downloadAttachment = (attachment: OutlookMessageAttachmentValue) => {
    DownloadHelper.download(
      attachment.name,
      attachment.contentBytes,
      attachment.contentType
    );
  };

  return (
    <div className="pt-2">
      <div>
        <div
          className="max-h-[42rem] overflow-auto"
          dangerouslySetInnerHTML={{
            __html: useUniqueBody
              ? message.uniqueBody.content
              : message.body.content,
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
    </div>
  );
};

export default TicketDetailConversationBody;
