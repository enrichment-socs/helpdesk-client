import { Disclosure, Transition } from '@headlessui/react';
import { ChatAlt2Icon, ChevronUpIcon } from '@heroicons/react/solid';
import { FAQCategory } from '../../models/FAQCategory';
import FAQAccordion from './FAQAccordion';

type Props = {
  faqCategories: FAQCategory[];
};

const FAQContainer: React.FC<Props> = ({ faqCategories }) => {
  return (
    <div className={`mx-2 p-2 border-2 rounded divide-y`}>
      <div className="text-lg font-bold mb-3 flex items-center">
        <ChatAlt2Icon className="h-5 w-5" />
        <span className="ml-3">FAQ</span>
      </div>
      <div>
        {faqCategories &&
          faqCategories.map((fc, idx) => {
            return (
              <FAQAccordion key={idx} faqCategory={fc}/>
            );
          })}
      </div>
    </div>
  );
};

export default FAQContainer;
