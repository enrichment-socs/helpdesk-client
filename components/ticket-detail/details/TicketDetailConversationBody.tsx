import { ReplyIcon } from '@heroicons/react/outline';
import { DownloadIcon } from '@heroicons/react/solid';
import { OutlookMessage } from '../../../models/OutlookMessage';
import { OutlookMessageAttachmentValue } from '../../../models/OutlookMessageAttachment';
import { DownloadHelper } from '../../../shared/libs/download-helper';
import MessageAttachmentList from '../../../widgets/MessageAttachmentList';

type Props = {
  message: OutlookMessage;
  attachments: OutlookMessageAttachmentValue[];
  useUniqueBody?: boolean;
  showControl?: boolean;
};

const TicketDetailConversationBody = ({
  message,
  attachments,
  useUniqueBody = true,
  showControl = false,
}: Props) => {
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

            {attachments && <MessageAttachmentList attachments={attachments} />}
          </div>
        )}
      </div>

      {showControl && (
        <div className="flex justify-end">
          <button className="flex items-center bg-primary hover:bg-primary-dark text-white rounded px-3 py-1">
            Reply <ReplyIcon className="w-4 h-4 ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TicketDetailConversationBody;
