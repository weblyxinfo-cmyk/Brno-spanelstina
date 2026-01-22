export default function AdminLoading() {
  return (
    <div>
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-9 w-40 bg-[#EBE6DF] rounded-xl mb-2 animate-pulse" />
        <div className="h-5 w-56 bg-[#EBE6DF] rounded-lg animate-pulse" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#EBE6DF] rounded-xl" />
              <div>
                <div className="h-8 w-12 bg-[#EBE6DF] rounded-lg mb-1" />
                <div className="h-4 w-16 bg-[#EBE6DF] rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Messages List Skeleton */}
      <div className="bg-white rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-7 w-40 bg-[#EBE6DF] rounded-lg animate-pulse" />
          <div className="h-5 w-28 bg-[#EBE6DF] rounded animate-pulse" />
        </div>

        {/* Message items */}
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border border-[#EBE6DF] bg-[#FBF9F6] animate-pulse"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="h-5 w-32 bg-[#EBE6DF] rounded" />
                <div className="h-4 w-20 bg-[#EBE6DF] rounded" />
              </div>
              <div className="h-4 w-full bg-[#EBE6DF] rounded mb-2" />
              <div className="h-6 w-28 bg-[#EBE6DF] rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
