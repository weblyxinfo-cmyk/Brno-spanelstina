export default function KurzyLoading() {
  return (
    <div className="bg-[#FBF9F6]">
      {/* Hero Section Skeleton */}
      <section className="relative pt-32 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#FFE5E5] to-transparent opacity-40 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Badge skeleton */}
          <div className="h-10 w-40 bg-[#EBE6DF] rounded-full mx-auto mb-6 animate-pulse" />

          {/* Title skeleton */}
          <div className="space-y-3 mb-6">
            <div className="h-12 w-3/4 bg-[#EBE6DF] rounded-2xl mx-auto animate-pulse" />
            <div className="h-12 w-1/2 bg-[#EBE6DF] rounded-2xl mx-auto animate-pulse" />
          </div>

          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="h-5 w-full bg-[#EBE6DF] rounded-full mx-auto animate-pulse" />
            <div className="h-5 w-4/5 bg-[#EBE6DF] rounded-full mx-auto animate-pulse" />
          </div>
        </div>
      </section>

      {/* Filter Tabs Skeleton */}
      <section className="px-6 mb-12">
        <div className="flex flex-wrap justify-center gap-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-12 w-32 bg-[#EBE6DF] rounded-full animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </section>

      {/* Course Cards Grid Skeleton */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-[32px] overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Image skeleton */}
                  <div className="bg-[#EBE6DF] min-h-[280px] animate-pulse" />

                  {/* Content skeleton */}
                  <div className="p-8">
                    {/* Title */}
                    <div className="h-7 w-3/4 bg-[#EBE6DF] rounded-lg mb-2 animate-pulse" />
                    {/* Subtitle */}
                    <div className="h-5 w-1/2 bg-[#EBE6DF] rounded-lg mb-4 animate-pulse" />

                    {/* Description */}
                    <div className="space-y-2 mb-6">
                      <div className="h-4 w-full bg-[#EBE6DF] rounded animate-pulse" />
                      <div className="h-4 w-full bg-[#EBE6DF] rounded animate-pulse" />
                      <div className="h-4 w-2/3 bg-[#EBE6DF] rounded animate-pulse" />
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap gap-4 mb-6 pt-6 border-t border-[#EBE6DF]">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="h-5 w-24 bg-[#EBE6DF] rounded animate-pulse"
                        />
                      ))}
                    </div>

                    {/* Button skeleton */}
                    <div className="h-12 w-40 bg-[#EBE6DF] rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section Skeleton */}
      <section className="py-20 px-6 bg-[#1F1A17]">
        <div className="max-w-6xl mx-auto">
          {/* Section header skeleton */}
          <div className="text-center mb-16">
            <div className="h-10 w-64 bg-white/10 rounded-2xl mx-auto mb-4 animate-pulse" />
            <div className="h-5 w-80 bg-white/10 rounded-full mx-auto animate-pulse" />
          </div>

          {/* Pricing cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className={`rounded-[32px] p-8 animate-pulse ${
                  index === 1 ? "bg-white/20 scale-105" : "bg-white/5"
                }`}
              >
                {/* Icon */}
                <div className="w-14 h-14 bg-white/10 rounded-full mx-auto mb-4" />
                {/* Name */}
                <div className="h-6 w-32 bg-white/10 rounded-lg mx-auto mb-2" />
                {/* Description */}
                <div className="h-4 w-24 bg-white/10 rounded mx-auto mb-6" />
                {/* Price */}
                <div className="h-10 w-28 bg-white/10 rounded-lg mx-auto mb-2" />
                <div className="h-4 w-20 bg-white/10 rounded mx-auto mb-8" />
                {/* Features */}
                <div className="space-y-3 mb-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-4 w-full bg-white/10 rounded" />
                  ))}
                </div>
                {/* Button */}
                <div className="h-14 w-full bg-white/10 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
