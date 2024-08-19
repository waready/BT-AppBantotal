<template>
    <q-page class="q-pa-sm">
        <q-card class="bg-transparent no-shadow no-border" bordered v-if="productos">
            <q-card-section class="q-pa-none">
                <div class="row q-col-gutter-sm ">
                    <div v-for="(item, index) in productos" :key="index" class="col-md-3 col-sm-12 col-xs-12">
                        <q-item :style="`background-color: #5064b5`" class="q-pa-none">
                            <q-item-section v-if="icon_position === 'left'" side :style="`background-color: #3e51b5`"
                                class=" q-pa-lg q-mr-none text-white">
                                <q-icon :name="'person'" color="white" size="24px"></q-icon>
                            </q-item-section>
                            <q-item-section class=" q-pa-md q-ml-none  text-white">
                                <q-item-label class="text-white text-h6 text-weight-bolder">{{ item.moneda }}</q-item-label>
                                <q-item-label>{{ item.nombre }}</q-item-label>
                            </q-item-section>
                            <q-item-section v-if="icon_position === 'right'" side class="q-mr-md text-white">
                                <q-icon :name="item.icon" color="white" size="44px"></q-icon>
                            </q-item-section>
                        </q-item>
                    </div>
                </div>
            </q-card-section>
        </q-card>
        <div class="q-pa-md" v-else>
            <div class="q-gutter-md row items-start">
                <q-card flat bordered v-for="type in 7" :key="type" style="width: 400px">
                    <q-card-section>
                        <q-skeleton :type="'QInput'" />
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </q-page>
</template>

<script>
import { defineComponent } from 'vue'
//import ApiService from "src/ApiService.js";
import { QSpinnerGears } from 'quasar'
import  AuthService  from "src/auth-module/AuthServices.js";

export default defineComponent({
    name: "CardSocial",
    mounted() {
        this.getAllProductos();
    },
    data() {
        return {
            productos: null,
            skeletonTypes: [
                'QInput',
            ],
        }
    },
    props: {
        icon_position: {
            required: false,
            default: "left"
        }
    },
    computed: {
        items: function () {
            return this.icon_position === "left"
                ? [
                    {
                        title: "My Account",
                        icon: "person",
                        value: "200",
                        color1: "#5064b5",
                        color2: "#3e51b5"
                    },
                    {
                        title: "Followers",
                        icon: "fab fa-twitter",
                        value: "500",
                        color1: "#f37169",
                        color2: "#f34636"
                    },
                    {
                        title: "Connections",
                        icon: "fab fa-google",
                        value: "50",
                        color1: "#ea6a7f",
                        color2: "#ea4b64"
                    },
                    {
                        title: "Website Visits",
                        icon: "bar_chart",
                        value: "1020",
                        color1: "#a270b1",
                        color2: "#9f52b1"
                    }
                ]
                : [
                    {
                        title: "Monthly Income",
                        icon: "fas fa-dollar-sign",
                        value: "$ 20k",
                        color1: "#546bfa",
                        color2: "#3e51b5"
                    },
                    {
                        title: "Weekly Sales",
                        icon: "fas fa-chart-bar",
                        value: "20",
                        color1: "#3a9688",
                        color2: "#3e51b5"
                    },
                    {
                        title: "New Customers",
                        icon: "fas fa-chart-line",
                        value: "321",
                        color1: "#7cb342",
                        color2: "#3e51b5"
                    },
                    {
                        title: "Active Users",
                        icon: "person",
                        value: "82",
                        color1: "#f88c2b",
                        color2: "#3e51b5"
                    }
                ];
        }
    },
    methods: {
        async getAllProductos() {
            const dismiss = this.$q.notify({
                spinner: QSpinnerGears,
                message: '<p>Esperando al Servidor &nbsp;<span><i class="fa fa-server" aria-hidden="true"></i> <span> <p>',
                timeout: 0, // Establecer el timeout a 0 para que la notificación no se cierre automáticamente
                html: true
            });

            await ApiService.GetProductos().then((response) => {
                this.productos = response.sdtProductos.sBTProducto;
                if (response.Erroresnegocio.BTErrorNegocio[0]) {
                    this.showNotif(response.Erroresnegocio.BTErrorNegocio[0].Descripcion);
                    if (response.Erroresnegocio.BTErrorNegocio[0].Descripcion == "Sesión inválida") {
                        setTimeout(() => {
                            AuthService.logout();
                            this.$store.dispatch("app/logout");
                            this.$router.push("/login");
                        }, 3000)
                    }else{
                        if (!this.productos[0]) {
                            this.showNotif("No se encuentran registros!");
                        }
                    }
                }
                dismiss()
            }).catch((e) => {

                this.showNotif(e.message)
                setTimeout(() => {
                    dismiss() // will hide the notification above
                }, Math.random() * 2000)

            })
            // if (result) {
            //     alert("HI")
            //     dismiss()
            // } else {
            //     setTimeout(() => {
            //         dismiss() // will hide the notification above
            //     }, Math.random() * 2000)
            // }

            // if (!result.success) {
            //     this.showNotif(result.message)
            // } else {
            //     if (!result.data.Erroresnegocio.BTErrorNegocio[0]) {
            //         this.registrar(result.data);
            //     } else {
            //         this.showNotif(result.data.Erroresnegocio.BTErrorNegocio[0].Descripcion)
            //     }
            // }
        },
        showNotif(message) {
            this.$q.notify({
                position: 'top-right',
                message: message,
                color: 'negative',
                icon: 'report_problem'
            })
        },
    }
})
</script>

