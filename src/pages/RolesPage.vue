<template>
  <q-page class="q-pa-md">
    <q-table
      :rows="roles"
      :columns="columns"
      row-key="id"
      :loading="loading"
      v-model:pagination="pagination"
      :rows-per-page-label="'Registros por página:'"
      @request="onRequest"
      class="q-mb-md"
    >
      <template v-slot:top-left>
        <q-btn label="Nuevo Rol" color="primary" icon="add" @click="openCreateDialog" class="q-mb-md" rounded />
      </template>
      <template v-slot:top-right>
        <q-input filled dense debounce="300" placeholder="Buscar..." v-model="search" @input="onSearch" clearable />
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-pa-none">
          <q-btn flat color="primary" icon="edit" @click="openEditDialog(props.row)" class="q-mr-xs" round />
          <q-btn flat color="negative" icon="delete" @click="confirmDelete(props.row.id)" round />
        </q-td>
      </template>
    </q-table>

    <!-- Diálogo crear/editar -->
    <q-dialog v-model="dialogVisible">
      <q-card class="q-pa-md">
        <q-card-section>
          <div class="text-h6">{{ editing ? 'Editar Rol' : 'Nuevo Rol' }}</div>
          <q-input v-model="currentItem.name" label="Nombre del Rol" outlined class="q-mb-sm" />
          <!-- Si tu rol tiene más atributos, ponlos aquí -->
        </q-card-section>
        <q-card-actions>
          <q-btn @click="saveItem" color="primary" label="Guardar" :disable="!currentItem.name" />
          <q-btn @click="dialogVisible = false" color="secondary" label="Cancelar" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Diálogo eliminar -->
    <q-dialog v-model="deleteDialogVisible">
      <q-card class="q-pa-md">
        <q-card-section>
          ¿Estás seguro de que deseas eliminar este rol?
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
      roles: [],
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
      editing: false,
      columns: [
        { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true, style: 'color:#C3261F;font-weight:bold;' },
        { name: 'name', label: 'Nombre', field: 'name', align: 'left', sortable: true },
        { name: 'actions', label: 'Acciones', align: 'center', field: 'actions' }
      ]
    }
  },
  mounted() {
    this.fetchRoles()
  },
  watch: {
    pagination: {
      handler() {
        this.fetchRoles()
      },
      deep: true
    },
    search() {
      this.pagination.page = 1
      this.fetchRoles()
    }
  },
  methods: {
    async fetchRoles() {
      this.loading = true
      try {
        const limit = this.pagination.rowsPerPage === 0 ? this.pagination.rowsNumber : this.pagination.rowsPerPage
        const params = {
          page: this.pagination.page,
          limit,
          sortBy: this.pagination.sortBy || 'id',
          order: this.pagination.descending ? 'desc' : 'asc',
          search: this.search
        }
        const res = await ApiService.getRoles(params)
        this.roles = res.data || []
        this.pagination.rowsNumber = res.total || 0
      } catch (e) {
        this.$q.notify({ type: 'negative', message: 'Error al obtener roles' })
      } finally {
        this.loading = false
      }
    },
    onRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      this.pagination.page = page
      this.pagination.rowsPerPage = rowsPerPage
      this.pagination.sortBy = sortBy
      this.pagination.descending = descending
      this.fetchRoles()
    },
    onSearch() {
      this.pagination.page = 1
      this.fetchRoles()
    },
    openCreateDialog() {
      this.currentItem = { id: null, name: '' }
      this.editing = false
      this.dialogVisible = true
    },
    openEditDialog(role) {
      this.currentItem = { id: role.id, name: role.name }
      this.editing = true
      this.dialogVisible = true
    },
    async saveItem() {
      try {
        if (this.currentItem.id) {
          await ApiService.updateRole(this.currentItem.id, this.currentItem)
        } else {
          await ApiService.createRole(this.currentItem)
        }
        this.dialogVisible = false
        this.fetchRoles()
        this.$q.notify({ type: 'positive', message: 'Rol guardado correctamente' })
      } catch (error) {
        this.$q.notify({ type: 'negative', message: 'Error al guardar rol' })
      }
    },
    confirmDelete(id) {
      this.itemToDelete = id
      this.deleteDialogVisible = true
    },
    async deleteItem() {
      try {
        await ApiService.deleteRole(this.itemToDelete)
        this.deleteDialogVisible = false
        this.fetchRoles()
        this.$q.notify({ type: 'positive', message: 'Rol eliminado' })
      } catch (error) {
        this.$q.notify({ type: 'negative', message: 'Error al eliminar rol' })
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
