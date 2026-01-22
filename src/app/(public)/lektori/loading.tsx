export default function LektoriLoading() {
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
            <div className="h-5 w-3/4 bg-[#EBE6DF] rounded-full mx-auto animate-pulse" />
          </div>
        </div>
      </section>

      {/* Instructors Section Skeleton */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Instructor Card 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
            {/* Avatar skeleton */}
            <div className="relative">
              <div className="aspect-[3/4] bg-[#EBE6DF] rounded-[48px] animate-pulse" />
              <div className="absolute -bottom-4 right-4 lg:-right-4 w-32 h-20 bg-[#EBE6DF] rounded-[24px] animate-pulse" />
            </div>

            {/* Content skeleton */}
            <div>
              {/* Origin badge */}
              <div className="h-8 w-40 bg-[#EBE6DF] rounded-full mb-4 animate-pulse" />

              {/* Name */}
              <div className="h-12 w-3/4 bg-[#EBE6DF] rounded-2xl mb-2 animate-pulse" />

              {/* Role */}
              <div className="h-6 w-1/2 bg-[#EBE6DF] rounded-lg mb-6 animate-pulse" />

              {/* Bio paragraphs */}
              <div className="space-y-4 mb-6">
                <div className="space-y-2">
                  <div className="h-5 w-full bg-[#EBE6DF] rounded animate-pulse" />
                  <div className="h-5 w-full bg-[#EBE6DF] rounded animate-pulse" />
                  <div className="h-5 w-3/4 bg-[#EBE6DF] rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-5 w-full bg-[#EBE6DF] rounded animate-pulse" />
                  <div className="h-5 w-2/3 bg-[#EBE6DF] rounded animate-pulse" />
                </div>
              </div>

              {/* Highlights */}
              <div className="flex flex-wrap gap-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-28 bg-[#EBE6DF] rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Instructor Card 2 (reversed layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
            {/* Content skeleton */}
            <div className="lg:order-1">
              {/* Origin badge */}
              <div className="h-8 w-48 bg-[#EBE6DF] rounded-full mb-4 animate-pulse" />

              {/* Name */}
              <div className="h-12 w-3/4 bg-[#EBE6DF] rounded-2xl mb-2 animate-pulse" />

              {/* Role */}
              <div className="h-6 w-1/2 bg-[#EBE6DF] rounded-lg mb-6 animate-pulse" />

              {/* Bio paragraphs */}
              <div className="space-y-4 mb-6">
                <div className="space-y-2">
                  <div className="h-5 w-full bg-[#EBE6DF] rounded animate-pulse" />
                  <div className="h-5 w-full bg-[#EBE6DF] rounded animate-pulse" />
                  <div className="h-5 w-3/4 bg-[#EBE6DF] rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-5 w-full bg-[#EBE6DF] rounded animate-pulse" />
                  <div className="h-5 w-2/3 bg-[#EBE6DF] rounded animate-pulse" />
                </div>
              </div>

              {/* Highlights */}
              <div className="flex flex-wrap gap-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-28 bg-[#EBE6DF] rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
            </div>

            {/* Avatar skeleton */}
            <div className="relative lg:order-2">
              <div className="aspect-[3/4] bg-[#EBE6DF] rounded-[48px] animate-pulse" />
              <div className="absolute -bottom-4 left-4 lg:-left-4 w-32 h-20 bg-[#EBE6DF] rounded-[24px] animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section Skeleton */}
      <section className="mx-6 mb-20">
        <div className="bg-[#1F1A17] rounded-[48px] py-20 px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-3 mb-8">
              <div className="h-8 w-full bg-white/10 rounded-xl mx-auto animate-pulse" />
              <div className="h-8 w-3/4 bg-white/10 rounded-xl mx-auto animate-pulse" />
            </div>
            <div className="h-5 w-48 bg-white/10 rounded-full mx-auto animate-pulse" />
          </div>
        </div>
      </section>

      {/* Team Stats Skeleton */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-10 w-64 bg-[#EBE6DF] rounded-2xl mx-auto mb-4 animate-pulse" />
            <div className="h-5 w-96 max-w-full bg-[#EBE6DF] rounded-full mx-auto animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-[32px] p-8 text-center animate-pulse"
              >
                <div className="w-14 h-14 bg-[#EBE6DF] rounded-full mx-auto mb-4" />
                <div className="h-14 w-16 bg-[#EBE6DF] rounded-xl mx-auto mb-2" />
                <div className="h-5 w-32 bg-[#EBE6DF] rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
