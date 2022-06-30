import { InformationCircleIcon } from '@heroicons/react/solid';
import { SetStateAction, useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { Dispatch, useState } from 'react';
import toast from 'react-hot-toast';
import { activeSemesterAtom } from '../../atom';
import { Information } from '../../models/Information';
import { SessionUser } from '../../models/SessionUser';
import { InformationService } from '../../services/InformationService';
import { ClientPromiseWrapper } from '../../shared/libs/client-promise-wrapper';
import CustomPaginator from '../../widgets/CustomPaginator';
import InformationDetailModal from '../information-detail-modal/InformationDetailModal';
import InformationTable from './InformationTable';

type Props = {
  take: number;
  skip: number;
  setSkip: Dispatch<SetStateAction<number>>;
  totalCount: number;
  setInformations: Dispatch<SetStateAction<Information[]>>;
  informations: Information[];
};

export default function InformationContainer({
  informations,
  take,
  skip,
  setSkip,
  totalCount,
  setInformations,
}: Props) {
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selected, setSelected] = useState<Information>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [threeFirstPageNumber, setThreeFirstPageNumber] = useState([1, 2, 3]);
  const session = useSession();
  const user = session.data.user as SessionUser;
  const infoService = new InformationService(user.accessToken);
  const [activeSemester] = useAtom(activeSemesterAtom);

  const fetchInfo = async (take: number, skip: number) => {
    const wrapper = new ClientPromiseWrapper(toast);
    const { informations } = await wrapper.handle(
      infoService.getBySemester(activeSemester.id, take, skip)
    );
    return informations;
  };

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
          <InformationTable
            openDetailModal={openModal}
            informations={informations}
          />

          <CustomPaginator
            take={take}
            skip={skip}
            totalCount={totalCount}
            setSkip={setSkip}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            threeFirstPageNumbers={threeFirstPageNumber}
            setThreeFirstPageNumbers={setThreeFirstPageNumber}
            fetchItem={fetchInfo}
            setItem={setInformations}
          />
        </div>
      </div>
    </>
  );
}
