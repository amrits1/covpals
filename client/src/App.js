import './App.css';
import React from 'react';
import Particles from 'react-particles-js';

function App() {
  return (
    <div>
      <div id = 'container'>
        hello
      </div>
      <ParticleBackground/>
    </div>
  );
}

const ParticleBackground = () =>  {
  return (
    <Particles
      id='particles-js'
      params={{
        "particles": {
            "number": {
                "value": 90,
                "density": {
                    "enable": true,
                    "value_area": 1500
                }
            },
            "line_linked": {
                "enable": false,
                "opacity": 0.02
            },
            "move": {
                "direction": "down",
                "speed": 3
            },
            "size": {
                "value": 1.75
            },
            "opacity": {
                "anim": {
                    "enable": true,
                    "speed": 1,
                    "opacity_min": 0.05
                }
            }
        },
        "retina_detect": true
    }} />
  );
};

export default App;