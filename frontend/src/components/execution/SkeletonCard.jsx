const SkeletonCard = () => (
  <div className="animate-pulse bg-dark-card border border-dark-border rounded-2xl p-5">
    <div className="flex items-start gap-4">
      {/* Left accent */}
      <div className="w-1 self-stretch rounded-full bg-gray-700 shrink-0" />

      <div className="flex-1 space-y-3">
        {/* Title */}
        <div className="h-5 bg-gray-700 rounded-lg w-3/4" />
        {/* Project name */}
        <div className="h-3.5 bg-gray-800 rounded-lg w-1/3" />
        {/* Badges row */}
        <div className="flex gap-3 pt-1">
          <div className="h-5 w-16 bg-gray-800 rounded-full" />
          <div className="h-5 w-24 bg-gray-800 rounded-full" />
        </div>
      </div>

      {/* Action buttons skeleton */}
      <div className="flex gap-2 shrink-0">
        <div className="h-9 w-20 bg-gray-800 rounded-xl" />
        <div className="h-9 w-16 bg-gray-800 rounded-xl" />
      </div>
    </div>
  </div>
);

const SkeletonList = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4].map((i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonList;
