export function removePassword<T extends { password: any }>(
  input: T | T[],
): Omit<T, 'password'> | Omit<T, 'password'>[] {
  if (Array.isArray(input)) {
    return input.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ password: _, ...userWithoutPassword }) => userWithoutPassword,
    );
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = input;
    return userWithoutPassword;
  }
}
