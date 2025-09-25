export const isTokenExpired = (token: string | null): boolean => {
   if (!token) return true;
   try {
      const payloadBase64 = token.split('.')[1];
      if (!payloadBase64) return true;

      const decodedJson = JSON.parse(atob(payloadBase64));
      const exp = decodedJson.exp;
      const now = Math.floor(Date.now() / 1000);

      return !exp || exp < now + 10;
   } catch (e) {
      return true;
   }
};
