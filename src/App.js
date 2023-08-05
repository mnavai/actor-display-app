import React, { useState } from 'react';
import Button from './component/Button/Button';
import './App.css';
//test
function App() {
  const [actors, setActors] = useState([]);
  const [movies, setMovies] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [postButtonClicked,setPostButtonClicked] = useState(false);

  const handleClick = () => {
    const fetchData = async () => {
      try {
        const actorsResponse = await fetch('https://switch-yam-equator.azurewebsites.net/api/actors', {
          headers: {
            'x-chmura-cors': process.env.REACT_APP_ACCESS_KEY
          }
        });
        const actorsData = await actorsResponse.json();
        setActors(actorsData);
        console.log('Actors:', actorsData);
        const moviesResponse = await fetch('https://switch-yam-equator.azurewebsites.net/api/movies', {
          headers: {
            'x-chmura-cors': process.env.REACT_APP_ACCESS_KEY
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

// {
// "Name": "Alan Smithee",
// "KRMovies": [
    // "The Matrix",
    // "The Matrix Revolutions"
    // ]
// "NCMovies": [
    // "Gone in Sixty Seconds"
// ]}

  const btnClassName = buttonClicked ? 'submit-btn clicked' : 'submit-btn';
  const btnClassNamePost = postButtonClicked ? 'submit-btn clicked' : 'submit-btn';
  //first find the id of Keanu Reeves as that's the piece in common between the endpoints. 
  //then filter movies endpoint based on the id to only save movies K.Reeves played in
  const reeves = actors.filter((actor) => actor.name === "Keanu Reeves")
  const reevesId = reeves[0]?.actorId
  const reevesMovies = movies.filter((movie) => movie.actors.includes(reevesId));
  console.log("reevesMovies",reevesMovies)
 
  //do the same for N.Cage
  const cage = actors.filter((actor) => actor.name === "Nicolas Cage")
  const cageId = cage[0]?.actorId
  const cageMovies = movies.filter((movie) => movie.actors.includes(cageId))
  console.log("cagemov",cageMovies)
  // Find actors who played in their movies.
  const commonActorIds = cageMovies.reduce((commonActorIds, cageMovie) => {
    const actorsInBothMovies = cageMovie.actors.filter((actorId) =>
      reevesMovies.some((reevesMovie) => reevesMovie.actors.includes(actorId))
    );
    return [...new Set([...commonActorIds, ...actorsInBothMovies])];
  }, []);
 
  // Convert the common actor IDs to actor objects.
  const foundActors = commonActorIds.map((actorId) =>
    actors.find((actor) => actor.actorId === actorId));
  console.log("Actors who have played with both Cage and Reeves:", foundActors);

  const actorsData = foundActors.map((actor) => {
    // eslint-disable-next-line array-callback-return
    const krMovies = reevesMovies.filter((movie) => {
      if(movie.actors.includes(actor.actorId)){ return movie.title }
    });
    // eslint-disable-next-line array-callback-return
    const ncMovies = cageMovies.filter((movie) => {
      if(movie.actors.includes(actor.actorId)){ 
        return movie.title 
      }
    });
    
    console.log("krMovies",krMovies)
    return {
      Name: actor.name,
      KRMovies: krMovies.map((movie) => movie.title),
      NCMovies: ncMovies.map((movie) => movie.title)
    };
  })

  console.log("actor data", actorsData)  

  const handlePost = () => {
    const headers = {
      'Content-Type': 'application/json',
      'x-chmura-cors': process.env.REACT_APP_ACCESS_KEY
    };

    fetch('https://switch-yam-equator.azurewebsites.net/api/validation', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(actorsData)
    })
      .then((response) => {
        console.log("respones is",response)
        if (!response.ok) throw new Error(response.status);
        else {
          console.log(response.ok)
          return response.json()
        }
      })
      .then((data) => {
        // Handle the response data
        console.log('Data stored:', data);
        setPostButtonClicked(true);
      })
      .catch((error) => {
        console.log('Error: ' + error);
        // Handle the error
      });
  };
  console.log("foundactors",foundActors)
  return (
    <div className="App">
      <div className="App-header">
          <h3 className='heading'>Actors who have played with both Nicolas Cage and Keanu Reeves</h3>
          <div className='card'>
            <div className='table'>
              <div className='row header'>
                <div className='column-name'>Name</div>
              </div>
              <hr></hr>
              {foundActors.map((actor) => (
    <div className="row" key={actor.actorId}>
      <div className="column-name">{actor.name}</div>
      <div className="column-kr-mov">
        <ul>
          {reevesMovies
            .filter((movie) => movie.actors.includes(actor.actorId))
            .map((movie) => (
              <li key={movie.movieId}>{movie.name}</li>
            ))}
        </ul>
      </div>
      <div className="column-nc-mov">
        <ul>
          {cageMovies
            .filter((movie) => movie.actors.includes(actor.actorId))
            .map((movie) => (
              <li key={movie.movieId}>{movie.name}</li>
            ))}
        </ul>
      </div>
    </div>
  ))}
            </div>
          </div> 
          <div className='btn'>
            <Button type="submit" className={btnClassName} onClick={handleClick}>Load Actors</Button>
            <Button type="submit" className={btnClassNamePost} onClick={handlePost}>Post</Button>
          </div> 
      </div>
    </div>
  );
}

export default App;
