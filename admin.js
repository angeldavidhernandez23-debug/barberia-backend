// admin.js - versión robusta
const tablaBody = document.getElementById("tablaCitas");
const modal = document.getElementById("modal");
const editNombre = document.getElementById("editNombre");
const editServicio = document.getElementById("editServicio");
const editFecha = document.getElementById("editFecha");
const editHora = document.getElementById("editHora");
let citaSeleccionadaId = null;

async function cargarCitas() {
  try {
    const res = await fetch("http://localhost:3000/citas");
    const data = await res.json();
    if (!data || !data.citas) {
      console.error("Respuesta inesperada al obtener citas:", data);
      tablaBody.innerHTML = "<tr><td colspan='5'>No se pudieron cargar las citas</td></tr>";
      return;
    }

    tablaBody.innerHTML = "";
    data.citas.forEach(cita => {
      const tr = document.createElement("tr");

      // columnas
      const tdNombre = document.createElement("td");
      tdNombre.textContent = cita.nombreCliente || "";

      const tdServicio = document.createElement("td");
      tdServicio.textContent = cita.servicios || "";

      const tdFecha = document.createElement("td");
      tdFecha.textContent = cita.fecha || "";

      const tdHora = document.createElement("td");
      tdHora.textContent = cita.hora || "";

      const tdAcciones = document.createElement("td");

      // botón Editar
      const btnEditar = document.createElement("button");
      btnEditar.textContent = "Editar";
      btnEditar.addEventListener("click", () => abrirModal(cita));

      // botón Eliminar
      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "Eliminar";
      btnEliminar.style.marginLeft = "6px";
      btnEliminar.addEventListener("click", () => eliminarCita(cita._id));

      tdAcciones.appendChild(btnEditar);
      tdAcciones.appendChild(btnEliminar);

      tr.appendChild(tdNombre);
      tr.appendChild(tdServicio);
      tr.appendChild(tdFecha);
      tr.appendChild(tdHora);
      tr.appendChild(tdAcciones);

      tablaBody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error cargando citas:", err);
    tablaBody.innerHTML = "<tr><td colspan='5'>Error al cargar citas (ver consola)</td></tr>";
  }
}

function abrirModal(cita) {
  citaSeleccionadaId = cita._id;
  editNombre.value = cita.nombreCliente || "";
  editServicio.value = cita.servicios || "";
  editFecha.value = cita.fecha || "";
  editHora.value = cita.hora || "";
  modal.style.display = "flex";
}

function cerrarModal() {
  modal.style.display = "none";
  citaSeleccionadaId = null;
}

async function guardarCambios() {
  if (!citaSeleccionadaId) {
    alert("No hay cita seleccionada.");
    return;
  }

  const payload = {
    nombreCliente: editNombre.value.trim(),
    servicios: editServicio.value.trim(),
    fecha: editFecha.value,
    hora: editHora.value
  };

  try {
    const res = await fetch(`http://localhost:3000/citas/${citaSeleccionadaId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const json = await res.json();

    if (!res.ok && json && json.ok === false) {
      // Si backend devuelve ok:false o status >=400
      console.error("Respuesta PUT:", res.status, json);
      alert("No se pudo actualizar la cita: " + (json.mensaje || res.status));
      return;
    }

    // éxito
    alert(json.mensaje || "Cita actualizada correctamente");
    cerrarModal();
    cargarCitas();
  } catch (err) {
    console.error("Error en PUT /citas/:id", err);
    alert("Error al conectar con el servidor al actualizar la cita (ver consola).");
  }
}

async function eliminarCita(id) {
  if (!confirm("¿Eliminar esta cita?")) return;
  try {
    const res = await fetch(`http://localhost:3000/citas/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (res.ok && json.ok) {
      alert(json.mensaje || "Eliminada");
      cargarCitas();
    } else {
      console.error("DELETE error:", res.status, json);
      alert("No se pudo eliminar la cita");
    }
  } catch (err) {
    console.error("Error en DELETE:", err);
    alert("Error al eliminar (ver consola).");
  }
}

// Cerrar sesión
document.getElementById("cerrarSesion").addEventListener("click", () => {
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
});

// botones modal: guardar y cancelar (asume botones con onclick en HTML que llaman a estas funciones)
window.guardarCambios = guardarCambios;
window.cerrarModal = cerrarModal;

// Iniciar
cargarCitas();
