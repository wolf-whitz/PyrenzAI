import { CharacterForm } from '~/components';
import { Sidebar, CommunityGuidelines } from '~/components';

export function CreatePage() {
  return (
    <div className="flex flex-col sm:flex-row w-full h-full">
      <div className="w-full sm:w-64 p-4 sm:p-0">
        <Sidebar />
      </div>

      <main className="flex-1 p-4 sm:p-6">
        <CharacterForm />
        <div className="block sm:hidden mt-4">
          <CommunityGuidelines />
        </div>
      </main>

      <div className="hidden sm:block sm:w-64 p-4 sm:p-0">
        <CommunityGuidelines />
      </div>
    </div>
  );
}
