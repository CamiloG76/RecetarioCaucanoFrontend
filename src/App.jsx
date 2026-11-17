
import { useEffect, useState } from 'react';

import {
    obtenerRecetas,
    crearReceta,
    actualizarReceta,
    eliminarReceta
} from './services/recetaService';

import Ingredientes from './components/Ingredientes';
import './App.css';

function App() {
    const [recetas, setRecetas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [editando, setEditando] = useState(null);

    const [formulario, setFormulario] = useState({
        nombre: '',
        descripcion: '',
        tiempo_preparacion: '',
        dificultad: 'Facil'
    });

    const cargarRecetas = async () => {
        try {
            const respuesta = await obtenerRecetas();
            setRecetas(respuesta.data);
            setError('');
        } catch (error) {
            console.error(error);
            setError('No se pudieron cargar las recetas.');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarRecetas();
    }, []);

    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();

        const datos = {
            ...formulario,
            tiempo_preparacion: Number(formulario.tiempo_preparacion)
        };

        try {
            if (editando !== null) {
                await actualizarReceta(editando, datos);
                setEditando(null);
            } else {
                await crearReceta(datos);
            }

            setFormulario({
                nombre: '',
                descripcion: '',
                tiempo_preparacion: '',
                dificultad: 'Facil'
            });

            await cargarRecetas();

        } catch (error) {
            console.error(error);
            setError('No se pudo guardar la receta.');
        }
    };

    const manejarEditar = (receta) => {
        setEditando(receta.id);

        setFormulario({
            nombre: receta.nombre,
            descripcion: receta.descripcion,
            tiempo_preparacion: receta.tiempo_preparacion,
            dificultad: receta.dificultad
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelarEdicion = () => {
        setEditando(null);

        setFormulario({
            nombre: '',
            descripcion: '',
            tiempo_preparacion: '',
            dificultad: 'Facil'
        });
    };

    const manejarEliminar = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar esta receta?')) {
            return;
        }

        try {
            await eliminarReceta(id);
            await cargarRecetas();
        } catch (error) {
            console.error(error);
            setError('No se pudo eliminar la receta.');
        }
    };

    return (
        <main className="contenedor">

            <header className="encabezado">
                <h1>Recetario Caucano</h1>
                <p>Los sabores tradicionales de nuestra tierra</p>
            </header>

            <section className="formulario-seccion">
                <h2>
                    {editando !== null
                        ? 'Editar receta'
                        : 'Registrar una receta'}
                </h2>

                <form onSubmit={manejarEnvio}>

                    <label>Nombre de la receta</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formulario.nombre}
                        onChange={manejarCambio}
                        required
                    />

                    <label>Descripción</label>
                    <textarea
                        name="descripcion"
                        value={formulario.descripcion}
                        onChange={manejarCambio}
                        required
                    />

                    <label>Tiempo de preparación (minutos)</label>
                    <input
                        type="number"
                        name="tiempo_preparacion"
                        value={formulario.tiempo_preparacion}
                        onChange={manejarCambio}
                        min="1"
                        required
                    />

                    <label>Dificultad</label>
                    <select
                        name="dificultad"
                        value={formulario.dificultad}
                        onChange={manejarCambio}
                    >
                        <option value="Facil">Fácil</option>
                        <option value="Media">Media</option>
                        <option value="Dificil">Difícil</option>
                    </select>

                    <button type="submit">
                        {editando !== null
                            ? 'Guardar cambios'
                            : 'Registrar receta'}
                    </button>

                    {editando !== null && (
                        <button
                            type="button"
                            className="boton-eliminar"
                            onClick={cancelarEdicion}
                        >
                            Cancelar edición
                        </button>
                    )}

                </form>
            </section>

            <section className="recetas-seccion">
                <h2>Nuestras recetas</h2>

                {cargando && <p>Cargando recetas...</p>}
                {error && <p className="error">{error}</p>}

                {!cargando && recetas.length === 0 && (
                    <p>Aún no hay recetas registradas.</p>
                )}

                <div className="lista-recetas">
                    {recetas.map((receta) => (
                        <article
                            className="tarjeta-receta"
                            key={receta.id}
                        >
                            <h3>{receta.nombre}</h3>
                            <p>{receta.descripcion}</p>
                            <p>
                                Tiempo: {receta.tiempo_preparacion} minutos
                            </p>
                            <p>Dificultad: {receta.dificultad}</p>

                            <button
                                type="button"
                                onClick={() => manejarEditar(receta)}
                            >
                                Editar
                            </button>

                            <button
                                type="button"
                                className="boton-eliminar"
                                onClick={() => manejarEliminar(receta.id)}
                            >
                                Eliminar
                            </button>
                        </article>
                    ))}
                </div>
            </section>          
            <Ingredientes />       
        </main>
    );
}

export default App;



