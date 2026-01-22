export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FBF9F6] flex items-center justify-center">
      <div className="text-center">
        {/* Spinner */}
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-[#EBE6DF]" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#E07B53] animate-spin" />
        </div>

        {/* Text skeleton */}
        <div className="space-y-3">
          <div className="h-4 w-32 bg-[#EBE6DF] rounded-full mx-auto animate-pulse" />
          <div className="h-3 w-24 bg-[#EBE6DF] rounded-full mx-auto animate-pulse" />
        </div>
      </div>
    </div>
  );
}
