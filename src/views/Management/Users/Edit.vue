<template>
  <div class="users container">
      <div v-if="loading" class="loader-container position-absolute top-0 bottom-0 start-0 end-0 d-flex justify-content-center align-items-center">
        <i class="fas fa-circle-notch fa-spin fs-1"></i>
    </div>
    <h1>This is the User Edit page</h1>
    <h2>User: {{user.first_name}} {{user.last_name}}</h2>

    <div class="row">
        <div class="col-12">
            <div class="form-group text-start">
                <label class="font-weight-bold" for="role">Role</label>
                <ul class="list-group">
                    <li :class="{'active': role == r}" class="list-group-item list-group-item-action text-capitalize" v-for="(r, id) in $store.state.admin.roles" :key="id">
                        <a class="d-block" @click.stop.prevent="modifyRole(id)" href="#">{{r}}</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'ManageUserEdit',
    data(){
        return {
            userData: {
                role: false
            }
        }
    },
    computed: {
        user() {
            return this.$store.state.admin.users.find(user => {
                return user.user_id == this.$route.params.id
            })
        },
        role(){
            return this.$store.state.admin.roles[this.user.toolbox_role]
        },
        loading() {
            return this.$store.state.admin.loading.users
        },
    },
    props: [],
    watch: {
    },
    methods: {
        modifyRole(r){
            this.$store.state.admin.loading.users = true
            axios.post(this.$store.state.admin.adminAPI + "/users/setRole", {
                "user_id": this.user.user_id,
                "role" : r
            }).then(re => {
                if( re.data.success ){
                    this.$store.state.admin.loading.users = false
                    this.$store.state.admin.users = re.data.users
                }
            }).catch(error => {
                console.log(error);
                this.$store.state.admin.loading.users = false
            })
            
        }
    },
    created() {
        let roleName = this.$store.state.auth.accountsRoles[this.$store.state.auth.account][0];
        for (let index in this.$store.state.admin.roles) {
            if( roleName == this.$store.state.admin.roles[index]){
                this.userData.role = index
            }
        }
    },
    mounted() {
    },
    components: {},
}
</script>
<style scoped>
    .list-group-item.active a,
    .list-group-item.active:hover a,
    .list-group-item.active:active a{
        color:white;
    }
    .fa-circle-notch{
        /* font-size:50px; */
        color:white;
    }
    .loader-container{
        background-color: rgba(0, 0, 0, .6);
        z-index:10;
    }
</style>