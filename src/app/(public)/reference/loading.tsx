export default function ReferenceLoading() {
  return (
    <div className="bg-[#FBF9F6]">
      {/* Hero Section Skeleton */}
      <section className="relative pt-32 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#FFE5E5] to-transparent opacity-40 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Badge skeleton */}
          <div className="h-10 w-32 bg-[#EBE6DF] rounded-full mx-auto mb-6 animate-pulse" />

          {/* Title skeleton */}
          <div className="space-y-3 mb-6">
            <div className="h-12 w-3/4 bg-[#EBE6DF] rounded-2xl mx-auto animate-pulse" />
            <div className="h-12 w-1/3 bg-[#EBE6DF] rounded-2xl mx-auto animate-pulse" />
          </div>

          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="h-5 w-full bg-[#EBE6DF] rounded-full mx-auto animate-pulse" />
            <div className="h-5 w-4/5 bg-[#EBE6DF] rounded-full mx-auto animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Bar Skeleton */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-[32px] p-6 text-center animate-pulse"
              >
                <div className="h-12 w-20 bg-[#EBE6DF] rounded-xl mx-auto mb-2" />
                <div className="h-4 w-24 bg-[#EBE6DF] rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid Skeleton */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-[32px] p-8 animate-pulse"
              >
                {/* Stars skeleton */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 bg-[#EBE6DF] rounded"
                    />
                  ))}
                </div>

                {/* Quote skeleton */}
                <div className="space-y-2 mb-6">
                  <div className="h-4 w-full bg-[#EBE6DF] rounded" />
                  <div className="h-4 w-full bg-[#EBE6DF] rounded" />
                  <div className="h-4 w-3/4 bg-[#EBE6DF] rounded" />
                </div>

                {/* Author skeleton */}
                <div className="border-t border-[#EBE6DF] pt-4">
                  <div className="h-5 w-32 bg-[#EBE6DF] rounded mb-2" />
                  <div className="h-4 w-24 bg-[#EBE6DF] rounded mb-2" />
                  <div className="h-6 w-36 bg-[#EBE6DF] rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submit Review Section Skeleton */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="h-10 w-56 bg-[#EBE6DF] rounded-2xl mx-auto mb-4 animate-pulse" />
          <div className="h-5 w-80 bg-[#EBE6DF] rounded-full mx-auto mb-10 animate-pulse" />
          <div className="h-14 w-44 bg-[#EBE6DF] rounded-full mx-auto animate-pulse" />
        </div>
      </section>

      {/* Trust Section Skeleton */}
      <section className="py-20 px-6 bg-[#FBF9F6]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-10 w-72 bg-[#EBE6DF] rounded-2xl mx-auto mb-6 animate-pulse" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="text-center animate-pulse">
                <div className="w-14 h-14 bg-[#EBE6DF] rounded-full mx-auto mb-4" />
                <div className="h-6 w-40 bg-[#EBE6DF] rounded-lg mx-auto mb-2" />
                <div className="h-4 w-full bg-[#EBE6DF] rounded mx-auto" />
                <div className="h-4 w-3/4 bg-[#EBE6DF] rounded mx-auto mt-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-[#E07B53] to-[#C4613D] rounded-[48px] p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10">
              <div className="h-10 w-80 max-w-full bg-white/20 rounded-2xl mx-auto mb-4 animate-pulse" />
              <div className="h-5 w-96 max-w-full bg-white/20 rounded-full mx-auto mb-8 animate-pulse" />
              <div className="h-14 w-56 bg-white/20 rounded-full mx-auto animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
