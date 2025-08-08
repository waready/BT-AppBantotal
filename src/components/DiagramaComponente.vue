<template>
  <div>
    <h2>Test Mermaid en Vue 2</h2>
    <div>
      <textarea
        v-model="umlCode"
        rows="8"
        cols="60"
        style="width:100%;margin-bottom:16px;font-family:monospace;"
      />
    </div>
    <div ref="mermaid"></div>
  </div>
</template>

<script>
import mermaid from 'mermaid'

export default {
  name: "MermaidTest",
  data() {
    return {
      umlCode: `classDiagram
        class Persona {
          +String nombre
          +int edad
        }
        class Empleado {
          +String puesto
          +double sueldo
        }
        Persona <|-- Empleado`
    }
  },
  mounted() {
    this.renderMermaid()
  },
  watch: {
    umlCode() {
      this.renderMermaid()
    }
  },
  methods: {
    renderMermaid() {
      if (!this.$refs.mermaid) return
      this.$refs.mermaid.innerHTML = ''
      // Inicializa Mermaid solo una vez por render
      mermaid.initialize({ startOnLoad: false, theme: 'default' })
      const id = 'mermaid-' + Math.random().toString(36).substr(2, 9)
      try {
        // Elimina espacios extra y saltos de línea vacíos
        const cleanCode = this.umlCode.trim()
        mermaid.parse(cleanCode)
        mermaid.render(id, cleanCode, (svg) => {
          this.$refs.mermaid.innerHTML = svg
        })
      } catch (e) {
        this.$refs.mermaid.innerHTML = `<pre style="color:red;">Diagrama inválido o sintaxis incorrecta</pre>`
      }
    }
  }
}
</script>
