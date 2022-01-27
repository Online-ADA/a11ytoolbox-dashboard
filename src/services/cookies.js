const Legacy = {
};
class Cookies {
    constructor() {
    }
    set(name,value,expires_in_days = false) {
        let expires = 'Session'
        if(expires_in_days){
            expires = new Date()
            expires.setDate(expires.getDate() + expires_in_days).toString()
        }
        document.cookie = `${name}=${value}; expires=${expires}; path=/`
        return expires.toString()
    }
    get(name) {
        name = name + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return false;
    }
    delete(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    }
    //For easy migration from js-cookie
    remove(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    }
}
export default new Cookies()