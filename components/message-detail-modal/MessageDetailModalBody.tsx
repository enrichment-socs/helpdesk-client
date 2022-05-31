import { DownloadIcon } from '@heroicons/react/solid';
import { OutlookMessage } from '../../models/OutlookMessage';
import { OutlookMessageAttachmentValue } from '../../models/OutlookMessageAttachment';
import { DownloadHelper } from '../../shared/libs/download-helper';
import MessageAttachmentList from '../../widgets/MessageAttachmentList';
import MultiLineSkeletonLoading from '../../widgets/MultiLineSkeletonLoading';

type Props = {
  message: OutlookMessage;
  attachments: OutlookMessageAttachmentValue[];
};

export default function MessageDetailModalBody({
  message,
  attachments,
}: Props) {
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

                <MessageAttachmentList attachments={attachments} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
