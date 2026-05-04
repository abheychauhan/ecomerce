// ✅ Product Card Skeleton
export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
    {/* Image */}
    <div className="aspect-[4/3] bg-slate-200 animate-pulse" />

    <div className="p-5 space-y-3">
      {/* Category */}
      <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
      {/* Name */}
      <div className="h-5 w-4/5 bg-slate-200 rounded animate-pulse" />
      <div className="h-5 w-3/5 bg-slate-200 rounded animate-pulse" />
      {/* Rating */}
      <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
      {/* Price */}
      <div className="h-8 w-28 bg-slate-200 rounded animate-pulse" />
      {/* Buttons */}
      <div className="grid grid-cols-5 gap-2 pt-1">
        <div className="col-span-2 h-10 bg-slate-200 rounded-xl animate-pulse" />
        <div className="col-span-3 h-10 bg-slate-200 rounded-xl animate-pulse" />
      </div>
    </div>
  </div>
);

// ✅ Product Detail Skeleton
export const ProductDetailSkeleton = () => (
  <div className="bg-white rounded-2xl p-8 shadow-sm flex flex-col md:flex-row gap-10">
    {/* Image */}
    <div className="flex-1 space-y-3">
      <div className="w-full aspect-square bg-slate-200 rounded-xl animate-pulse" />
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-16 h-16 bg-slate-200 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>

    {/* Info */}
    <div className="flex-1 space-y-4">
      <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
      <div className="h-8 w-4/5 bg-slate-200 rounded animate-pulse" />
      <div className="h-8 w-3/5 bg-slate-200 rounded animate-pulse" />
      <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
      <div className="h-10 w-40 bg-slate-200 rounded animate-pulse" />
      <div className="space-y-2 pt-2">
        <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
        <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
      </div>
      <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
      <div className="h-14 w-full bg-slate-200 rounded-xl animate-pulse" />
    </div>
  </div>
);

// ✅ Order Card Skeleton
export const OrderCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
    {/* Header */}
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />
        <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
      </div>
      <div className="flex gap-2">
        <div className="h-7 w-24 bg-slate-200 rounded-full animate-pulse" />
        <div className="h-7 w-16 bg-slate-200 rounded-full animate-pulse" />
      </div>
    </div>

    {/* Items */}
    {[1, 2].map((i) => (
      <div key={i} className="flex items-center gap-4">
        <div className="w-14 h-14 bg-slate-200 rounded-xl animate-pulse shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/5 bg-slate-200 rounded animate-pulse" />
          <div className="h-3 w-2/5 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
      </div>
    ))}

    {/* Footer */}
    <div className="flex justify-between items-end pt-2 border-t border-slate-100">
      <div className="space-y-2">
        <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="h-3 w-48 bg-slate-200 rounded animate-pulse" />
      </div>
      <div className="h-8 w-24 bg-slate-200 rounded animate-pulse" />
    </div>
  </div>
);

// ✅ Cart Item Skeleton
export const CartItemSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-5 flex gap-5 shadow-sm">
    <div className="w-28 h-28 bg-slate-200 rounded-xl animate-pulse shrink-0" />
    <div className="flex-1 space-y-3">
      <div className="h-5 w-3/4 bg-slate-200 rounded animate-pulse" />
      <div className="h-4 w-1/4 bg-slate-200 rounded animate-pulse" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-10 w-10 bg-slate-200 rounded-full animate-pulse" />
      </div>
    </div>
  </div>
);

// ✅ Admin Table Row Skeleton
export const TableRowSkeleton = () => (
  <tr className="border-t border-slate-100">
    <td className="p-4"><div className="w-12 h-12 bg-slate-200 rounded-lg animate-pulse" /></td>
    <td className="p-4"><div className="h-4 w-40 bg-slate-200 rounded animate-pulse" /></td>
    <td className="p-4"><div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" /></td>
    <td className="p-4"><div className="h-4 w-20 bg-slate-200 rounded animate-pulse" /></td>
    <td className="p-4"><div className="h-4 w-10 bg-slate-200 rounded animate-pulse" /></td>
    <td className="p-4"><div className="h-4 w-12 bg-slate-200 rounded animate-pulse" /></td>
    <td className="p-4">
      <div className="flex gap-2">
        <div className="h-8 w-16 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-8 w-16 bg-slate-200 rounded-lg animate-pulse" />
      </div>
    </td>
  </tr>
);