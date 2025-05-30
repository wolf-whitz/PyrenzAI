import { DropdownField } from '~/components';
import { useCharacterStore } from '~/store';

export function GenderDropdown() {
  const gender = useCharacterStore((state) => state.gender);
  const setGender = useCharacterStore((state) => state.setGender);

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];

  return (
    <DropdownField
      name="gender"
      value={gender}
      onChange={(val) => setGender(val)}
      label="Gender"
      options={genderOptions}
      ariaLabel="Gender"
    />
  );
}
