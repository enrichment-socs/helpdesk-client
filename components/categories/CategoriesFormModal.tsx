import { Dialog, Transition } from '@headlessui/react';
import { TrashIcon } from '@heroicons/react/solid';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Category } from '../../models/Category';
import { CreateCategoryDto } from '../../models/dto/categories/create-category-dto';
import { SessionUser } from '../../models/SessionUser';
import { CategoryService } from '../../services/CategoryService';
import ManageCategoryStore from '../../stores/manage/categories';

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  category: Category | null;
  updateData: () => void;
};

type FormData = {
  categoryName: string;
  criterias: { value: string }[];
};

export default function CategoriesFormModal({
  isOpen,
  setIsOpen,
  category,
  updateData,
}: Props) {
  const [categoriesVal, setCategoriesVal] = useAtom(ManageCategoryStore.ticketCategories);
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const user = session?.data?.user as SessionUser;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>();

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: 'criterias',
    }
  );

  useEffect(() => {
    setValue('categoryName', category?.categoryName);
    remove();

    if (!category) {
      append({ value: '' });
    } else {
      category?.description
        .split(';')
        .forEach((criteria, idx) => append({ value: criteria }));
    }
  }, [category]);

  const onSubmit: SubmitHandler<FormData> = async (payload) => {
    const dto: CreateCategoryDto = {
      categoryName: payload.categoryName,
      description: payload.criterias.map((c) => c.value.trim()).join(';'),
    };
    setLoading(true);
    const categoryService = new CategoryService(user.accessToken);
    await toast.promise(
      category
        ? categoryService.update(dto, category.id)
        : categoryService.add(dto),
      {
        loading: category ? 'Updating category...' : 'Adding category...',
        success: (result) => {
          // category
          //   ? setCategoriesVal(
          //       categoriesVal.map((cat) => {
          //         if (cat.id === category.id) return result;
          //         else return cat;
          //       })
          //     )
          //   : setCategoriesVal([...categoriesVal, result]);

          updateData();
          setIsOpen(false);
          setValue('categoryName', '');
          remove();
          return category
            ? `Successfully updated the category`
            : `Succesfully added new category`;
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
              <div className="inline-block w-full max-w-2xl max-h-[36rem] p-6 my-8 overflow-auto text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900">
                  {category ? 'Update' : 'Create'} Category
                </Dialog.Title>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-2 space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Category Name
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
                        placeholder="Category Name"
                      />
                    </div>
                    {errors.categoryName?.type === 'required' && (
                      <small className="text-red-500">
                        Category name must be filled
                      </small>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Category Criterias
                    </label>

                    {fields.map((field, idx) => {
                      return (
                        <div key={idx}>
                          <div className="mt-1 flex">
                            <input
                              key={field.id}
                              {...register(`criterias.${idx}.value`, {
                                required: true,
                              } as const)}
                              type="text"
                              className={`${
                                errors?.['criterias']?.[idx]?.value
                                  ? 'border-red-300'
                                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                              } block w-full outline-none p-2 text-base border sm:text-sm rounded-md`}
                              placeholder={`Category Criteria ${idx + 1}`}
                            />

                            <button
                              onClick={() => remove(idx)}
                              type="button"
                              className="ml-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                          {errors?.['criterias']?.[idx]?.value && (
                            <small className="text-red-500">
                              Category criteria {idx + 1} must be filled
                            </small>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    <button
                      onClick={() => append({ value: '' })}
                      type="button"
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Add criteria
                    </button>
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
                      {category ? 'Update' : 'Create'}
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
