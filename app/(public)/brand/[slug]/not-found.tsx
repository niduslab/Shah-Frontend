import Link from "next/link";

export default function BrandNotFound() {
  return (
    <main className="min-h-screen bg-white">
      <div className="flex items-center justify-center py-24 px-4">
        <div className="text-center max-w-2xl">
          <div className="mb-6 text-6xl">🔍</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Brand Not Found</h1>
          <p className="text-lg text-gray-600 mb-6">
            The brand you're looking for doesn't exist in our database.
          </p>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8 text-left">
            <h2 className="font-semibold text-gray-900 mb-3">💡 Possible Reasons:</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">•</span>
                <span>The brand hasn't been created in the admin panel yet</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">•</span>
                <span>The brand slug in the URL doesn't match the database</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">•</span>
                <span>The backend API is not running or not accessible</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">•</span>
                <span>The brand is inactive in the database</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
            <h2 className="font-semibold text-gray-900 mb-3">🔧 For Admins:</h2>
            <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
              <li>Go to <code className="bg-white px-2 py-1 rounded text-xs">/admin/brands</code></li>
              <li>Create the brand with the correct slug</li>
              <li>Make sure the brand is set to "Active"</li>
              <li>Then customize the brand page content</li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/brands"
              className="inline-block rounded-lg bg-orange-500 px-6 py-3 font-medium text-white hover:bg-orange-600 transition-colors"
            >
              View All Brands
            </Link>
            <Link
              href="/admin/brands"
              className="inline-block rounded-lg bg-gray-800 px-6 py-3 font-medium text-white hover:bg-gray-900 transition-colors"
            >
              Go to Admin
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
