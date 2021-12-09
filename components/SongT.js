function SongT() {
  return (
    <div className="grid grid-cols-2 text-gray-500 py-4 px-5 border-b-[0.1px] border-gray-500 border-opacity-20">
      <div className="flex items-center space-x-4">
        <p className="px-8">#</p>

        <img src="" alt="" className="h-10 w-10 hidden" />

        <div>
          <p className="px-8 w-36 lg:w-64 ">TITLE</p>
        </div>
      </div>
      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="w-40 hidden md:inline">ALBUM </p>

        <p className="mr-2">DURATION</p>
      </div>
    </div>
  );
}

export default SongT;
