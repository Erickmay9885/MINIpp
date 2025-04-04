import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Buscador from '../../components/Buscador';
import '../../components/App.css'

function App() {
  const [pokemones, setPokemones] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [resultado, setResultado] = useState([]);

  useEffect(() => {
    const getPokemones = async () => {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0');
      const listaPokemones = await response.json();
      const { results } = listaPokemones;

      const newPokemones = results.map(async (pokemon) => {
        const response = await fetch(pokemon.url);
        const poke = await response.json();

        return {
          id: poke.id,
          name: poke.name,
          img: poke.sprites.front_default,
        };
      });

      const pokemonesFinal = await Promise.all(newPokemones);
      setPokemones(pokemonesFinal);
      setResultado(pokemonesFinal);
    };

    getPokemones();
  }, []);

  const buscarPokemon = (e) => {
    e.preventDefault();

    if (busqueda === '') {
      setResultado(pokemones);
    } else {
      const filtrados = pokemones.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(busqueda.toLowerCase())
      );
      setResultado(filtrados);
    }
  };

  return (
    <>
      <Navbar />
      <Buscador
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        buscarPokemon={buscarPokemon}
      />
      <div className="App">
        {resultado.length > 0 ? (
          resultado.map((pokemon) => (
            <div key={pokemon.id} className="cuadro">
              <img src={pokemon.img} alt={pokemon.name} />
              <p>#{pokemon.name}</p>
              <span>{pokemon.id}</span>
            </div>
          ))
        ) : (
          <p className="no-encontrado">No se encontró ningún pokémon </p>
        )}
      </div>
    </>
  );
}

export default App;
