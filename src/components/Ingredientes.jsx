
import { useEffect, useState } from 'react';

import {
    obtenerIngredientes,
    crearIngrediente,
    actualizarIngrediente,
    eliminarIngrediente
} from '../services/ingredienteService';

import { obtenerRecetas } from '../services/recetaService';

import './Ingredientes.css';

function Ingredientes() {

    const [ingredientes, setIngredientes] = useState([]);
    const [recetas, setRecetas] = useState([]);

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [editando, setEditando] = useState(null);

    const [formulario, setFormulario] = useState({
        receta: '',
        nombre: '',
        cantidad: ''
    });

    // Cargar ingredientes
    const cargarIngredientes = async () => {
        try {
            const respuesta = await obtenerIngredientes();
            setIngredientes(respuesta.data);
            setError('');
        } catch (error) {
            console.error(error);
            setError('No se pudieron cargar los ingredientes.');
        } finally {
            setCargando(false);
        }
    };

    // Cargar recetas para seleccionarlas
    const cargarRecetas = async () => {
        try {
            const respuesta = await obtenerRecetas();
            setRecetas(respuesta.data);
        } catch (error) {
            console.error(error);
            setError('No se pudieron cargar las recetas.');
        }
    };

    useEffect(() => {
        cargarIngredientes();
        cargarRecetas();
    }, []);

    // Detectar cambios en los campos
    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    // Registrar o actualizar
    const manejarEnvio = async (e) => {
        e.preventDefault();

        const datos = {
            receta: Number(formulario.receta),
            nombre: formulario.nombre,
            cantidad: formulario.cantidad
        };

        try {
            if (editando !== null) {
                await actualizarIngrediente(editando, datos);
                setEditando(null);
            } else {
                await crearIngrediente(datos);
            }

            setFormulario({
                receta: '',
                nombre: '',
                cantidad: ''
            });

            await cargarIngredientes();

        } catch (error) {
            console.error(error);
            setError('No se pudo guardar el ingrediente.');
        }
    };

    // Editar ingrediente
    const manejarEditar = (ingrediente) => {
        setEditando(ingrediente.id);

        setFormulario({
            receta: ingrediente.receta,
            nombre: ingrediente.nombre,
            cantidad: ingrediente.cantidad
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Cancelar edición
    const cancelarEdicion = () => {
        setEditando(null);

        setFormulario({
            receta: '',
            nombre: '',
            cantidad: ''
        });
    };

    // Eliminar ingrediente
    const manejarEliminar = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar este ingrediente?')) {
            return;
        }

        try {
            await eliminarIngrediente(id);
            await cargarIngredientes();
        } catch (error) {
            console.error(error);
            setError('No se pudo eliminar el ingrediente.');
        }
    };

    return (
        <section className="ingredientes-seccion">

            <h2>Gestión de ingredientes</h2>

            <div className="formulario-ingredientes">

                <h3>
                    {editando !== null
                        ? 'Editar ingrediente'
                        : 'Registrar ingrediente'}
                </h3>

                <form onSubmit={manejarEnvio}>

                    <label>Receta</label>

                    <select
                        name="receta"
                        value={formulario.receta}
                        onChange={manejarCambio}
                        required
                    >
                        <option value="">Selecciona una receta</option>

                        {recetas.map((receta) => (
                            <option key={receta.id} value={receta.id}>
                                {receta.nombre}
                            </option>
                        ))}
                    </select>

                    <label>Nombre del ingrediente</label>

                    <input
                        type="text"
                        name="nombre"
                        value={formulario.nombre}
                        onChange={manejarCambio}
                        placeholder="Ej. Papa"
                        required
                    />

                    <label>Cantidad</label>

                    <input
                        type="text"
                        name="cantidad"
                        value={formulario.cantidad}
                        onChange={manejarCambio}
                        placeholder="Ej. 500 gramos"
                        required
                    />

                    <button type="submit">
                        {editando !== null
                            ? 'Guardar cambios'
                            : 'Registrar ingrediente'}
                    </button>

                    {editando !== null && (
                        <button
                            type="button"
                            onClick={cancelarEdicion}
                        >
                            Cancelar edición
                        </button>
                    )}

                </form>
            </div>

            <div className="lista-ingredientes">

                <h3>Ingredientes registrados</h3>

                {cargando && <p>Cargando ingredientes...</p>}

                {error && <p className="error">{error}</p>}

                {!cargando && ingredientes.length === 0 && (
                    <p>Aún no hay ingredientes registrados.</p>
                )}

                {ingredientes.map((ingrediente) => (
                    <article
                        className="tarjeta-ingrediente"
                        key={ingrediente.id}
                    >
                        <h4>{ingrediente.nombre}</h4>

                        <p>
                            Receta: {ingrediente.receta_nombre}
                        </p>

                        <p>
                            Cantidad: {ingrediente.cantidad}
                        </p>

                        <button
                            type="button"
                            onClick={() => manejarEditar(ingrediente)}
                        >
                            Editar
                        </button>

                        <button
                            type="button"
                            className="boton-eliminar"
                            onClick={() => manejarEliminar(ingrediente.id)}
                        >
                            Eliminar
                        </button>
                    </article>
                ))}

            </div>

        </section>
    );
}

export default Ingredientes;

