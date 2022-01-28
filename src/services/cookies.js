const Prefix = {
    'loggingIn': false,
    'toolboxClient': true,
    'toolboxAccount': true,
    'oada_UID': false,
    'oada_UID_expire': false,
}
class Cookies {
    constructor(license) {
        this._license = license
    }
    set(name,value,expires_in_days = false) {
        if(Prefix[name]) name = `${this._license}-${name}`
        let expires = 'Session'
        if(expires_in_days){
            expires = new Date()
            expires.setDate(expires.getDate() + expires_in_days).toString()
        }
        document.cookie = `${name}=${value}; expires=${expires}; path=/`
        return expires.toString()
    }
    get(name) {
        if(Prefix[name]) name = `${this._license}-${name}`
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
        if(Prefix[name]) name = `${this._license}-${name}`
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    }
    //For migration from js-cookie
    remove(name) {
        if(Prefix[name]) name = `${this._license}-${name}`
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    }
}
export default new Cookies(window.location.pathname.split('/')[1])