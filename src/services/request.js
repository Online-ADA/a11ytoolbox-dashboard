import Vue from 'vue'
class Request {
    /* Args to pass:
        - params ~ Object: additional data to be sent with the request
        - onError ~ Object or Boolean: 
            - Object: Contains information on how to handle notifications and callbacks.
            Properties:
                - silent - Boolean: If true, will not display a notification
                - callback - function
                * All properties available at https://github.com/euvl/vue-notification#component-props
            - True: Uses the default values to notify. No default callback
            - False: Does not notify the user
        - onSuccess ~ Object or Boolean: Same as onError
        - onInfo ~ Object or Boolean: Same as onError
        - onWarn ~ Object or Boolean: Same as onError
        - router ~ The router object for redirecting a user

        **Example:
        args = {
            params: { user_id: id },
            onSuccess: {
                silent: true
            },
            onError: {
                title: 'Error',
                text: 'There was an error updating your project',
                type: 'error',
                callback: ()=>{
                    router.push({path: '/'})
                }
            },
            router: this.$router
        }
    */

    mute = false;
    
    constructor(){
        this.defaultError = {
            title: 'Error',
            type: 'error'
        }
        this.defaultSuccess = {
            title: 'Success',
            type: 'success'
        }
        this.defaultInfo = {
            title: 'Info',
            type: 'info'
        }
        this.defaultWarn = {
            title: 'Warning',
            type: 'warn'
        }
    }

    async getPromise(url, args = {}){
        if( args.async && args.async === false ){
            return await new Promise( (resolve, reject)=> {
                Vue.prototype.$http.get(url, args.params || {}).then(response =>{
                    this.checkForRedirect(response)
                    resolve(response)
                }).catch( response => {
                    this.checkForRedirect(response)
                    reject(response)
                })
            })
        }
        else{
            return new Promise( (resolve, reject)=> {
                Vue.prototype.$http.get(url, {params: args.params || {}}).then(response =>{
                    this.checkForRedirect(response)
                    resolve(response)
                }).catch( response => {
                    this.checkForRedirect(response)
                    reject(response)
                })
            })
        }
    }
    async postPromise(url, args = {params: {}}){
        if( args.async === false ){
            return await new Promise( (resolve, reject)=> {
                Vue.prototype.$http.post(url, args.params || {}).then(response =>{
                    this.checkForRedirect(response)
                    resolve(response)
                }).catch( response => {
                    this.checkForRedirect(response)
                    reject(response)
                })
            })
        }
        else{
            return new Promise( (resolve, reject)=> {
                Vue.prototype.$http.post(url, args.params || {}).then(response =>{
                    this.checkForRedirect(response)
                    resolve(response)
                }).catch( response => {
                    this.checkForRedirect(response)
                    reject(response)
                })
            })
        }
    }
    async destroyPromise(url, args = {params: {}}){
        if( args.async === false ){
            return await new Promise( (resolve, reject)=> {
                Vue.prototype.$http.delete(url, args.params || {}).then(response =>{
                    this.checkForRedirect(response)
                    resolve(response)
                }).catch( response => {
                    this.checkForRedirect(response)
                    reject(response)
                })
            })
        }
        else{
            return new Promise( (resolve, reject)=> {
                Vue.prototype.$http.delete(url, args.params || {}).then(response =>{
                    this.checkForRedirect(response)
                    resolve(response)
                }).catch( response => {
                    this.checkForRedirect(response)
                    reject(response)
                })
            })
        }
    }

    async patchPromise(url, args = {params: {}}){
        if( args.async === false ){
            return await new Promise( (resolve, reject)=> {
                Vue.prototype.$http.patch(url, args.params || {}).then(response =>{
                    this.checkForRedirect(response)
                    resolve(response)
                }).catch( response => {
                    this.checkForRedirect(response)
                    reject(response)
                })
            })
        }
        else{
            return new Promise( (resolve, reject)=> {
                Vue.prototype.$http.patch(url, args.params || {}).then(response =>{
                    this.checkForRedirect(response)
                    resolve(response)
                }).catch( response => {
                    this.checkForRedirect(response)
                    reject(response)
                })
            })
        }
    }

    get(url, args = {onSuccess: true, onError: true, onInfo: true, onWarn: true}){
        let params = args.params || {};
        
        Vue.prototype.$http.get(url, params)
        .then(response => {
            this.checkForRedirect(response)
            if( response.data.success && args.onSuccess ){
                if( args.onSuccess.type == undefined ){
                    args.onSuccess.type = "success"
                }
                this.parseArgs(args.onSuccess, response)
                return
            }
            if( !response.data.success && args.onWarn ){
                if( args.onWarn.type == undefined ){
                    args.onWarn.type = "warn"
                }
                this.parseArgs(args.onWarn, response)
                return
            }
        }).catch(error => {
            this.checkForRedirect(error)
            console.log(error)
            if( args.onError ){
                if( args.onError.type == undefined ){
                    args.onError.type = "error"
                }
                this.parseArgs(args.onError, error)
            }
        })
        
    }
    post(url, args = {onSuccess: true, onError: true, onInfo: true, onWarn: true}){

        let requestArgs = {}
        requestArgs.params = args.params || {}
        requestArgs.config = {}
        requestArgs.config.headers = {...Vue.prototype.$http.defaults.headers.common, ...args.headers || {}}
        
        Vue.prototype.$http.post(url, requestArgs.params, requestArgs.config)
        .then(response => {
            this.checkForRedirect(response)
            if( response.data.success && args.onSuccess ){
                if( args.onSuccess.type == undefined ){
                    args.onSuccess.type = "success"
                }
                this.parseArgs(args.onSuccess, response)
            }
            if( !response.data.success && args.onWarn ){
                if( args.onWarn.type == undefined ){
                    args.onWarn.type = "warn"
                }
                this.parseArgs(args.onWarn, response)
                return
            }
        }).catch(error => {
            this.checkForRedirect(error)
            console.log(error)
            if( args.onError ){
                if( args.onError.type == undefined ){
                    args.onError.type = "error"
                }
                this.parseArgs(args.onError, error)
            }
        })
        
    }

    parseArgs(args, response){
        let callback = false
        if( args.callback ){
            callback = args.callback
            delete args.callback
        }
        let notifyArgs = args
        if( notifyArgs && !notifyArgs.silent && !this.mute ){
            Vue.notify(notifyArgs)
        }
        
        if( callback ){
            callback(response)
        }
    }

    checkForRedirect(response){
        if( response.response != undefined && response.response.data.message == "Unauthenticated." ){
            // window.App.$store.dispatch("auth/logout", window.App.$router)
            if( window.App.$router.currentRoute.path != "/" ){
                this.mute = true
                window.App.$store.state.auth.authMessage = "You've been logged out. Please log in again"
                window.App.$router.push({path: "/"})
            }

            return
        }
        if(response.response  != undefined && response.response.data.message == 'No Account Access') {
            window.location = window.App.$store.state.auth.accapi+"/signin/?oada_redirect=/"
        }
        if( response.data.details == "incorrect_permissions" || response.data.details == "incorrect_role" ){
            // window.App.$store.dispatch("auth/logout", window.App.$router)
            if( window.App.$router.currentRoute.path != "/" ){
                this.mute = true
                window.App.$store.state.auth.authMessage = window.App.$store.state.auth.authMessages[response.data.details]
                window.App.$router.push({path: "/"})
            }
            
            return
        }
    }

    unmute(){
        this.mute = false
    }

    muted(){
        return this.mute
    }
}

export default new Request()