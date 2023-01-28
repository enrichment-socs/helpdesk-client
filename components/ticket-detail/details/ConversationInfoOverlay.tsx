import InfoAlert from '../../../widgets/InfoAlert';

type Props = {
  onClose: () => void;
};

export const ConversationInfoOverlay = ({ onClose }: Props) => {
  return (
    <div className="absolute left-0 top-p w-full h-full backdrop-filter backdrop-blur z-10 flex justify-center items-center">
      <div className="w-3/4">
        <InfoAlert
          message="Ticket status should at least be <b>In Progress</b> before you
    can do actions such as reply or marking a message as
    resolution. <br/>You can change ticket status in the <b>Manage Ticket</b> tab above."
        />

        <div className="text-right w-full">
          <button
            onClick={onClose}
            className="px-4 py-2 mt-2 bg-primary hover:bg-primary-dark text-white rounded-lg">
            Yes, I understand.
          </button>
        </div>
      </div>
    </div>
  );
};
