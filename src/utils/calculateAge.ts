export const calculateAge = (birthDate: string) => {
  const birth = new Date(birthDate);
  const reference = new Date("2025-01-01"); // as per requirement
  let age = reference.getFullYear() - birth.getFullYear();
  if (
    reference.getMonth() < birth.getMonth() ||
    (reference.getMonth() === birth.getMonth() && reference.getDate() < birth.getDate())
  ) {
    age--;
  }
  return age;
};
