import { Disclosure, Transition } from '@headlessui/react';
import { ChatAlt2Icon, ChevronUpIcon } from '@heroicons/react/solid';
import { useAtom } from 'jotai';
import { guidelineCategoriesAtom } from '../../atom';
import { GuidelineCategory } from '../../models/GuidelineCategory';
import GuidelineAccordion from './GuidelineAccordion';

const GuidelineContainer: React.FC = () => {
  const [guidelineCategories] = useAtom(guidelineCategoriesAtom);

  return (
    <div className={`ml-2 mt-5 p-2 border-2 rounded divide-y transition`}>
      <div className="text-lg font-bold mb-3 flex items-center">
        <ChatAlt2Icon className="h-5 w-5" />
        <span className="ml-3">Guidelines</span>
      </div>
      <div>
        {guidelineCategories &&
          guidelineCategories.map((fc, idx) => {
            return <GuidelineAccordion key={idx} guidelineCategory={fc} />;
          })}
      </div>
    </div>
  );
};

export default GuidelineContainer;
