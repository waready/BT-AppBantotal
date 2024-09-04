<template>
  <q-page class="q-pa-md">
    <!-- Botón para crear nuevo registro -->
    <q-btn 
      label="Crear Nuevo" 
      color="secondary" 
      @click="openCreateDialog" 
      class="q-mb-md" 
      rounded
    />

    <!-- Tabla con funcionalidades de editar y eliminar -->
    <q-table 
      :rows="inventarios" 
      :columns="columns" 
      row-key="id" 
      :loading="loading" 
      :pagination.sync="pagination"
      :rows-per-page-options="[10, 20, 50]"
      class="q-mb-md"
    >
      <template v-slot:top-right>
        <q-input 
          filled 
          debounce="300" 
          placeholder="Buscar..." 
          v-model="search" 
          @input="onSearch" 
          clearable 
        />
      </template>

      <!-- Slot para agregar botones de acción en cada fila -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-pa-none">
          <q-btn 
            flat 
            color="primary" 
            icon="edit" 
            @click="openEditDialog(props.row)" 
            class="q-mr-xs"
            round
          />
          <q-btn 
            flat 
            color="secondary" 
            icon="delete" 
            @click="confirmDelete(props.row.id)" 
            round
          />
        </q-td>
      </template>
    </q-table>

    <!-- Diálogo para crear y editar registros -->
    <q-dialog v-model="dialogVisible">
      <q-card class="q-pa-md">
        <q-card-section>
          <q-input v-model="currentItem.codigo" label="Código" outlined />
          <q-input v-model="currentItem.descripcion" label="Descripción" outlined />
          <q-input v-model="currentItem.area_funcional" label="Área Funcional" outlined />
          <q-input v-model="currentItem.sistema" label="Sistema" outlined />
          <q-input v-model="currentItem.en_desarrollo" label="En Desarrollo" outlined />
        </q-card-section>
        <q-card-actions>
          <q-btn @click="saveItem" color="primary" label="Guardar" />
          <q-btn @click="dialogVisible = false" color="secondary" label="Cancelar" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Diálogo de confirmación de eliminación -->
    <q-dialog v-model="deleteDialogVisible">
      <q-card class="q-pa-md">
        <q-card-section>
          ¿Estás seguro de que deseas eliminar este registro?
        </q-card-section>
        <q-card-actions>
          <q-btn @click="deleteItem" color="secondary" label="Eliminar" />
          <q-btn @click="deleteDialogVisible = false" color="secondary" label="Cancelar" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      inventarios: [],
      loading: true,
      pagination: {
        page: 1,
        rowsPerPage: 10,
        sortBy: 'id',
        descending: false,
        rowsNumber: 0
      },
      search: '',
      dialogVisible: false,
      deleteDialogVisible: false,
      currentItem: {},
      itemToDelete: null,
      columns: [
        { name: 'codigo', label: 'Código', field: 'codigo', align: 'left', sortable: true },
        { name: 'descripcion', label: 'Descripción', field: 'descripcion', align: 'left', sortable: true },
        { name: 'area_funcional', label: 'Área Funcional', field: 'area_funcional', align: 'left', sortable: true },
        { name: 'sistema', label: 'Sistema', field: 'sistema', align: 'left', sortable: true },
        { name: 'en_desarrollo', label: 'En Desarrollo', field: 'en_desarrollo', align: 'center', sortable: true },
        { name: 'actions', label: 'Acciones', align: 'center', field: 'actions' }
      ]
    }
  },
  watch: {
    pagination: {
      handler() {
        this.fetchInventarios()
      },
      deep: true
    },
    search() {
      this.pagination.page = 1
      this.fetchInventarios()
    }
  },
  mounted() {
    this.fetchInventarios()
  },
  methods: {
    async fetchInventarios() {
      this.loading = true
      try {
        const response = await this.$axios.get('http://127.0.0.1:3333/api/v1/inventarios', {
          params: {
            page: this.pagination.page,
            limit: this.pagination.rowsPerPage,
            sortBy: this.pagination.sortBy || 'id',
            order: this.pagination.descending ? 'desc' : 'asc',
            search: this.search
          }
        })

        this.inventarios = response.data.data
        this.pagination.rowsNumber = response.data.total
      } catch (error) {
        console.error('Error al obtener los inventarios:', error)
      } finally {
        this.loading = false
      }
    },
    onSearch() {
      this.pagination.page = 1
      this.fetchInventarios()
    },
    openCreateDialog() {
      this.currentItem = {}
      this.dialogVisible = true
    },
    openEditDialog(item) {
      this.currentItem = { ...item }
      this.dialogVisible = true
    },
    async saveItem() {
      try {
        if (this.currentItem.id) {
          await this.$axios.put(`http://127.0.0.1:3333/api/v1/inventarios/${this.currentItem.id}`, this.currentItem)
        } else {
          await this.$axios.post('http://127.0.0.1:3333/api/v1/inventarios', this.currentItem)
        }
        this.dialogVisible = false
        this.fetchInventarios()
      } catch (error) {
        console.error('Error al guardar el inventario:', error)
      }
    },
    confirmDelete(id) {
      this.itemToDelete = id
      this.deleteDialogVisible = true
    },
    async deleteItem() {
      try {
        await this.$axios.delete(`http://127.0.0.1:3333/api/v1/inventarios/${this.itemToDelete}`)
        this.deleteDialogVisible = false
        this.fetchInventarios()
      } catch (error) {
        console.error('Error al eliminar el inventario:', error)
      }
    }
  }
}
</script>

<style scoped>
.q-page {
  background-color: #f9f9f9;
}

.q-btn {
  font-weight: 600;
}

.q-card {
  max-width: 600px;
}

.q-card-section {
  padding: 16px;
}

.q-input {
  margin-bottom: 16px;
}
</style>
