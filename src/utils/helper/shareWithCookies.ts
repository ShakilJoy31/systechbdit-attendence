import Cookies from "js-cookie";

type CookieOption = "set" | "get" | "remove";

export const shareWithCookies = (
  option: CookieOption,
  key: string,
  expireByMin: number = 0,
  value?: string
): string | null | void => {
  
  if (option === "set") {
    if (!value) {
      console.error('Value is required for set action');
      return;
    }
    
    // js-cookie expects days, so convert minutes to days
    const expiresInDays = expireByMin > 0 ? expireByMin / (24 * 60) : undefined;
    
    return Cookies.set(key, value, {
      expires: expiresInDays, // Days, not Date object
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  }
  
  if (option === "get") {
    const cookieValue = Cookies.get(key);
    return cookieValue || null;
  }
  
  if (option === "remove") {
    Cookies.remove(key, { path: '/' });
    return;
  }
  
  return null;
};