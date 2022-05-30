type Prop = {
  isResolved: boolean;
};

const RequestDetailResolution = ({ isResolved }: Prop) => {
  return (
    <div className="text-sm">
      <div className="border-2 p-5">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos voluptatum
        error molestiae sunt assumenda nam placeat quasi, cum ratione laudantium
        quidem molestias reprehenderit voluptas hic. Nemo incidunt cupiditate
        possimus atque?
      </div>
      <div className="mt-3 border-2 divide-y">
        <div className="font-bold p-3">Attachments</div>
        <div className="p-5">There are no files attached</div>
      </div>
    </div>
  );
};

export default RequestDetailResolution;
