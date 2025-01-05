import bcrypt from "bcryptjs";

const hashPassword = (password: string): string => {
  const salt: string = bcrypt.genSaltSync(10);
  const hash: string = bcrypt.hashSync(password, salt);

  return hash;
};

const comparePassword = (password: string, hashedPassword: string): boolean => {
  return bcrypt.compareSync(password, hashedPassword);
};

export { hashPassword, comparePassword };
