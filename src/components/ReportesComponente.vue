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
    const query = editor.getValue().replace(/\n/g, ' ')
    try {
        const res = await fetch('http://localhost:3333/api/v1/generar-reporte', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        })

        if (!res.ok) {
            const msg = await res.text()
            throw new Error(msg)
        }

        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'reporte.xlsx'
        a.click()
        window.URL.revokeObjectURL(url)
    } catch (err) {
        error.value = err.message
    }
}
</script>

<style scoped>
#editor {
    font-size: 14px;
}
</style>