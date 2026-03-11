'use client';

export default function AdminTestPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        ✅ ADMIN ACCESS WORKING!
      </h1>
      <p className="text-lg text-gray-700 mb-4">
        If you can see this page, admin access is working without authentication.
      </p>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h2 className="text-xl font-semibold text-green-800 mb-2">Success!</h2>
        <p className="text-green-700">
          You have successfully accessed an admin page without any authentication blocking.
        </p>
      </div>
    </div>
  );
}