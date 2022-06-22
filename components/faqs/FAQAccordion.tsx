import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { FAQ } from '../../models/FAQ';
import { FAQCategory } from '../../models/FAQCategory';
import { SessionUser } from '../../models/SessionUser';
import { FAQService } from '../../services/FAQService';
import SkeletonLoading from '../../widgets/SkeletonLoading';

type Props = {
  faqCategory: FAQCategory;
};

const FAQAccordion: React.FC<Props> = ({ faqCategory }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currFAQs, setCurrFAQs] = useState<FAQ[]>(null);

  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const faqService = new FAQService(user?.accessToken);

  const getCurrCategoryFAQs = async () => {
    setIsLoading(true);

    const faqs = await faqService.getByFAQCategory(faqCategory.id);
    setCurrFAQs(faqs);
    setIsLoading(false);
  };

  useEffect(() => {
    getCurrCategoryFAQs();
  }, []);

  return (
    <Disclosure as="div">
      {({ open }) => (
        <>
          <Disclosure.Button
            className={`${
              open ? 'rounded-t' : 'rounded-lg'
            } flex justify-between items-center w-full px-4 py-2 font-medium text-left text-sky-900 bg-sky-100 hover:bg-sky-200 focus:outline-none focus-visible:ring focus-visible:ring-sky-500 focus-visible:ring-opacity-75 mt-3`}>
            <span>{faqCategory.categoryName}</span>
            <ChevronUpIcon
              className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`}
            />
          </Disclosure.Button>
          <Transition
            enter="transition duration-300 ease-in-out"
            enterFrom="transform scale-50 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-300 ease-in"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-50 opacity-0">
            <Disclosure.Panel
              static
              className="px-4 pt-4 pb-2 text-sm text-gray-500 border-b border-l border-r border-gray-200 rounded-b">
              {isLoading ? (
                <SkeletonLoading width="100%" />
              ) : currFAQs && currFAQs.length > 0 ? (
                currFAQs.map((faq, idx) => (
                  <Disclosure key={idx}>
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex justify-between items-center w-full px-4 py-2 text-sm font-bold text-left text-gray-700 border bg-gray-100 hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75">
                          <span>{faq.question}</span>
                          <ChevronUpIcon
                            className={`${
                              open ? 'rotate-180 transform' : ''
                            } h-5 w-5 text-gray-700`}
                          />
                        </Disclosure.Button>
                        <Transition
                          show={open}
                          enter="transition duration-500 ease-out"
                          enterFrom="-translate-y-2.5 opacity-0"
                          enterTo="translate-y-0 opacity-100"
                          leave="transition duration-100 ease-out"
                          leaveFrom="translate-y-0 opacity-100"
                          leaveTo="-translate-y-2.5 opacity-0">
                          <Disclosure.Panel
                            static
                            className="p-4 border text-sm text-gray-700">
                            <div
                              className="display-list display-link font-medium"
                              dangerouslySetInnerHTML={{
                                __html: faq.answer,
                              }}></div>
                          </Disclosure.Panel>
                        </Transition>
                      </>
                    )}
                  </Disclosure>
                ))
              ) : (
                <div>There is still no FAQ for this category.</div>
              )}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};

export default FAQAccordion;
