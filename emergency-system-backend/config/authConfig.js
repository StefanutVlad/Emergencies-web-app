//jsonwebtoken functions such as verify() or sign() use algorithm that
//needs a secret key (as String) to encode and decode token.
const config = { secret: "emergency-system-secret-key" };
export default config;
