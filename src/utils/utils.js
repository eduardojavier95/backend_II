import bcrypt from "bcrypt"
import { fileURLToPath } from "url";
import { dirname } from "path";

// process to use hashSync function to encrypt the password
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

// process to compare raw password with encrypted
export const isValid = (raw_password, password_hashed) => bcrypt.compareSync(password_hashed, raw_password)


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname