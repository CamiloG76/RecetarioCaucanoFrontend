
import { useEffect, useState } from 'react';
import {
    obtenerRecetas,
    crearReceta,
    eliminarReceta
} from './services/recetaService';

import './App.css';

function App() {
    const [recetas, setRecetas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

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

        try {
            await crearReceta({
                ...formulario,
                tiempo_preparacion: Number(formulario.tiempo_preparacion)
            });

            setFormulario({
                nombre: '',
                descripcion: '',
                tiempo_preparacion: '',
                dificultad: 'Facil'
            });

            await cargarRecetas();

        } catch (error) {
            console.error(error);
            setError('No se pudo registrar la receta.');
        }
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
                <h2>Registrar una receta</h2>

                <form onSubmit={manejarEnvio}>

                    <label>Nombre de la receta</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formulario.nombre}
                        onChange={manejarCambio}
                        placeholder="Ej. Sancocho de gallina"
                        required
                    />

                    <label>Descripción</label>
                    <textarea
                        name="descripcion"
                        value={formulario.descripcion}
                        onChange={manejarCambio}
                        placeholder="Describe la receta..."
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
                        Registrar receta
                    </button>

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
                        <article className="tarjeta-receta" key={receta.id}>
                            <h3>{receta.nombre}</h3>

                            <p>{receta.descripcion}</p>

                            <p>
                                Tiempo: {receta.tiempo_preparacion} minutos
                            </p>

                            <p>
                                Dificultad: {receta.dificultad}
                            </p>

                            <button
                                className="boton-eliminar"
                                onClick={() => manejarEliminar(receta.id)}
                            >
                                Eliminar
                            </button>
                        </article>
                    ))}
                </div>
            </section>

        </main>
    );
}

export default App;


