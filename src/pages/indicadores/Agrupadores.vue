<template>
  <q-layout view="lHh Lpr lFf" style="background:linear-gradient( 135deg, #5B6A82 10%, #162b4d 100%)">
    <q-page-container>
      <section style="min-height: 17vh;" class="flex text-white flex-center layout_bg">
        <div style="position: relative">
          <div class="text-h4 text-center" style="text-decoration: underline;">
            Agrupadores
          </div>

          <div class="text-subtitle2 q-pt-sm text-center">
            Modulo de Indicadores para una vision detallada del ApiBanking.
          </div>
        </div>
      </section>
      <section class="q-pb-lg">
        <div class="row q-col-gutter-sm q-px-sm">
          <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12" v-for="(item,index) in agrupadores" :key="index">
            <card-pricing class="card" :icon="item.icon" @click="indicadorID(item.codigo)" :background_image="item.color" :text="item.descripcion">
            </card-pricing>
          </div>
        </div>
      </section>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'
import ApiService from "src/ApiService.js";
import AuthService from "src/auth-module/AuthServices.js";

const pricing_data = [
  {
    title: 'Basic',
    price: '$0',
    icon: 'home_work',
    background_image: 'linear-gradient(to right, #ed6ea0 0%, #ec8c69 100%)',
    text: 'This is good if your company size is between 2 and 10 Persons.'
  },
  {
    title: 'Small Company',
    price: '$25',
    icon: 'home',
    background_image: 'linear-gradient(-225deg, #5D9FFF 0%, #6BBBFF 100%)',
    text: 'This is good if your company size is between 2 and 10 Persons.'
  },
  {
    title: 'Extended',
    price: '$250',
    icon: 'apartment',
    background_image: 'linear-gradient(to right, #2B86C5 0%, #2B86C5 100%)',
    text: 'This is good if your company size is between 2 and 10 Persons.'
  },
  {
    title: 'Extra Pack',
    price: '$750',
    icon: 'business_center',
    background_image: 'linear-gradient(87deg, rgb(17, 205, 239), rgb(17, 113, 239)) !important',
    text: 'This is good if your company size is between 2 and 10 Persons.'
  },
]
export default defineComponent({
  name: "Agrupadores",
  mounted() {
    this.getAllAgrupadores()
  },
  components: {
    CardPricing: defineAsyncComponent(() => import('components/cards/CardPricing.vue'))
  },
  data() {
    return {
      year: (new Date()).getFullYear(),
      agrupadores: null,
      message: ''
    }
  },
  methods: {
    async getAllAgrupadores() {
      await ApiService.GetAgrupadores().then((response) => {
        if (response.Erroresnegocio.BTErrorNegocio[0]) {
          this.showNotif(response.Erroresnegocio.BTErrorNegocio[0].Descripcion)
          if (response.Erroresnegocio.BTErrorNegocio[0].Descripcion === "Sesión inválida") {
            setTimeout(() => {
              AuthService.logout();
              this.$store.dispatch("app/logout");
              this.$router.push("/login");
            }, 3000)
          } else {
            if (!this.agrupadores[0]) {
              this.showNotif("No se encuentran registros!");
            }
          }
        }

        this.agrupadores = response.sdtAgrupadores.sBTAgrupador.map((item) => {
          switch (item.codigo) {
            case 100:
              // "Condiciones Generales"
              item.icon = "fas fa-wrench";
              item.color = "linear-gradient(to right, #ed6ea0 0%, #ec8c69 100%)";
              break;
            case 200:
              // "Cajas y Sucursales"
              item.icon = "fas fa-building";
              item.color = "linear-gradient(to right, #2B86C5 0%, #2B86C5 100%)";
              break;
            case 300:
              // "Contabilidad"
              item.icon = "fas fa-file-contract";
              item.color = "linear-gradient(87deg, rgb(17, 205, 239), rgb(17, 113, 239)) !important";
              break;
            default:
              // sin icon
              item.icon = "";
              item.color = "";
              break;
          }
          return item;
        });

      });
    },
    indicadorID(id) {
      this.$router.push({ path: `/indicador/${id}` });
    },
    showNotif(message) {
      this.$q.notify({
        position: 'top-right',
        message: message,
        color: 'negative',
        icon: 'report_problem'
      })
    },
    //
  }
})
</script>

<style scoped>
.card {
  cursor: pointer;
}
</style>
