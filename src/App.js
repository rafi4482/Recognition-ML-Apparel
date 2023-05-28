import React, { useState, useEffect } from "react";
import { Particles } from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback } from "react";
import ParticlesBg from "particles-bg";
import Clarifai from "clarifai";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import "./App.css";

const app = new Clarifai.App({
  apiKey: "0e63fdc15bbc4691b4554219ec3e4e53",
});

const App = () => {
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [box, setBox] = useState({});
  const [title, setTitle] = useState("")
  const [route, setRoute] = useState('signin');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  });

  useEffect(() => {
    loadFull();
  }, []);

  const loadUser = (data) => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    });
  };

  const calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    };
  };

  const displayFaceBox = (box) => {
    setBox(box);
  };

  const onInputChange = (event) => {
    setInput(event.target.value);
  };

  const onTitle=(apparel)=>{
    setTitle(apparel)
  }

  const onButtonSubmit = () => {
    setImageUrl(input);
    app.models
      .predict('apparel-detection', input)
      .then(response => {
        console.log('hi', response.outputs[0].data.regions[0].data.concepts[0].name)
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              setUser(prevUser => ({ ...prevUser, entries: count }));
            });
        }
        displayFaceBox(calculateFaceLocation(response));
        onTitle(response.outputs[0].data.regions[0].data.concepts[0].name)
      })
      .catch(err => console.log(err));
  };

  const onRouteChange = (route) => {
if (route === 'signout') {
setIsSignedIn(false);
} else if (route === 'home') {
setIsSignedIn(true);
}
setRoute(route);
};

return (
<div className="App">
<ParticlesBg type="cobweb" bg={true} />
<Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
{route === 'home' ? (
<div>
<Logo />
<Rank name={user.name} entries={user.entries} title={title}/>
<ImageLinkForm
         onInputChange={onInputChange}
         onButtonSubmit={onButtonSubmit}
       />
<FaceRecognition box={box} imageUrl={imageUrl} />
</div>
) : route === 'signin' ? (
<Signin loadUser={loadUser} onRouteChange={onRouteChange} />
) : (
<Register loadUser={loadUser} onRouteChange={onRouteChange} />
)}
</div>
);
};

export default App;
