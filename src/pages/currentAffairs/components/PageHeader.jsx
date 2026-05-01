const PageHeader = () => {
  return (
    <div className="text-center mx-2 mt-4 bg-gradient-to-r from-amber-50 to-zinc-50 p-4 shadow-sm">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800">
        Current Affairs
      </h1>
      <p className="mt-1 text-xs md:text-sm lg:text-base text-gray-600">
        Month wise exam-oriented snippets mainly taken from Press Information
        Bureau and other misc sources.
      </p>
    </div>
  );
};

export default PageHeader;
