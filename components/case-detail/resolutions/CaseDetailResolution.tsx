type Prop = {
  isResolved: boolean;
};

const CaseDetailResolution = ({ isResolved }: Prop) => {
  return (
    <div className="text-sm">
      <div className="divide-y border-b-2">
        <div className="font-bold p-2 px-4 rounded-t bg-gray-200">Resolution</div>
        <div className="border-2 p-5">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos
          voluptatum error molestiae sunt assumenda nam placeat quasi, cum
          ratione laudantium quidem molestias reprehenderit voluptas hic. Nemo
          incidunt cupiditate possimus atque?
        </div>
      </div>
      <div className="mt-5 divide-y border-b-2">
        <div className="font-bold p-2 px-4 rounded-t bg-gray-200">Attachments</div>
        <div className="border-2 p-5">There are no files attached</div>
      </div>
    </div>
  );
};

export default CaseDetailResolution;
