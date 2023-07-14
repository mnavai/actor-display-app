import React, { useState,useEffect } from 'react';
import './App.css';

function App() {
  const [actors, setActors] = useState([]);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const actorsResponse = await fetch('https://switch-yam-equator.azurewebsites.net/api/actors', {
          headers: {
            'x-chmura-cors': '65cbd27c-860e-4950-8dc9-02b24e4d9020'
          }
        });
        const actorsData = await actorsResponse.json();
        setActors(actorsData);
        console.log('Actors:', actorsData);
        const moviesResponse = await fetch('https://switch-yam-equator.azurewebsites.net/api/movies', {
          headers: {
            'x-chmura-cors': '65cbd27c-860e-4950-8dc9-02b24e4d9020'
          }
        });
        const moviesData = await moviesResponse.json();
        setMovies(moviesData);
        console.log('Movies:', moviesData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  //first find the id of Keanu Reeves as that's the piece in common between the endpoints. 
  //then filter movies endpoint based on the id to only save movies K.Reeves played in
  const reeves = actors.filter((actor) => actor.name === "Keanu Reeves")
  const reevesId = reeves[0]?.actorId
  console.log("reeves id",reevesId)
  const reevesMovies = movies.filter((movie) => movie.actors.includes(reevesId));
  console.log("reeves movies",reevesMovies)

  //do the same for N.Cage
  const cage = actors.filter((actor) => actor.name === "Nicolas Cage")
  const cageId = cage[0]?.actorId
  console.log("cage id",cageId)
  const cageMovies = movies.filter((movie) => movie.actors.includes(cageId))
  console.log("cage movies",cageMovies)

  //find actors whom played in their movies
const commonActorIds = new Set();
for (let i = 0; i < cageMovies.length; i++) {
  for (let j = 0; j < reevesMovies.length; j++) {
    const commonActors = cageMovies[i].actors.filter((actorId) =>
      reevesMovies[j].actors.includes(actorId)
    );
    commonActors.forEach((actorId) => commonActorIds.add(actorId));
  }
}

// Convert the common actor IDs to actor objects
const foundActors = Array.from(commonActorIds).map((actorId) =>
  actors.find((actor) => actor.actorId === actorId)
);
  console.log("Actors who have played with both Cage and Reeves:", foundActors);
  
  return (
    <div className="App">
      <header className="App-header">
          <h3>Actors who have played with both<br/>Nicolas Cage and Keanu Reeves:</h3>
          <ul>
            {foundActors.map((actor) => <li>{"Name: "}{actor.name}, {"ID: "}{actor.actorId}</li>)}
          </ul>
      </header>
    </div>
  );
}

export default App;
