import React, { useState } from 'react';
import Button from './component/Button/Button';
import './App.css';

function App() {
  const [actors, setActors] = useState([]);
  const [movies, setMovies] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleClick = () => {
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
        setButtonClicked(true);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }
  const btnClassName = buttonClicked ? 'submit-btn clicked' : 'submit-btn';
  //first find the id of Keanu Reeves as that's the piece in common between the endpoints. 
  //then filter movies endpoint based on the id to only save movies K.Reeves played in
  const reeves = actors.filter((actor) => actor.name === "Keanu Reeves")
  const reevesId = reeves[0]?.actorId
  const reevesMovies = movies.filter((movie) => movie.actors.includes(reevesId));
 
  //do the same for N.Cage
  const cage = actors.filter((actor) => actor.name === "Nicolas Cage")
  const cageId = cage[0]?.actorId
  const cageMovies = movies.filter((movie) => movie.actors.includes(cageId))

  //find actors whom played in their movies
  // const commonActorIds = new Set();
  // for (let i = 0; i < cageMovies.length; i++) {
  //   for (let j = 0; j < reevesMovies.length; j++) {
  //     const commonActors = cageMovies[i].actors.filter((actorId) =>
  //       reevesMovies[j].actors.includes(actorId));
  //     commonActors.forEach((actorId) => commonActorIds.add(actorId));
  //   }
  // }
  const commonActorIds = cageMovies.reduce((commonActorIds, cageMovie) => {
    const actorsInBothMovies = cageMovie.actors.filter((actorId) =>
    reevesMovies.some((reevesMovie) => reevesMovie.actors.includes(actorId))
  );
  return [...commonActorIds, ...actorsInBothMovies];
  }, []);

  //Convert the common actor IDs to actor objects
  const foundActors = Array.from(commonActorIds).map((actorId) =>
    actors.find((actor) => actor.actorId === actorId)
  );
  console.log("Actors who have played with both Cage and Reeves:", foundActors);
  
  return (
    <div className="App">
      <header className="App-header">
          <h3 className='heading'>Actors who have played with both Nicolas Cage and Keanu Reeves</h3>
          <div className='card'>
            <div className='table'>
              <div className='row header'>
                <div className='column-id'>ID</div>
                <div className='column-name'>Name</div>
              </div>
              <hr></hr>
              {foundActors.map((actor) => (
                <div className='row' key={actor.actorId}>
                  <div className='column-id'>{actor.actorId}</div>
                  <div className='column-name'>{actor.name}</div>
                </div>
              ))}
            </div>
          </div> 
          <div className='btn'>
            <Button type="submit" className={btnClassName} onClick={handleClick}>Load Actors</Button>
          </div> 
      </header>
    </div>
  );
}

export default App;
