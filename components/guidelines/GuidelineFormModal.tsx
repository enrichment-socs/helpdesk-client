import { Dialog, Transition } from '@headlessui/react';
import { SetStateAction, useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { Dispatch, Fragment, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { guidelineCategoriesAtom } from '../../atom';
import { CreateGuidelineDto } from '../../models/dto/guidelines/create-guideline.dto';
import { Guideline } from '../../models/Guideline';
import { SessionUser } from '../../models/SessionUser';
import { GuidelineCategoryService } from '../../services/GuidelineCategoryService';
import { GuidelineService } from '../../services/GuidelineService';
import ManageGuidelineStore from '../../stores/manage/guidelines';

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
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  faq: Guideline | null;
};

type FormData = {
  question: string;
  answer: string;
  guidelineCategoryId: string;
};

const GuidelineFormModal: React.FC<Props> = ({ isOpen, setIsOpen, faq }) => {
  const [faqs, setFaqs] = useAtom(ManageGuidelineStore.guidelines);

  const [guidelineCategories, setGuidelineCategories] = useAtom(
    guidelineCategoriesAtom
  );
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const guidelineCategorySvc = new GuidelineCategoryService(user?.accessToken);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    setValue('question', faq?.question);

    register('answer', { required: true });
    setValue('answer', faq?.answer);

    setValue('guidelineCategoryId', faq?.guidelineCategory.id);
  }, [faq, register, setValue]);

  useEffect(() => {
    const fetchGuidelineCategory = async () => {
      const categories = await guidelineCategorySvc.getAll();
      setGuidelineCategories(categories);
    };

    if (user) {
      fetchGuidelineCategory();
    }
  }, [user]);

  const answerContent = watch('answer') || '';

  const onAnswerChange = (val) => setValue('answer', val);

  const onSubmit: SubmitHandler<FormData> = async (payload) => {
    setLoading(true);
    const faqService = new GuidelineService(user.accessToken);
    await toast.promise(
      faq
        ? faqService.updateFAQ(payload as CreateGuidelineDto, faq.id)
        : faqService.addFAQ(payload as CreateGuidelineDto),
      {
        loading: faq ? 'Updating Guideline...' : 'Adding Guideline...',
        success: (result) => {
          faq
            ? setFaqs(
                faqs.map((fc) => {
                  if (fc.id === faq.id) return result;
                  else return fc;
                })
              )
            : setFaqs([result, ...faqs]);
          setIsOpen(false);
          setValue('question', '');
          setValue('answer', '');
          setValue('guidelineCategoryId', '');
          return faq
            ? `Successfully updated the guideline`
            : `Succesfully added new guideline`;
        },
        error: (e) => e.toString(),
      }
    );
    setLoading(false);
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsOpen(false)}>
          <div
            className="min-h-screen px-4 text-center"
            style={{ background: 'rgba(0,0,0,0.6)' }}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900">
                  {faq ? 'Update' : 'Create'} Guideline
                </Dialog.Title>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-2 space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Question
                    </label>
                    <div className="mt-1">
                      <input
                        {...register('question', {
                          required: true,
                        })}
                        type="text"
                        className={`${
                          errors.question
                            ? 'border-red-300'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } mt-1 block w-full outline-none p-2 text-base border sm:text-sm rounded-md`}
                        placeholder="Apa itu Learning Plan?"
                      />
                    </div>
                    {errors.question?.type === 'required' && (
                      <small className="text-red-500">
                        Question must be filled
                      </small>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Answer
                    </label>
                    <div className="mt-1">
                      <QuillNoSSRWrapper
                        modules={modules}
                        theme="snow"
                        value={answerContent}
                        onChange={(content) => onAnswerChange(content)}
                      />
                    </div>
                    {errors.answer?.type === 'required' && (
                      <small className="text-red-500">
                        Answer must be filled
                      </small>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      {...register('guidelineCategoryId', {
                        required: true,
                      })}
                      className={`${
                        errors.guidelineCategoryId
                          ? 'border-red-300'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } mt-1 block w-full pl-3 outline-none pr-10 py-2 text-base border sm:text-sm rounded-md`}>
                      <option value="">----- SELECT FAQ Category -----</option>
                      {/* <option value="Even">Even</option>
                      <option value="Odd">Odd</option> */}

                      {guidelineCategories.map((fc, idx) => {
                        return (
                          <option key={idx} value={fc.id}>
                            {fc.categoryName}
                          </option>
                        );
                      })}
                    </select>
                    {errors.guidelineCategoryId?.type === 'required' && (
                      <small className="text-red-500">
                        FAQ Category must be selected
                      </small>
                    )}
                  </div>

                  <div className="mt-4 text-right">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`${
                        loading
                          ? 'text-gray-600 bg-gray-400'
                          : 'text-blue-900 bg-blue-100 hover:bg-blue-200'
                      } inline-flex justify-center px-4 py-2 text-sm font-medium border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}>
                      {faq ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default GuidelineFormModal;
