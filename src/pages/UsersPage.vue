<template>
    <q-page class="q-pa-md">
      <q-table
        :rows="usuarios"
        :columns="columns"
        row-key="id"
        :loading="loading"
        v-model:pagination="pagination"
        :rows-per-page-label="'Registros por página:'"
        @request="onRequest"
        class="q-mb-md"
      >
        <template v-slot:top-left>
          <q-btn label="Nuevo Usuario" color="primary" icon="person_add" @click="openCreateDialog" class="q-mb-md" rounded />
        </template>
        <template v-slot:top-right>
          <q-input filled dense debounce="300" placeholder="Buscar..." v-model="search" @input="onSearch" clearable />
        </template>
  
        <template v-slot:body-cell-avatar="props">
          <q-td :props="props" class="q-pa-none">
            <q-avatar size="38px" v-if="props.row.avatar_url">
              <img :src="props.row.avatar_url" />
            </q-avatar>
          </q-td>
        </template>
        <template v-slot:body-cell-roles="props">
          <q-td :props="props">
            <q-badge
              v-for="role in (props.row.roles || [])"
              :key="role.id"
              color="primary"
              class="q-mx-xs text-white"
              rounded
            >
              {{ role.name }}
            </q-badge>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-pa-none">
            <q-btn flat color="primary" icon="edit" @click="openEditDialog(props.row)" class="q-mr-xs" round />
            <q-btn flat color="negative" icon="delete" @click="confirmDelete(props.row.id)" round />
          </q-td>
        </template>
      </q-table>
  
      <!-- Dialogo crear/editar usuario -->
      <q-dialog v-model="dialogVisible">
        <q-card class="q-pa-md">
          <q-card-section>
            <div class="text-h6">{{ editing ? 'Editar Usuario' : 'Nuevo Usuario' }}</div>
            <q-input v-model="currentItem.email" label="Email" outlined class="q-mb-sm" />
            <q-input v-model="currentItem.password" label="Contraseña" type="password" outlined class="q-mb-sm" />
            <q-select
              v-model="currentItem.role_id"
              :options="roles"
              label="Rol"
              option-label="name"
              option-value="id"
              outlined
              class="q-mb-sm"
            />
          </q-card-section>
          <q-card-actions>
            <q-btn @click="saveItem" color="primary" label="Guardar" :disable="!currentItem.email || (!editing && !currentItem.password) || !currentItem.role_id" />
            <q-btn @click="dialogVisible = false" color="secondary" label="Cancelar" />
          </q-card-actions>
        </q-card>
      </q-dialog>
  
      <!-- Dialogo eliminar usuario -->
      <q-dialog v-model="deleteDialogVisible">
        <q-card class="q-pa-md">
          <q-card-section>
            ¿Estás seguro de que deseas eliminar este usuario?
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
        usuarios: [],
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
          { name: 'avatar', label: 'Avatar', field: 'avatar_url', align: 'center' },
          { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
          { name: 'roles', label: 'Roles', field: 'roles', align: 'left' },
          { name: 'actions', label: 'Acciones', align: 'center', field: 'actions' }
        ]
      }
    },
    mounted() {
      this.fetchUsuarios()
      this.fetchRoles()
    },
    watch: {
      pagination: {
        handler() {
          this.fetchUsuarios()
        },
        deep: true
      },
      search() {
        this.pagination.page = 1
        this.fetchUsuarios()
      }
    },
    methods: {
      async fetchUsuarios() {
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
          const res = await ApiService.getUsers(params)
          this.usuarios = res.data || []
          this.pagination.rowsNumber = res.total || 0
        } catch (e) {
          this.$q.notify({ type: 'negative', message: 'Error al obtener usuarios' })
        } finally {
          this.loading = false
        }
      },
      async fetchRoles() {
        try {
          const res = await ApiService.getRoles()
          this.roles = res.data || []
        } catch (e) {
          this.roles = []
        }
      },
      onRequest(props) {
        const { page, rowsPerPage, sortBy, descending } = props.pagination
        this.pagination.page = page
        this.pagination.rowsPerPage = rowsPerPage
        this.pagination.sortBy = sortBy
        this.pagination.descending = descending
        this.fetchUsuarios()
      },
      onSearch() {
        this.pagination.page = 1
        this.fetchUsuarios()
      },
      openCreateDialog() {
        this.currentItem = { id: null, email: '', password: '', role_id: null }
        this.editing = false
        this.dialogVisible = true
      },
      openEditDialog(user) {
        this.currentItem = {
          id: user.id,
          email: user.email,
          password: '',
          role_id: (user.roles && user.roles[0] ? user.roles[0].id : null)
        }
        this.editing = true
        this.dialogVisible = true
      },
      async saveItem() {
        try {
          if (this.currentItem.id) {
            await ApiService.updateUser(this.currentItem.id, this.currentItem)
          } else {
            await ApiService.createUser(this.currentItem)
          }
          this.dialogVisible = false
          this.fetchUsuarios()
          this.$q.notify({ type: 'positive', message: 'Usuario guardado correctamente' })
        } catch (error) {
          this.$q.notify({ type: 'negative', message: 'Error al guardar usuario' })
        }
      },
      confirmDelete(id) {
        this.itemToDelete = id
        this.deleteDialogVisible = true
      },
      async deleteItem() {
        try {
          await ApiService.deleteUser(this.itemToDelete)
          this.deleteDialogVisible = false
          this.fetchUsuarios()
          this.$q.notify({ type: 'positive', message: 'Usuario eliminado' })
        } catch (error) {
          this.$q.notify({ type: 'negative', message: 'Error al eliminar usuario' })
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
  .q-input, .q-select {
    margin-bottom: 16px;
  }
  </style>
  