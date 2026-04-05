const SkeletonCard = () => (
  <div className="animate-pulse bg-dark-card border border-dark-border border-l-4 border-l-gray-700 rounded-2xl p-5">
    <div className="space-y-3">
      <div className="h-5 bg-gray-700 rounded-lg w-3/4" />
      <div className="h-3.5 bg-gray-800 rounded-lg w-full" />
      <div className="h-3.5 bg-gray-800 rounded-lg w-2/3" />
      <div className="flex gap-3 pt-2">
        <div className="h-6 w-24 bg-gray-800 rounded-full" />
        <div className="h-6 w-20 bg-gray-800 rounded-full" />
      </div>
    </div>
  </div>
);

const ProjectSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default ProjectSkeleton;
