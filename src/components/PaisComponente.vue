<template>
  <q-page class="q-pa-md">
    <q-btn
      label="Crear Nuevo País"
      color="secondary"
      @click="openCreateDialog"
      class="q-mb-md"
      rounded
    />

    <q-table
      :rows="paises"
      :columns="columns"
      row-key="id"
      :loading="loading"
      v-model:pagination="pagination"
      :rows-per-page-label="'Registros por página:'"
      @request="onRequest"
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
            color="secondary"
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
          <q-input v-model="currentItem.nombre" label="Nombre del País" outlined />
          <q-input v-model="currentItem.codigo" label="Código" outlined />
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
          ¿Estás seguro de que deseas eliminar este país?
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
import ApiService from 'src/ApiService'

export default {
  data() {
    return {
      paises: [],
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
        { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left', sortable: true },
        { name: 'codigo', label: 'Código', field: 'codigo', align: 'left', sortable: true },
        { name: 'actions', label: 'Acciones', align: 'center', field: 'actions' }
      ]
    }
  },
  mounted() {
    this.fetchPaises()
  },
  watch: {
    pagination: {
      handler() {
        this.fetchPaises()
      },
      deep: true
    },
    search() {
      this.pagination.page = 1
      this.fetchPaises()
    }
  },
  methods: {
    async fetchPaises() {
      this.loading = true
      try {
        const limit = this.pagination.rowsPerPage === 0 ? this.pagination.rowsNumber : this.pagination.rowsPerPage
        let params = {
          page: this.pagination.page,
          limit: limit,
          sortBy: this.pagination.sortBy || 'id',
          order: this.pagination.descending ? 'desc' : 'asc',
          search: this.search
        }
        const response = await ApiService.GetPaises(params)

        this.paises = response.data || []
        this.pagination.rowsNumber = response.total || 0
      } catch (error) {
        console.error('Error al obtener los países:', error)
      } finally {
        this.loading = false
      }
    },
    onRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      this.pagination.page = page;
      this.pagination.rowsPerPage = rowsPerPage;
      this.pagination.sortBy = sortBy;
      this.pagination.descending = descending;
      this.fetchPaises();
    },
    onSearch() {
      this.pagination.page = 1
      this.fetchPaises()
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
          await ApiService.SetPaises(this.currentItem.id,this.currentItem)
        } else {
          await ApiService.CreatePaises(this.currentItem)
        }
        this.dialogVisible = false
        this.fetchPaises()
      } catch (error) {
        console.error('Error al guardar el país:', error)
      }
    },
    confirmDelete(id) {
      this.itemToDelete = id
      this.deleteDialogVisible = true
    },
    async deleteItem() {
      try {
        await ApiService.DeletePaises(this.itemToDelete)
        this.deleteDialogVisible = false
        this.fetchPaises()
      } catch (error) {
        console.error('Error al eliminar el país:', error)
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
