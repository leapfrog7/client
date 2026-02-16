const SkeletonList = () => {
  return (
    <div className="mx-2 mt-3 grid grid-cols-1 gap-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
          <div className="mt-3 flex gap-2">
            <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-5/6 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonList;
