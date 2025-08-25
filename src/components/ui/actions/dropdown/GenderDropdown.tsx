import { useCharacterStore } from '~/store';
import {
  PyrenzFormControl,
  PyrenzOutlinedInput,
  PyrenzInputLabel,
  PyrenzSelect,
  PyrenzMenuItem,
} from '~/theme';
import { SelectChangeEvent } from '@mui/material';

export function GenderDropdown() {
  const gender = useCharacterStore((state) => state.gender);
  const setGender = useCharacterStore((state) => state.setGender);

  const genderOptions = [
    { value: 'unspecified', label: 'Unspecified' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];

  const handleChange = (event: SelectChangeEvent<string>) => {
    setGender(event.target.value as string);
  };

  return (
    <PyrenzFormControl fullWidth>
      <PyrenzInputLabel id="gender-label">Gender</PyrenzInputLabel>
      <PyrenzSelect
        labelId="gender-label"
        id="gender"
        value={gender}
        onChange={handleChange}
        input={<PyrenzOutlinedInput label="Gender" />}
        aria-label="Gender"
      >
        {genderOptions.map((option) => (
          <PyrenzMenuItem key={option.value} value={option.value}>
            {option.label}
          </PyrenzMenuItem>
        ))}
      </PyrenzSelect>
    </PyrenzFormControl>
  );
}
