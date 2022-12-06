import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { replyRecipientsAtom } from '../../../atom';
import { ReplyMessageDto } from '../../../models/dto/messages/reply-message.dto';
import { GraphApiService } from '../../../services/GraphApiService';
import { EMAIL_REGEX } from '../../../shared/constants/regex';
import { confirm } from '../../../shared/libs/confirm-dialog-helper';
import { useSession } from 'next-auth/react';
import { SessionUser } from '../../../models/SessionUser';
import toast from 'react-hot-toast';
import { useRouter } from 'next/dist/client/router';
import { ClientPromiseWrapper } from '../../../shared/libs/client-promise-wrapper';
import { toBase64 } from '../../../shared/libs/file-utils';
import { AddAttachmentDto } from '../../../models/dto/messages/add-attachment.dto';
import InfoAlert from '../../../widgets/InfoAlert';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const modules = {
  toolbar: [
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
  ],
  clipboard: {
    matchVisual: false,
  },
};

type FormData = {
  message: string;
  ccRecipients: string;
  toRecipients?: string;
  messageId: string;
  attachments: FileList;
};
const TicketDetailReply = () => {
  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const [replyRecipients] = useAtom(replyRecipientsAtom);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const router = useRouter();

  useEffect(() => {
    setValue('toRecipients', replyRecipients.toRecipients);
    setValue('ccRecipients', replyRecipients.ccRecipients);
    setValue('messageId', replyRecipients.messageId);
  }, [replyRecipients, setValue]);

  useEffect(() => {
    register('message', { required: true });
    setValue('message', '<br><br>Best Regards,<br><b>Enrichment SoCS</b>');
  }, [register, setValue]);

  const messageContent = watch('message') || '';
  const onMessageChange = (value) => setValue('message', value);

  const emailFormValidation = (forToRecipients: boolean) => {
    const validations = {
      seperatedBySemiColon: (v) => {
        if (!forToRecipients && !v) return true;
        const emails: string[] = v.trim().split(';');
        return (
          emails.every((email) => email.match(EMAIL_REGEX)) ||
          'Email must be in valid format'
        );
      },
    };

    if (forToRecipients) return validations;
    return { seperatedBySemiColon: validations.seperatedBySemiColon };
  };

  const validateAttachments = (files: FileList) => {
    if (files.length > 0) {
      const isMoreThanThreeMB = Array.from(files).some((file) => {
        const sizeInMB = file.size / 1024 / 1024;
        return sizeInMB > 3;
      });

      return !isMoreThanThreeMB;
    }
    return true;
  };

  const onSubmit: SubmitHandler<FormData> = async ({
    ccRecipients,
    toRecipients,
    message: content,
    attachments,
  }) => {
    if (
      await confirm(
        'Please <b>double check</b> to and cc recipients. Are you sure you want to reply ?'
      )
    ) {
      const graphService = new GraphApiService(user.accessToken);
      const dto: ReplyMessageDto = {
        message: {
          body: {
            contentType: 'html',
            content,
          },
          ccRecipients:
            ccRecipients.length > 0
              ? ccRecipients.split(';').map((address) => {
                  return {
                    emailAddress: {
                      address,
                    },
                  };
                })
              : [],
          toRecipients: toRecipients.split(';').map((address) => {
            return {
              emailAddress: {
                address,
              },
            };
          }),
        },
      };

      const wrapper = new ClientPromiseWrapper(toast);
      const createReplyToast = toast('Creating reply draft...', { icon: '🔄' });
      const draftMessageId = await wrapper.handle(
        graphService.createReply(replyRecipients.messageId, dto)
      );
      toast.dismiss(createReplyToast);

      const hasAttachments = attachments.length > 0;
      if (hasAttachments) {
        const uploadAttachmentsToast = toast('Uploading attachments', {
          icon: '🔄',
        });

        for (let attachment of Array.from(attachments)) {
          const base64bytes = await toBase64(attachment);
          const contentBytes = base64bytes.split('base64,')[1];
          const payload: AddAttachmentDto = {
            contentBytes,
            contentType: attachment.type,
            name: attachment.name,
            size: attachment.size,
            isInline: false,
          };

          await graphService.addAttachments(draftMessageId, payload);
        }

        toast.dismiss(uploadAttachmentsToast);
      }

      const sendReplyToast = toast('Sending reply...', { icon: '🔄' });
      await wrapper.handle(graphService.send(draftMessageId));
      toast.dismiss(sendReplyToast);

      toast.success('Message replied!');
      router.reload();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="text-sm">
      <div>
        <section className="flex flex-col space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message ID
            </label>
            <div className="mt-1">
              <input
                disabled={true}
                type="text"
                className={`${
                  errors?.messageId ? 'border-red-300' : 'border-gray-300'
                } shadow-sm px-2 py-1 block w-full sm:text-sm border rounded outline-none`}
                {...register('messageId', { required: true })}
              />
            </div>
            {errors?.messageId && (
              <small className="text-red-500">
                Please select a message by clicking &lsquo;reply&rsquo; button
                on a message
              </small>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              To Recipients (seperated by semicolon)
            </label>
            <div className="mt-1">
              <input
                type="text"
                className={`${
                  errors?.toRecipients ? 'border-red-300' : 'border-gray-300'
                } shadow-sm px-2 py-1 block w-full sm:text-sm border rounded outline-none`}
                {...register('toRecipients', {
                  validate: emailFormValidation(true),
                  required: {
                    value: true,
                    message: 'To recipients field must be filled',
                  },
                })}
              />
            </div>
            {errors?.toRecipients && (
              <small className="text-red-500">
                {errors?.toRecipients?.message}
              </small>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              CC Recipients (seperated by semicolon)
            </label>
            <div className="mt-1">
              <input
                type="text"
                className={`${
                  errors?.ccRecipients ? 'border-red-300' : 'border-gray-300'
                } shadow-sm px-2 py-1 block w-full sm:text-sm border rounded outline-none`}
                {...register('ccRecipients', {
                  validate: emailFormValidation(false),
                })}
              />
            </div>
            {errors?.ccRecipients && (
              <small className="text-red-500">
                {errors?.ccRecipients?.message}
              </small>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Body
            </label>
            <InfoAlert
              className="my-2"
              message="Do not copy image to the text field, it will broke the message, upload attachment(s) instead!"
            />
            <QuillNoSSRWrapper
              modules={modules}
              theme="snow"
              value={messageContent}
              onChange={(content) => onMessageChange(content)}
            />
            {errors?.message && (
              <small className="text-red-500">Message field is required</small>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Attachments
            </label>
            <input
              {...register('attachments', {
                validate: validateAttachments,
              })}
              type="file"
              className="border border-gray-300 p-2 rounded w-full"
              multiple
            />
            {errors?.attachments && (
              <small className="text-red-500">
                File size must be less than 3 MB
              </small>
            )}
          </div>
        </section>

        <div className="text-right mt-4">
          <button
            type="submit"
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            Send Reply
          </button>
        </div>
      </div>
    </form>
  );
};

export default TicketDetailReply;
