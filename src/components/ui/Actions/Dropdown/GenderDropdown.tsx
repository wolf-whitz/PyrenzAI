import { Select, MenuItem } from '@mui/material';
import {
  PyrenzFormControl,
  PyrenzOutlinedInput,
  PyrenzInputLabel,
  PyrenzAccordionInput
} from '~/theme';
import { useCharacterStore } from '~/store';

export function GenderDropdown() {
  const gender = useCharacterStore((state) => state.gender);
  const setGender = useCharacterStore((state) => state.setGender);

  const genderOptions = [
    { value: 'unspecified', label: 'Unspecified' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];

  return (
    <PyrenzAccordionInput label="Gender">
      <PyrenzFormControl fullWidth>
        <PyrenzInputLabel id="gender-label">Gender</PyrenzInputLabel>
        <Select
          labelId="gender-label"
          id="gender"
          value={gender}
          onChange={(event) => setGender(event.target.value)}
          input={<PyrenzOutlinedInput label="Gender" />}
          aria-label="Gender"
        >
          {genderOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </PyrenzFormControl>
    </PyrenzAccordionInput>
  );
}
