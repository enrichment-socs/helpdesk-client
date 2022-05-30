import { InformationCircleIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import { Information } from '../../models/Information';
import InformationDetailModal from '../information-detail-modal/InformationDetailModal';
import InformationTable from './InformationTable';

export default function InformationContainer() {
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selected, setSelected] = useState<Information>(null);

  const openModal = (info: Information) => {
    setSelected(info);
    setOpenDetailModal(true);
  };

  return (
    <>
      <InformationDetailModal
        isOpen={openDetailModal}
        setIsOpen={setOpenDetailModal}
        setInfo={setSelected}
        info={selected}
      />

      <div className="ml-2 mt-5 p-2 border-2 rounded divide-y">
        <div className="flex justify-between">
          <div className="text-lg font-bold mb-3 flex items-center">
            <InformationCircleIcon className="h-5 w-5" />
            <span className="ml-3">Information</span>
          </div>
        </div>
        <div className="p-1">
          <InformationTable openDetailModal={openModal} />
        </div>
      </div>
    </>
  );
}
