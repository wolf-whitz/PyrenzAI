import { CharacterForm } from '~/components';
import { Sidebar, CommunityGuidelines } from '~/components';

export default function CreatePage() {
  return (
    <div className="flex flex-col sm:flex-row w-full h-full">
      <div className="w-full sm:w-64">
        <Sidebar />
      </div>

      <main className="flex-1 px-4">
        <CharacterForm />
        <div className="block sm:hidden">
          <CommunityGuidelines className="mt-4" />
        </div>
      </main>

      <div className="hidden sm:block sm:w-64">
        <CommunityGuidelines />
      </div>
    </div>
  );
}
