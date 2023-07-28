<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="q-pa-md shadow-2 my_card" bordered>

          <q-card-section class="text-center">
            <!-- <div class="text-grey-9 text-h5 text-weight-bold">Sign in</div>
            <div class="text-grey-8">Sign in below to access your account</div> -->
            <q-img
              src="~assets/logoB.png"
            />
          </q-card-section>
          <q-card-section>
            <q-input dense outlined v-model="username" label="Usuario"></q-input>
            <q-input dense outlined class="q-mt-md" v-model="password" type="password" label="Contraseña"></q-input>
          </q-card-section>
          <q-card-section>
            <q-btn style="border-radius: 8px;"
              color="dark" rounded size="md"
              label="Sign in" no-caps
              class="full-width"
              @click="login()"
              ></q-btn>
          </q-card-section>
          <q-card-section class="text-center q-pt-none">
            <div class="text-grey-8">Don't have an account yet?
              <a href="#" class="text-dark text-weight-bold" style="text-decoration: none">
                <span class="text-red-9">Signup.</span>
              </a>
            </div>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import  AuthService  from "src/auth-module/AuthServices.js";
// import Transition from "@/components/Transition.vue";

export default defineComponent({
  name: 'Login',
  setup(){
    return{
      username:"instalador",
      password:"Bantotal2015"
    }
  },
  methods:{
     async login() {
      var result = await AuthService.login(
        this.username.toUpperCase(),
        this.password
      );
      if(!result.success){
        this.message = result.message;
        setTimeout(() => this.message = false, 3500);
      }else{
        if (!result.data.Erroresnegocio.BTErrorNegocio[0]) {
          this.registrar(result.data);
        } else {
          this.message = result.data.Erroresnegocio.BTErrorNegocio[0].Descripcion;
          setTimeout(() => this.message = false, 3500);
        }
      }
    },
    async registrar(user) {
      await this.$store.dispatch("login",user);
      this.$router.push("/");
    }
  }
})
</script>

<style scoped>

.my_card {
  width: 23rem;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

</style>


