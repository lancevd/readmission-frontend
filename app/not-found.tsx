import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-gray-900">404</h2>
        <h3 className="text-2xl font-semibold text-gray-700">Page Not Found</h3>
        <p className="text-gray-600">
          The page you're looking for doesn't exist.
        </p>
        <Link href="/">
          <Button>
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
