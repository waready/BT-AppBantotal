<template>
    <q-page class="q-pa-md">
      <q-btn 
        label="Crear Nuevo Sistema" 
        color="primary" 
        @click="openCreateDialog" 
        class="q-mb-md" 
        rounded
      />
  
      <q-table 
        :rows="sistemas" 
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
              color="negative" 
              icon="delete" 
              @click="confirmDelete(props.row.id)" 
              round
            />
          </q-td>
        </template>
      </q-table>
  
      <q-dialog v-model="dialogVisible">
        <q-card class="q-pa-md">
          <q-card-section>
            <q-input v-model="currentItem.cod_area_funcional" label="Código Área Funcional" outlined />
            <q-input v-model="currentItem.cod_sistema" label="Código Sistema" outlined />
            <q-input v-model="currentItem.corr" label="Correlativo" outlined />
            <q-input v-model="currentItem.sistema" label="Sistema" outlined />
          </q-card-section>
          <q-card-actions>
            <q-btn @click="saveItem" color="primary" label="Guardar" />
            <q-btn @click="dialogVisible = false" color="secondary" label="Cancelar" />
          </q-card-actions>
        </q-card>
      </q-dialog>
  
      <q-dialog v-model="deleteDialogVisible">
        <q-card class="q-pa-md">
          <q-card-section>
            ¿Estás seguro de que deseas eliminar este sistema?
          </q-card-section>
          <q-card-actions>
            <q-btn @click="deleteItem" color="negative" label="Eliminar" />
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
        sistemas: [],
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
          { name: 'cod_area_funcional', label: 'Código Área Funcional', field: 'cod_area_funcional', align: 'left', sortable: true },
          { name: 'cod_sistema', label: 'Código Sistema', field: 'cod_sistema', align: 'left', sortable: true },
          { name: 'corr', label: 'Correlativo', field: 'corr', align: 'left', sortable: true },
          { name: 'sistema', label: 'Sistema', field: 'sistema', align: 'left', sortable: true },
          { name: 'actions', label: 'Acciones', align: 'center', field: 'actions' }
        ]
      }
    },
    mounted() {
      this.fetchSistemas()
    },
    methods: {
      async fetchSistemas() {
        this.loading = true
        try {
          const response = await this.$axios.get('http://127.0.0.1:3333/api/v1/sistemas', {
            params: {
              page: this.pagination.page,
              limit: this.pagination.rowsPerPage,
              sortBy: this.pagination.sortBy || 'id',
              order: this.pagination.descending ? 'desc' : 'asc',
              search: this.search
            }
          })
  
          this.sistemas = response.data
          this.pagination.rowsNumber = response.data.total
        } catch (error) {
          console.error('Error al obtener los sistemas:', error)
        } finally {
          this.loading = false
        }
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
            await this.$axios.put(`http://127.0.0.1:3333/api/v1/sistemas/${this.currentItem.id}`, this.currentItem)
          } else {
            await this.$axios.post('http://127.0.0.1:3333/api/v1/sistemas', this.currentItem)
          }
          this.dialogVisible = false
          this.fetchSistemas()
        } catch (error) {
          console.error('Error al guardar el sistema:', error)
        }
      },
      confirmDelete(id) {
        this.itemToDelete = id
        this.deleteDialogVisible = true
      },
      async deleteItem() {
        try {
          await this.$axios.delete(`http://127.0.0.1:3333/api/v1/sistemas/${this.itemToDelete}`)
          this.deleteDialogVisible = false
          this.fetchSistemas()
        } catch (error) {
          console.error('Error al eliminar el sistema:', error)
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
  