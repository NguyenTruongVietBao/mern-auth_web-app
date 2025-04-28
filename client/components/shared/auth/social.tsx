export default function Social() {
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <button
                className="flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100"
            >
                Continue with Google
            </button>
            <button
                className="flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
            >
                Continue with GitHub
            </button>
        </div>
    );
}
