import { Construction } from 'lucide-react';

interface GenericPageProps {
  title: string;
  description?: string;
}

export function GenericPage({ title, description }: GenericPageProps) {
  return (
    <div className="p-6 flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Construction className="w-7 h-7 text-amber-600" />
        </div>
        <h2 className="text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-500">
          {description || 'This section is under active development. Check back soon!'}
        </p>
      </div>
    </div>
  );
}
