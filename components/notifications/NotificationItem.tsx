import { BellIcon } from '@heroicons/react/outline';

type Props = {
  showSideList?: boolean;
};

const NotificationItem = ({ showSideList = true }: Props) => {
  return (
    <div className="flex border-t cursor-pointer hover:bg-gray-100">
      {showSideList && <div className="border-l-4 border-primary"></div>}
      <div className="flex relative justify-center p-4">
        <BellIcon className="w-7 h-7" />
        <div className="absolute top-3 left-2 w-2 h-2 rounded-full bg-primary"></div>
      </div>
      <div className="w-full mr-4 my-2">
        <div className="flex justify-between text-sm">
          <span className="font-semibold block">Notification Title 1</span>
          <small className="block">Nov 20, 2022 11:00</small>
        </div>

        <div className="flex">
          <div className="w-3/4 text-xs">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cupiditate
            necessitatibus repellat nisi officia commodi nemo quod ipsam ex
            veritatis, repudiandae, temporibus hic provident. Accusantium
            deleniti laboriosam consequatur dignissimos optio eum.
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
