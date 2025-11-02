export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <div className="mt-4 text-center text-gray-600 dark:text-gray-300">
          Finding your perfect match...
        </div>
      </div>
    </div>
  );
}
