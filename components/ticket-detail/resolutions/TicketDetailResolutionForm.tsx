import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Ticket } from '../../../models/Ticket';
import { CreateTicketResolutionDto } from '../../../models/dto/ticket-resolutions/create-ticket-resolution.dto';
import { OutlookMessage } from '../../../models/OutlookMessage';
import { TicketResolution } from '../../../models/TicketResolution';
import { SessionUser } from '../../../models/SessionUser';
import { TicketResolutionService } from '../../../services/TicketResolutionService';
import { EMAIL_REGEX } from '../../../shared/constants/regex';
import { confirm } from '../../../shared/libs/confirm-dialog-helper';
const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const modules = {
  toolbar: [
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image', 'video'],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};

type Props = {
  ticket: Ticket;
  setResolution: Dispatch<SetStateAction<TicketResolution>>;
  firstOutlookMessage: OutlookMessage;
};

export default function TicketDetailResolutionForm({
  ticket,
  setResolution,
  firstOutlookMessage,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  type FormData = {
    resolution: string;
    subject?: string;
    toRecipients?: string;
    ccRecipients?: string;
  };

  const [alsoSentAsEmail, setAlsoSentAsEmail] = useState(false);
  const resolutionContent = watch('resolution') || '';
  const onResolutionChange = (value) => setValue('resolution', value);
  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const resolutionService = new TicketResolutionService(user?.accessToken);

  useEffect(() => {
    register('resolution', { required: true });
    setValue('subject', `Re: ${ticket.subject}`);
    setValue('ccRecipients', '');
    setValue('toRecipients', '');
  }, []);

  const emailFormValidation = (forToRecipients: boolean) => {
    const validations = {
      required: (v) => {
        if (!alsoSentAsEmail) return true;
        return v !== '' || 'Recipients field is required';
      },
      seperatedBySemiColon: (v) => {
        if (!alsoSentAsEmail) return true;
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

  const onSubmit: SubmitHandler<FormData> = async (payload) => {
    const message = `Are you sure you want to save this resolution ? This resolution will <b>${
      alsoSentAsEmail ? 'also be send' : 'not be send'
    }</b> as email`;

    const dto: CreateTicketResolutionDto = {
      ticketId: ticket.id,
      ccRecipients: alsoSentAsEmail ? payload.ccRecipients : null,
      toRecipients: alsoSentAsEmail ? payload.toRecipients : null,
      subject: alsoSentAsEmail ? payload.subject : null,
      conversationId: firstOutlookMessage.conversationId,
      resolution: payload.resolution,
      sentToEmail: alsoSentAsEmail,
    };
    if (await confirm(message)) {
      toast.promise(resolutionService.add(dto), {
        success: (result) => {
          setResolution(result);
          return 'Resolution saved succesfully!';
        },
        loading: 'Saving resolution...',
        error: (e) => e.toString(),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="text-sm mt-4">
      <div className="divide-y border-b-2">
        <div className="font-bold p-2 px-4 rounded-t bg-gray-200">
          Input Resolution
        </div>
        <div className="border-2 p-4">
          <label className="block text-sm font-medium text-gray-700">
            Resolution
          </label>
          <QuillNoSSRWrapper
            modules={modules}
            theme="snow"
            value={resolutionContent}
            onChange={(content) => onResolutionChange(content)}
          />
          {errors?.resolution && (
            <small className="text-red-500">Resolution field is required</small>
          )}

          <div className="mt-2">
            <label className="flex space-x-2 items-center inline-block">
              <input
                onChange={() => setAlsoSentAsEmail(!alsoSentAsEmail)}
                type="checkbox"
              />
              <div>Also sent as email</div>
            </label>
          </div>

          {alsoSentAsEmail && (
            <section className="border border-gray-300 mt-6 rounded">
              <h3 className="font-semibold border-b p-2 bg-gray-50">
                Email details
              </h3>

              <section className="space-y-3 p-2 pb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className={`${
                        errors?.subject ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm px-2 py-1 block w-full sm:text-sm border rounded outline-none`}
                      {...register('subject', {
                        validate: (value) => {
                          if (alsoSentAsEmail) {
                            return value !== '';
                          }
                          return true;
                        },
                      })}
                    />
                  </div>
                  {errors?.subject && (
                    <small className="text-red-500">
                      Subject field is required
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
                        errors?.toRecipients
                          ? 'border-red-300'
                          : 'border-gray-300'
                      } shadow-sm px-2 py-1 block w-full sm:text-sm border rounded outline-none`}
                      {...register('toRecipients', {
                        validate: emailFormValidation(true),
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
                    Cc Recipients (seperated by semicolon)
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className={`${
                        errors?.ccRecipients
                          ? 'border-red-300'
                          : 'border-gray-300'
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
              </section>
            </section>
          )}

          <div className="mt-4 text-right">
            <button
              type="submit"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              Save Resolution
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
