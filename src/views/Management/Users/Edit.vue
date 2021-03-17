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

    <div class="row mt-3 mb-5">
        <div class="col-12">
            <div class="form-group text-start mt-4">
                <label class="font-weight-bold fs-2" for="permissions">Permissions</label>
                <div class="row mt-2">
                    <div class="col-12">
                        <button @click="savePermissions" class="btn btn-success">Save permissions</button>
                    </div>
                    <div class="col-lg-6 col-12 mt-3" v-for="(actions, entity) in userData.permissions" :key="entity">
                        
                        <div class="fs-4 fw-bold mb-1 text-capitalize">{{entity}}</div>
                        <ul class="list-group">
                            <li class="list-group-item" v-for="(permission, label) in actions" :key="entity + '-action-'+label">
                                <div class="form-check form-switch d-flex ps-0">
                                    <label class="form-check-label pe-1" :for="entity + '-' + label">{{label}}:</label>
                                    <input class="form-check-input ps-0 ms-0" type="checkbox" v-model="userData.permissions[entity][label]" :id="entity + '-' + label">
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="col-12">
                        <button @click="savePermissions" class="btn btn-success">Save permissions</button>
                    </div>
                </div>
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
                permissions: {}
            }
        }
    },
    computed: {
        user() {
            return this.$store.state.admin.users[this.$route.params.id]
        },
        role(){
            return this.$store.state.admin.roles[this.user.toolbox_role]
        },
        loading() {
            return this.$store.state.admin.loading.users
        },
        permissions(){
            return this.$store.state.admin.users[this.$route.params.id].permissions
        }
    },
    props: [],
    watch: {
    },
    methods: {
        savePermissions(){
            let that = this
            this.$store.dispatch("admin/saveUserPermissions", {
                permissions: that.userData.permissions,
                user_id: that.$route.params.id,
                vm: that
            })
        },
        modifyRole(r){
            let that = this
            this.$store.dispatch("admin/modifyRole", {
                role: r, 
                user_id: that.$route.params.id,
                vm: that
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

        this.userData.permissions = this.permissions
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
    .form-check .form-check-input{
        float:none;
        cursor: pointer;
    }
</style>