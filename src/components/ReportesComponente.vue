<template>
    <q-page class="q-pa-md">
        <q-card>
            <q-card-section>
                <div class="text-h5">Editor de consultas SQL</div>
                <q-banner class="bg-warning text-black q-mt-md">
                    Recuerda que solo se permiten hasta <strong>26 columnas (A - Z)</strong>.
                </q-banner>
                <div id="editor" class="q-mt-md" style="height: 300px; border: 1px solid #ccc"></div>
                <q-btn color="primary" label="Generar Reporte" icon="download" class="q-mt-md"
                    @click="generarReporte" />
                <q-banner v-if="error" class="bg-red text-white q-mt-md">
                    {{ error }}
                </q-banner>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup>
import ApiService from 'src/ApiService'
import { onMounted, ref } from 'vue'
import ace from 'ace-builds'
import 'ace-builds/src-noconflict/mode-sql'
import 'ace-builds/src-noconflict/theme-monokai'

const error = ref('')
let editor

onMounted(() => {
    editor = ace.edit('editor')
    editor.setTheme('ace/theme/monokai')
    editor.session.setMode('ace/mode/sql')
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true
    })
})

const generarReporte = async () => {
  error.value = ''
  const query = editor.getValue() // no hace falta reemplazar \n
  try {
    // tu ApiService debe pasar responseType:'blob'
    const res = await ApiService.GetConsultaQuery({ query })

    if (res.status !== 200) {
      // Si el backend devolvió JSON de error, viene como blob: léelo
      let msg = `HTTP ${res.status}`
      try {
        const text = await res.data.text()
        msg = (JSON.parse(text).error) || text || msg
      } catch (_) {}
      throw new Error(msg)
    }

    const blob = res.data // axios con responseType:'blob'
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'reporte.xlsx'
    a.click()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    error.value = err.message || 'Error al generar el reporte'
  }
};
</script>

<style scoped>
#editor {
    font-size: 14px;
}
</style>