import React, { useState } from 'react';
import Button from './component/Button/Button';
import './App.css';
//test
function App() {
  const [actors, setActors] = useState([]);
  const [movies, setMovies] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [postButtonClicked,setPostButtonClicked] = useState(false);
  const [response, setResponseStatus] = useState(null);
  const [loading,setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true)
    const fetchData = async () => {
      try {
        const actorsResponse = await fetch('https://switch-yam-equator.azurewebsites.net/api/actors', {
          headers: {
            'x-chmura-cors': process.env.REACT_APP_ACCESS_KEY
          }
        });
        const actorsData = await actorsResponse.json();
        setActors(actorsData);
        const moviesResponse = await fetch('https://switch-yam-equator.azurewebsites.net/api/movies', {
          headers: {
            'x-chmura-cors': process.env.REACT_APP_ACCESS_KEY
          }
        });
        const moviesData = await moviesResponse.json();
        setMovies(moviesData);
        setButtonClicked(true);
        setLoading(false);
      } catch (error) {
        setLoading(false)
        console.error(error);
      }
    };
    setTimeout(() => {
      fetchData();
    }, 500);
  }

  const btnClassName = buttonClicked ? 'submit-btn clicked' : 'submit-btn';
  const btnClassNamePost = postButtonClicked ? 'submit-btn clicked' : 'submit-btn';
  //first find the id of Keanu Reeves as that's the piece in common between the endpoints. 
  //then filter movies endpoint based on the id to only save movies K.Reeves played in
  const reeves = actors.filter((actor) => actor.name === "Keanu Reeves")
  const reevesId = reeves[0]?.actorId
  const reevesMovies = movies.filter((movie) => movie.actors.includes(reevesId));
 
 
  //do the same for N.Cage
  const cage = actors.filter((actor) => actor.name === "Nicolas Cage")
  const cageId = cage[0]?.actorId
  const cageMovies = movies.filter((movie) => movie.actors.includes(cageId))
 
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
    
    return {
      Name: actor.name,
      KRMovies: krMovies.map((movie) => movie.title),
      NCMovies: ncMovies.map((movie) => movie.title)
    };
  })

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
        if (!response.ok) throw new Error(response.error);
        else {
          setResponseStatus(response.status)
          console.log("response",response.status)
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
              </div>
            ))}
            </div>
          </div> 
          <div className='btn'>
            <Button type="submit" className={btnClassName} onClick={handleClick}>{loading ? "Loading..." : "Load Actors"}</Button>
            <Button type="submit" className={btnClassNamePost} onClick={handlePost}>Post</Button>
            <div>
              <h4>Response Status: {response && response}</h4>
            </div>
          </div> 
      </div>
    </div>
  );
}

export default App;
