<template>
  <div class="users container">
    <h1>This is the User Edit page</h1>
    <h2>User: {{user.first_name}} {{user.last_name}}</h2>

    <div class="row">
        <div class="col-12">
            <div class="form-group text-left">
                <label class="font-weight-bold" for="role">Role</label>
                <ul class="list-group">
                    <li :class="{'active': role == r}" class="list-group-item list-group-item-action text-capitalize" v-for="(r, id) in $store.state.admin.roles" :key="id"><a class="d-block" @click.stop.prevent="modifyRole(id)" href="#">{{r}}</a></li>
                </ul>
            </div>
        </div>
    </div>
  </div>
</template>

<script>

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
                return user.id == this.$route.params.id
            })
        },
        role(){
            return this.$store.state.auth.accountsRoles[this.$store.state.auth.account][0]
        }
    },
    props: [],
    watch: {
    },
    methods: {
        modifyRole(r){

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
</style>