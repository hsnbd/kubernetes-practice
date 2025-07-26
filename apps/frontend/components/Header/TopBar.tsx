interface TopBarProps {
  message: string;
}

export default function TopBar({ message }: TopBarProps) {
  return (
    <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white py-2 px-4">
      <div className="container mx-auto flex items-center justify-center">
        <p className="text-sm font-medium text-center animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
}
