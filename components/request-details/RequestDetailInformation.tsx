import Image from "next/image";

const RequestDetailInformation = () => {
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
                <td className="h-10 font-bold">1 - Open</td>
              </tr>

              <tr>
                <td className="h-10 w-28">DueBy Date</td>
                <td className="h-10 w-5">:</td>
                <td className="font-bold">Apr 25, 2022 03:00 PM</td>
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
          <div className="flex">
            <Image
              src={"https://picsum.photos/200"}
              className="rounded-full"
              height={50}
              width={50}
              alt="Profile Picture"
            />
            <div className="ml-3">
              <div className="font-bold">Enrichment Socs</div>
              <div>enrichment.socs@binus.edu</div>
            </div>
          </div>
          <div className="mt-3">
            <table className="border">
              <tbody>
                <tr className="border-b">
                  <td className="px-6 py-3 font-bold border-r">Employee ID</td>
                  <td className="px-6 py-3 w-48 break-all">BN000012345</td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-3 font-bold border-r">
                    Department Name
                  </td>
                  <td className="px-6 py-3 break-all">
                    asdfasdfasdfasdfasdfasdfasdfasdfsadf
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-3 font-bold border-r">Phone</td>
                  <td className="px-6 py-3 break-all">-</td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-3 font-bold border-r">Job Title</td>
                  <td className="px-6 py-3 break-all">-</td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-3 font-bold border-r">Reporting To</td>
                  <td className="px-6 py-3 break-all">-</td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-3 font-bold border-r">Mobile</td>
                  <td className="px-6 py-3 break-all">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailInformation;
