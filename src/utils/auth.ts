import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  //salt cadena de caracters aleatorea ,10 rondas cantida de veces que re ejecuata el hash
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const checkPassword = async (password: string, passwordDb:string) => {
    const result = await bcrypt.compare(password, passwordDb)
    return result
}

export const slug = (handle: string) => {
  const slug = handle.toLowerCase().trim().replace(/[áéíóúÁÉÍÓÚñÑ]/g, (match) => {
    const map = {
      á: "a",
      é: "e",
      í: "i",
      ó: "o",
      ú: "u",
      Á: "A",
      É: "E",
      Í: "I",
      Ó: "O",
      Ú: "U",
      ñ: "n",
      Ñ: "N"
    };
    return map[match];
  });

  const slughandle= slug.replace(/\s+/g,'')

  return slughandle
};
