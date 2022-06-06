import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Case } from '../../../models/Case';
import { GraphUser } from '../../../models/GraphUser';
import { SessionUser } from '../../../models/SessionUser';
import { GraphApiService } from '../../../services/GraphApiService';
import SkeletonLoading from '../../../widgets/SkeletonLoading';
import axios from 'axios';

type Props = {
  currCase: Case;
};

const CaseDetailInformation = ({ currCase }: Props) => {
  const [userInfo, setUserInfo] = useState<GraphUser>(null);
  const [userProfilePhoto, setUserProfilePhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const session = useSession();
  const user = session?.data?.user as SessionUser;
  const graphApiService = new GraphApiService(user?.accessToken);

  const getUserInfo = async () => {
    setIsLoading(true);
    const userInfo = await graphApiService.getUserInfoByEmail(
      currCase.senderEmail
    );

    setUserInfo(userInfo);
    setIsLoading(false);
  };

  const getUserProfilePhoto = async () => {
    let userProfilePhoto = null;
    let blobUrl = null;
    const url = window.URL || window.webkitURL;

    if (userInfo) {
      userProfilePhoto = await graphApiService.getUserProfilePhoto(userInfo.id);

      blobUrl = userProfilePhoto ? url.createObjectURL(userProfilePhoto) : null;
    }

    setUserProfilePhoto(blobUrl);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    getUserProfilePhoto();
  }, [userInfo]);

  return (
    <div className="mx-2 p-2 border-2 md:w-1/4 rounded min-w-fit">
      <div className="divide-y">
        <div className="flex justify-center font-bold text-xl py-2">
          Information
        </div>
        <div className="pt-2">
          <table className="table-fixed">
            <tbody>
              <tr>
                <td className="h-10 w-28">Status</td>
                <td className="h-10 w-5">:</td>
                <td className="h-10 font-bold">{currCase.status.statusName}</td>
              </tr>

              <tr>
                <td className="h-10 w-28">Due By Date</td>
                <td className="h-10 w-5">:</td>
                <td className="font-bold">
                  {format(new Date(currCase.dueBy), 'dd MMM yyyy kk:mm')}
                </td>
              </tr>

              {/* <tr>
                <td colSpan={3} className="h-10">
                  <a href="#" className="text-blue-500 hover:text-blue-800">
                    More Properties
                  </a>
                </td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </div>

      <div className="divide-y">
        <div className="flex justify-center font-bold text-xl pt-5 pb-2">
          Profile
        </div>
        <div className="p-2">
          <div className="flex items-center">
            <Image
              id="profile-photo"
              src={
                userProfilePhoto
                  ? userProfilePhoto
                  : 'https://picsum.photos/200'
              }
              className="rounded-full w-20 h-20"
              height={50}
              width={50}
              alt="Profile Picture"
            />
            <div className="ml-3">
              <div className="font-bold">
                {isLoading ? (
                  <SkeletonLoading width="100%" />
                ) : userInfo ? (
                  userInfo.displayName
                ) : (
                  currCase.senderName
                )}
              </div>
              <div className="break-word">
                {isLoading ? (
                  <SkeletonLoading width="100%" />
                ) : userInfo ? (
                  userInfo.mail
                ) : (
                  currCase.senderEmail
                )}
              </div>
            </div>
          </div>
          <div className="mt-3">
            <table className="table-fixed border">
              <tbody>
                {/* <tr className="border-b">
                  <td className="px-6 py-3 font-bold border-r">Employee ID</td>
                  <td className="px-6 py-3 w-48 break-all">{userInfo ? userInfo.id : '-'}</td>
                </tr> */}
                <tr className="border-b">
                  <td className="px-6 py-3 font-bold border-r w-1/2">
                    Department Name
                  </td>
                  <td className="px-6 py-3 break-word">
                    {userInfo && userInfo.department
                      ? userInfo.department
                      : '-'}
                  </td>
                </tr>
                {/* <tr className="border-b">
                  <td className="px-6 py-3 font-bold border-r">Phone</td>
                  <td className="px-6 py-3 break-all">-</td>
                </tr> */}
                <tr className="border-b">
                  <td className="px-6 py-3 font-bold border-r">Company Name</td>
                  <td className="px-6 py-3 break-word">
                    {userInfo && userInfo.companyName
                      ? userInfo.companyName
                      : '-'}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-3 font-bold border-r">Department</td>
                  <td className="px-6 py-3 break-word">
                    {userInfo && userInfo.department
                      ? userInfo.department
                      : '-'}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-3 font-bold border-r">Job Title</td>
                  <td className="px-6 py-3 break-word">
                    {userInfo && userInfo.jobTitle ? userInfo.jobTitle : '-'}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-3 font-bold border-r">
                    Office Location
                  </td>
                  <td className="px-6 py-3 break-word">
                    {userInfo && userInfo.officeLocation
                      ? userInfo.officeLocation
                      : '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetailInformation;
