export default {
  data() {
    return {
      vehiculoId: '',
      vehiculoSeleccionado: null,
      listaVehiculos: [],
      nuevoKilometraje: 0,
      fechaLectura: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
      ubicacionActual: '',
      observacion: '',
      historialKilometraje: [],
      mantenimientoProximo: null,
      mensaje: '',
      tipoMensaje: '',
      loading: false,
      errorKilometraje: ''
    };
  },
  methods: {
    async cargarListaVehiculos() {
      try {
        this.loading = true;
        // Simulación de carga de datos de API
        // En un caso real, se haría una llamada fetch o axios a tu API
        setTimeout(() => {
          this.listaVehiculos = [
            {
              id: 1,
              placa: 'ABC123',
              tarjetaVehiculo: {
                marca: 'Toyota',
                modelo: 'Hilux'
              },
              kilometraje: 5000.50,
              ubicacion: 'Garage Central'
            },
            {
              id: 2,
              placa: 'XYZ789',
              tarjetaVehiculo: {
                marca: 'Ford',
                modelo: 'Ranger'
              },
              kilometraje: 12500.75,
              ubicacion: 'Sede Norte'
            }
          ];
          this.loading = false;
        }, 1000);
      } catch (error) {
        console.error('Error al cargar vehículos:', error);
        this.mostrarMensaje('Error al cargar la lista de vehículos', 'error');
        this.loading = false;
      }
    },
    async cargarDatosVehiculo() {
      if (!this.vehiculoId) {
        this.vehiculoSeleccionado = null;
        this.nuevoKilometraje = 0;
        this.historialKilometraje = [];
        return;
      }
      
      this.loading = true;
      
      try {
        // Simulación de carga de datos desde API
        setTimeout(() => {
          // Encontrar el vehículo seleccionado en la lista
          const vehiculo = this.listaVehiculos.find(v => v.id === this.vehiculoId);
          
          if (vehiculo) {
            this.vehiculoSeleccionado = vehiculo;
            this.nuevoKilometraje = vehiculo.kilometraje;
            this.ubicacionActual = vehiculo.ubicacion;
            
            // Cargar historial de kilometraje (simulado)
            this.historialKilometraje = [
              {
                fecha: '2025-03-15',
                kilometraje: 4500.00,
                ubicacion: 'Taller Central',
                observacion: 'Registro inicial'
              },
              {
                fecha: '2025-04-18',
                kilometraje: vehiculo.kilometraje,
                ubicacion: vehiculo.ubicacion,
                observacion: 'Actualización mensual'
              }
            ];
            
            // Verificar próximos mantenimientos
            this.verificarMantenimientosPendientes();
          }
          
          this.loading = false;
        }, 800);
      } catch (error) {
        console.error('Error al cargar datos del vehículo:', error);
        this.mostrarMensaje('Error al cargar datos del vehículo', 'error');
        this.loading = false;
      }
    },
    async actualizarKilometraje() {
      if (!this.validarKilometraje()) {
        return;
      }
      
      this.loading = true;
      
      try {
        // Simular llamada a API para actualizar kilometraje
        setTimeout(() => {
          // Actualizar el kilometraje en el objeto local
          const kmAnterior = this.vehiculoSeleccionado.kilometraje;
          this.vehiculoSeleccionado.kilometraje = this.nuevoKilometraje;
          this.vehiculoSeleccionado.ubicacion = this.ubicacionActual;
          
          // Agregar al historial
          this.historialKilometraje.push({
            fecha: this.fechaLectura,
            kilometraje: this.nuevoKilometraje,
            ubicacion: this.ubicacionActual,
            observacion: this.observacion
          });
          
          // Ordenar historial por fecha (más reciente primero)
          this.historialKilometraje.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
          
          // Verificar mantenimientos después de actualizar
          this.verificarMantenimientosPendientes();
          
          // Mostrar mensaje de éxito
          this.mostrarMensaje(`Kilometraje actualizado correctamente. Incremento: ${(this.nuevoKilometraje - kmAnterior).toFixed(2)} km`, 'exito');
          
          // Emitir evento para actualizar otras partes de la aplicación
          this.$emit('kilometraje-actualizado', {
            vehiculoId: this.vehiculoId,
            nuevoKilometraje: this.nuevoKilometraje,
            fecha: this.fechaLectura,
            ubicacion: this.ubicacionActual
          });
          
          this.loading = false;
          
          // Opcional: resetear algunos campos pero mantener vehículo seleccionado
          this.observacion = '';
        }, 1200);
      } catch (error) {
        console.error('Error al actualizar kilometraje:', error);
        this.mostrarMensaje('Error al actualizar el kilometraje', 'error');
        this.loading = false;
      }
    },
    validarKilometraje() {
      this.errorKilometraje = '';
      
      if (!this.nuevoKilometraje && this.nuevoKilometraje !== 0) {
        this.errorKilometraje = 'El kilometraje es requerido';
        return false;
      }
      
      if (this.nuevoKilometraje < 0) {
        this.errorKilometraje = 'El kilometraje no puede ser negativo';
        return false;
      }
      
      if (this.vehiculoSeleccionado && this.nuevoKilometraje < this.vehiculoSeleccionado.kilometraje) {
        this.errorKilometraje = 'El nuevo kilometraje no puede ser menor al actual';
        return false;
      }
      
      // Si la diferencia es demasiado grande (por ejemplo, más de 5000 km de una vez)
      // podría ser un error de digitación
      if (this.vehiculoSeleccionado && (this.nuevoKilometraje - this.vehiculoSeleccionado.kilometraje) > 5000) {
        this.errorKilometraje = 'Diferencia de kilometraje demasiado grande. Verifique el valor ingresado.';
        return false;
      }
      
      return true;
    },
    verificarMantenimientosPendientes() {
      if (!this.vehiculoSeleccionado) return;
      
      // Simular programación de mantenimientos preventivos
      // Estos datos vendrían desde la API en un caso real
      const mantenimientosProgramados = [
        { id: 1, vehiculoId: 1, kilometraje: 5000, tipoMantenimiento: 'Cambio de aceite y filtros' },
        { id: 2, vehiculoId: 1, kilometraje: 10000, tipoMantenimiento: 'Revisión de frenos' },
        { id: 3, vehiculoId: 1, kilometraje: 15000, tipoMantenimiento: 'Mantenimiento completo' },
        { id: 4, vehiculoId: 2, kilometraje: 15000, tipoMantenimiento: 'Cambio de aceite y filtros' },
        { id: 5, vehiculoId: 2, kilometraje: 20000, tipoMantenimiento: 'Revisión de frenos' }
      ];
      
      // Filtrar mantenimientos para este vehículo
      const mantenimientosVehiculo = mantenimientosProgramados.filter(
        m => m.vehiculoId === this.vehiculoSeleccionado.id
      );
      
      // Encontrar el próximo mantenimiento
      let proximoMantenimiento = null;
      let menorDiferencia = Infinity;
      
      for (const mantenimiento of mantenimientosVehiculo) {
        // Si ya pasamos este kilometraje, verificar el siguiente ciclo
        // (ej: cambio de aceite cada 5000km)
        const ciclo = mantenimiento.kilometraje;
        const ultimoCicloCompleto = Math.floor(this.vehiculoSeleccionado.kilometraje / ciclo);
        const proximoKilometraje = (ultimoCicloCompleto + 1) * ciclo;
        
        const diferencia = proximoKilometraje - this.vehiculoSeleccionado.kilometraje;
        
        if (diferencia < menorDiferencia && diferencia >= 0) {
          menorDiferencia = diferencia;
          proximoMantenimiento = {
            ...mantenimiento,
            proximoKilometraje,
            kilometrosRestantes: diferencia
          };
        }
      }
      
      // Si hay algún mantenimiento próximo (menos de 500km), mostrarlo
      if (proximoMantenimiento && proximoMantenimiento.kilometrosRestantes < 500) {
        this.mantenimientoProximo = proximoMantenimiento;
      } else {
        this.mantenimientoProximo = null;
      }
    },
    resetForm() {
      this.vehiculoId = '';
      this.vehiculoSeleccionado = null;
      this.nuevoKilometraje = 0;
      this.fechaLectura = new Date().toISOString().split('T')[0];
      this.ubicacionActual = '';
      this.observacion = '';
      this.historialKilometraje = [];
      this.mantenimientoProximo = null;
      this.mensaje = '';
      this.errorKilometraje = '';
    },
    mostrarMensaje(texto, tipo) {
      this.mensaje = texto;
      this.tipoMensaje = tipo;
      
      // Auto-ocultar el mensaje después de 5 segundos
      setTimeout(() => {
        this.mensaje = '';
      }, 5000);
    },
    formatearFecha(fechaStr) {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  },
  watch: {
    nuevoKilometraje() {
      this.validarKilometraje();
    }
  },
  mounted() {
    // Cargar la lista de vehículos al montar el componente
    this.cargarListaVehiculos();
  }
};