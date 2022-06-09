import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Case } from '../../../models/Case';
import { OutlookMessage } from '../../../models/OutlookMessage';
import { EMAIL_REGEX } from '../../../shared/constants/regex';

type Prop = {
  currCase: Case;
  firstOutlookMessage: OutlookMessage;
};

const CaseDetailResolution = ({ currCase, firstOutlookMessage }: Prop) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  type FormData = {
    resolution: string;
    subject?: string;
    toRecipients?: string;
    ccRecipients?: string;
  };

  useEffect(() => {
    setValue('subject', `Re: ${currCase.subject}`);
  });

  const [alsoSentAsEmail, setAlsoSentAsEmail] = useState(false);

  const emailFormValidation = {
    required: (v) => {
      if (!alsoSentAsEmail) return true;
      return v !== '' || 'Recipients field is required';
    },
    seperatedBySemiColon: (v) => {
      if (!alsoSentAsEmail) return true;
      const emails = v.trim().split(';');
      return (
        emails.every((email) => email.match(EMAIL_REGEX)) ||
        'Email must be in valid format'
      );
    },
  };

  const onSubmit: SubmitHandler<FormData> = (p) => {
    console.log(p);
  };

  return (
    <>
      <div className="text-sm">
        <div className="divide-y border-b-2">
          <div className="font-bold p-2 px-4 rounded-t bg-gray-200">
            Resolution
          </div>
          <div className="border-2 p-5">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos
            voluptatum error molestiae sunt assumenda nam placeat quasi, cum
            ratione laudantium quidem molestias reprehenderit voluptas hic. Nemo
            incidunt cupiditate possimus atque?
          </div>
        </div>
        <div className="mt-5 divide-y border-b-2">
          <div className="font-bold p-2 px-4 rounded-t bg-gray-200">
            Attachments
          </div>
          <div className="border-2 p-5">There are no files attached</div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="text-sm mt-4">
        <div className="divide-y border-b-2">
          <div className="font-bold p-2 px-4 rounded-t bg-gray-200">
            Input Resolution
          </div>
          <div className="border-2 p-4">
            <label className="block text-sm font-medium text-gray-700">
              Resolution
            </label>
            <textarea
              {...register('resolution', { required: true })}
              rows={5}
              className={`${
                errors?.resolution ? 'border-red-300' : 'border-gray-300'
              } shadow-sm p-2 block w-full outline-none sm:text-sm border rounded`}
              defaultValue={''}
            />
            {errors?.resolution && (
              <small className="text-red-500">
                Resolution field is required
              </small>
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
                          validate: emailFormValidation,
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
                          validate: emailFormValidation,
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
    </>
  );
};

export default CaseDetailResolution;
