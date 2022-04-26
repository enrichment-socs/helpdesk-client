import { Dialog, Transition } from '@headlessui/react';
import { SetStateAction, useAtom } from 'jotai';
import { Dispatch, Fragment, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { CreateFAQCategoryDto } from '../../models/dto/faq-categories/create-faq-category.dto';
import { FAQCategory } from '../../models/FAQCategory';
import { faqCategoriesAtom } from '../../pages/manage/faq-categories';
import { FAQCategoriesService } from '../../services/FAQCategoriesService';

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  faqCategory: FAQCategory | null;
};

type FormData = {
  categoryName: string;
};

export default function FAQCategoryFormModal({
  isOpen,
  setIsOpen,
  faqCategory,
}: Props) {
  const [faqCategories, setFAQCategories] = useAtom(faqCategoriesAtom);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    setValue('categoryName', faqCategory?.categoryName);
  }, [faqCategory]);

  const onSubmit: SubmitHandler<FormData> = async (payload) => {
    setLoading(true);
    await toast.promise(
      faqCategory
        ? FAQCategoriesService.updateFAQCategory(
            payload as CreateFAQCategoryDto,
            faqCategory.id
          )
        : FAQCategoriesService.addFAQCategory(payload as CreateFAQCategoryDto),
      {
        loading: faqCategory
          ? 'Updating FAQ category...'
          : 'Adding FAQ category...',
        success: (result) => {
          faqCategory
            ? setFAQCategories(
                faqCategories.map((fc) => {
                  if (fc.id === faqCategory.id) return result;
                  else return fc;
                })
              )
            : setFAQCategories([result, ...faqCategories]);
          setIsOpen(false);
          setValue('categoryName', '');
          return faqCategory
            ? `Successfully updated the FAQ category`
            : `Succesfully added new FAQ category`;
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
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900">
                  {faqCategory ? 'Update' : 'Create'} FAQ Category
                </Dialog.Title>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-2 space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      FAQ Category Name
                    </label>
                    <div className="mt-1">
                      <input
                        {...register('categoryName', {
                          required: true,
                        })}
                        type="text"
                        className={`${
                          errors.categoryName
                            ? 'border-red-300'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } mt-1 block w-full outline-none p-2 text-base border sm:text-sm rounded-md`}
                        placeholder="Learning Plan Issues"
                      />
                    </div>
                    {errors.categoryName?.type === 'required' && (
                      <small className="text-red-500">
                        FAQ category name must be filled
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
                      {faqCategory ? 'Update' : 'Create'}
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
}
