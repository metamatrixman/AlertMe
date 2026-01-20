import { HomeIcon, UserIcon, CogIcon } from '@heroicons/react/solid';

export function HeroiconsExample() {
  return (
    <div className="flex space-x-4">
      <HomeIcon className="w-6 h-6 heroicons-primary" />
      <UserIcon className="w-6 h-6 heroicons-secondary" />
      <CogIcon className="w-6 h-6 heroicons-primary" />
    </div>
  );
}