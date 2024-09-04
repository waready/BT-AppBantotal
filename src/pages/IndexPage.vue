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
    <!-- <q-table
      :rows="inventarios"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :pagination.sync="pagination"
      :rows-per-page-options="[10, 20, 50]"
      class="q-mb-md"
    > -->
    <q-table
      :rows="inventarios"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :pagination.sync="pagination"
      :rows-per-page-options="[10, 20, 50]"
      :rows-per-page-label="'Registros por página:'"
      :pagination-label="getPaginationLabel"
      @update:pagination="onPaginationUpdate"
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

          <q-select
            v-model="currentItem.area_funcional_id"
            label="Área Funcional"
            :options="areasFuncionales"
            option-value="id"
            option-label="nombre"
            emit-value
            map-options
            outlined
          />

          <q-select
            v-model="currentItem.sistema_id"
            label="Sistema"
            :options="sistemas"
            option-value="id"
            option-label="sistema"
            emit-value
            map-options
            outlined
          />

          <q-select
            v-model="currentItem.pais_id"
            :options="paises"
            label="Pais"
            option-label="nombre"
            option-value="id"
            emit-value
            map-options
            outlined
          />

          <q-input v-model="currentItem.en_desarrollo" label="En Desarrollo" outlined />
          {{ currentItem }}
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
        { name: 'area_funcional', label: 'Área Funcional', field: row => row.areaFuncional?.nombre, align: 'left', sortable: true },
        { name: 'sistema', label: 'Sistema', field: row => row.sistema?.sistema, align: 'left', sortable: true },
        { name: 'pais', label: 'País', field: row => row.pais?.nombre, align: 'left', sortable: true },
        { name: 'usuario', label: 'Usuario', field: row => row.usuario?.username, align: 'left', sortable: true },
        { name: 'en_desarrollo', label: 'En Desarrollo', field: 'en_desarrollo', align: 'center', sortable: true },
        { name: 'actions', label: 'Acciones', align: 'center', field: 'actions' }
      ],
      paises: [],
      sistemas: [],
      areasFuncionales: [],
      usuarios: []
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
    this.fetchPaises()
    this.fetchSistemas()
    this.fetchAreasFuncionales()
  },
  methods: {
    getPaginationLabel(firstRowIndex, endRowIndex, totalRowsNumber) {
      return `${firstRowIndex + 1}-${endRowIndex} de ${totalRowsNumber}`
    },
    onPaginationUpdate(newPagination) {
      // Capturar el evento de paginación
      alert(`Página cambiada a: ${newPagination.page}, Mostrando: ${newPagination.rowsPerPage} registros por página`)

      // Actualizar la paginación en el estado para reflejar los cambios
      this.pagination = newPagination;

      // Puedes llamar a la función para actualizar los datos si es necesario
      this.fetchInventarios();
    },
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
    async fetchPaises() {
      try {
        const response = await this.$axios.get('http://127.0.0.1:3333/api/v1/paises')
        this.paises = response.data
      } catch (error) {
        console.error('Error al obtener los países:', error)
      }
    },
    async fetchSistemas() {
      try {
        const response = await this.$axios.get('http://127.0.0.1:3333/api/v1/sistemas')
        this.sistemas = response.data
      } catch (error) {
        console.error('Error al obtener los sistemas:', error)
      }
    },
    async fetchAreasFuncionales() {
      try {
        const response = await this.$axios.get('http://127.0.0.1:3333/api/v1/areas')
        this.areasFuncionales = response.data
      } catch (error) {
        console.error('Error al obtener las áreas:', error)
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
</style>
