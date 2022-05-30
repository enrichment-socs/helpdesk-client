import { OutlookMessage } from "../../../models/OutlookMessage";
import { OutlookMessageAttachmentValue } from "../../../models/OutlookMessageAttachment";
import { DownloadHelper } from "../../../shared/libs/download-helper";

type Props = {
    message: OutlookMessage;
}

const RequestDetailConversationBody = ({ message } : Props) => {
    
    const downloadAttachment = (attachment: OutlookMessageAttachmentValue) => {
        DownloadHelper.download(
            attachment.name,
            attachment.contentBytes,
            attachment.contentType,
        )
    }

    return (
        <div className="pt-2">
            <div>
                <div className="max-h-[42rem] overflow-auto" dangerouslySetInnerHTML={{
                    __html: message.body.content,
                }}>
                </div>
            </div>
        </div>
    );
}

export default RequestDetailConversationBody;