import { Link } from 'react-router-dom';

export default function AuthPlaceholder({ type }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-4xl font-bold mb-4">{type} Page</h1>
      <p className="text-gray-400 mb-8">This is just a placeholder to test routing from the landing page CTA buttons.</p>
      <Link to="/" className="px-6 py-3 bg-brand-600 rounded-full font-medium hover:bg-brand-500 transition-colors">
        Back to Home
      </Link>
    </div>
  );
}
