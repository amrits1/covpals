import './App.css';

import React, { useState } from "react";
import Particles from 'react-particles-js';
import { TextField } from '@material-ui/core'
import axios from 'axios';


export function App(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [checked, setChecked] = useState([]);
  const [timezone, setTimezone] = useState("0");
  const [avail, setAvail] = useState({
    sunday:[],
    monday:[],
    tuesday:[],
    wednesday:[],
    thursday:[],
    friday:[],
    saturday:[]
  }
  );
  
  const handleSubmit = (evt) => {
      evt.preventDefault();
      updateBox();
      axios.post('/api/endpoints/create', {name: name, email: email, availability: avail});
      setAvail({
        sunday:[],
        monday:[],
        tuesday:[],
        wednesday:[],
        thursday:[],
        friday:[],
        saturday:[]
      });
  }

  let timezoneChange = event => {
    setTimezone(event.target.value);
  }

  let handleCheckboxChange = event => {
    let newArray = [...checked, event.target.id];
    if (checked.includes(event.target.id)) {
      newArray = newArray.filter(box => box !== event.target.id);
    }
    setChecked(newArray);
  };

  let updateBox = () => {
    let newArray = checked;
    for(let i=0; i<checked.length; i++){
      if(timezone.charAt(0)==='-'){
        let hour = parseInt(newArray[i].split(" ")[1]) + parseInt(timezone.substring(1));
        let newObj = avail;
        let day = parseInt(newArray[i].split(" ")[0]);
        if (day === 1){
          newObj.monday.push(hour);
        } else  if (day === 2){
          newObj.tuesday.push(hour);
        } else  if (day === 3){
          newObj.wednesday.push(hour);
        } else  if (day === 4){
          newObj.thursday.push(hour);
        } else  if (day === 5){
          newObj.friday.push(hour);
        } else  if (day === 6) {
          newObj.saturday.push(hour);
        } else  if (day === 0){
          newObj.sunday.push(hour);
        }
        setAvail(newObj);
      }
      else if(timezone.charAt(0)==='+'){
        let hour = parseInt(newArray[i].split(" ")[1]) - parseInt(timezone.substring(1));
        let newObj = avail;
        let day = parseInt(newArray[i].split(" ")[0]);
        if (day === 1){
          newObj.monday.push(hour);
        } else  if (day === 2){
          newObj.tuesday.push(hour);
        } else  if (day === 3){
          newObj.wednesday.push(hour);
        } else  if (day === 4){
          newObj.thursday.push(hour);
        } else  if (day === 5){
          newObj.friday.push(hour);
        } else  if (day === 6) {
          newObj.saturday.push(hour);
        } else  if (day === 0){
          newObj.sunday.push(hour);
        }
        setAvail(newObj);
      } else {
        let hour = parseInt(newArray[i].split(" ")[1]);
        let newObj = avail;
        let day = parseInt(newArray[i].split(" ")[0]);
        if (day === 1){
          newObj.monday.push(hour);
        } else  if (day === 2){
          newObj.tuesday.push(hour);
        } else  if (day === 3){
          newObj.wednesday.push(hour);
        } else  if (day === 4){
          newObj.thursday.push(hour);
        } else  if (day === 5){
          newObj.friday.push(hour);
        } else  if (day === 6) {
          newObj.saturday.push(hour);
        } else  if (day === 0){
          newObj.sunday.push(hour);
        }
        setAvail(newObj);
      }
    }

  }
  
  let rows = () => {    
    const currentRow = [];  
    for (let row = 0; row < 24; row++) {
      currentRow.push(<tr>{cols(row)}</tr>);
    }    
    return currentRow;
  }
  let cols = (rownum) => {
    const currentCol = [];
    if(rownum === 9){
      currentCol.push(<td>0{rownum}:00 - {rownum+1}:00</td>);
    }
    else if(rownum<10){
      currentCol.push(<td>0{rownum}:00 - 0{rownum+1}:00</td>);
    }
    else{
      currentCol.push(<td>{rownum}:00 - {rownum+1}:00</td>);
    }
    for (let col=0; col<7; col++){
      currentCol.push(<td><input type="checkbox" id={col.toString() + " " + rownum.toString()} onChange={handleCheckboxChange} /></td>);
    }
    return currentCol;
  }

  return (
    <div>
      <div id = 'container'>
        <form onSubmit={handleSubmit} class = "mainn">
          <h1> VidPals </h1>
          <label>
            &nbsp;
            <TextField InputLabelProps={{ style: { color: '#fff' }, }} label="Name" type="search" variant="outlined"
              id = "input"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            &nbsp;
            <TextField InputLabelProps={{ style: { color: '#fff' }, }} label="Email" type="search" variant="outlined"
              id = "input"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </label>
          <br></br>
          <br></br>
          <br></br>
          &nbsp;
          <div>
            <select id = "timezone" onChange={timezoneChange}>
              <option timeZoneId="1" gmtAdjustment="GMT-12:00" useDaylightTime="0" value="-12">(GMT-12:00) International Date Line West</option>
              <option timeZoneId="2" gmtAdjustment="GMT-11:00" useDaylightTime="0" value="-11">(GMT-11:00) Midway Island, Samoa</option>
              <option timeZoneId="3" gmtAdjustment="GMT-10:00" useDaylightTime="0" value="-10">(GMT-10:00) Hawaii</option>
              <option timeZoneId="4" gmtAdjustment="GMT-09:00" useDaylightTime="1" value="-9">(GMT-09:00) Alaska</option>
              <option timeZoneId="5" gmtAdjustment="GMT-08:00" useDaylightTime="1" value="-8">(GMT-08:00) Pacific Time (US & Canada)</option>
              <option timeZoneId="6" gmtAdjustment="GMT-08:00" useDaylightTime="1" value="-8">(GMT-08:00) Tijuana, Baja California</option>
              <option timeZoneId="7" gmtAdjustment="GMT-07:00" useDaylightTime="0" value="-7">(GMT-07:00) Arizona</option>
              <option timeZoneId="8" gmtAdjustment="GMT-07:00" useDaylightTime="1" value="-7">(GMT-07:00) Chihuahua, La Paz, Mazatlan</option>
              <option timeZoneId="9" gmtAdjustment="GMT-07:00" useDaylightTime="1" value="-7">(GMT-07:00) Mountain Time (US & Canada)</option>
              <option timeZoneId="10" gmtAdjustment="GMT-06:00" useDaylightTime="0" value="-6">(GMT-06:00) Central America</option>
              <option timeZoneId="11" gmtAdjustment="GMT-06:00" useDaylightTime="1" value="-6">(GMT-06:00) Central Time (US & Canada)</option>
              <option timeZoneId="12" gmtAdjustment="GMT-06:00" useDaylightTime="1" value="-6">(GMT-06:00) Guadalajara, Mexico City, Monterrey</option>
              <option timeZoneId="13" gmtAdjustment="GMT-06:00" useDaylightTime="0" value="-6">(GMT-06:00) Saskatchewan</option>
              <option timeZoneId="14" gmtAdjustment="GMT-05:00" useDaylightTime="0" value="-5">(GMT-05:00) Bogota, Lima, Quito, Rio Branco</option>
              <option timeZoneId="15" gmtAdjustment="GMT-05:00" useDaylightTime="1" value="-5">(GMT-05:00) Eastern Time (US & Canada)</option>
              <option timeZoneId="16" gmtAdjustment="GMT-05:00" useDaylightTime="1" value="-5">(GMT-05:00) Indiana (East)</option>
              <option timeZoneId="17" gmtAdjustment="GMT-04:00" useDaylightTime="1" value="-4">(GMT-04:00) Atlantic Time (Canada)</option>
              <option timeZoneId="18" gmtAdjustment="GMT-04:00" useDaylightTime="0" value="-4">(GMT-04:00) Caracas, La Paz</option>
              <option timeZoneId="19" gmtAdjustment="GMT-04:00" useDaylightTime="0" value="-4">(GMT-04:00) Manaus</option>
              <option timeZoneId="20" gmtAdjustment="GMT-04:00" useDaylightTime="1" value="-4">(GMT-04:00) Santiago</option>
              <option timeZoneId="22" gmtAdjustment="GMT-03:00" useDaylightTime="1" value="-3">(GMT-03:00) Brasilia</option>
              <option timeZoneId="23" gmtAdjustment="GMT-03:00" useDaylightTime="0" value="-3">(GMT-03:00) Buenos Aires, Georgetown</option>
              <option timeZoneId="24" gmtAdjustment="GMT-03:00" useDaylightTime="1" value="-3">(GMT-03:00) Greenland</option>
              <option timeZoneId="25" gmtAdjustment="GMT-03:00" useDaylightTime="1" value="-3">(GMT-03:00) Montevideo</option>
              <option timeZoneId="26" gmtAdjustment="GMT-02:00" useDaylightTime="1" value="-2">(GMT-02:00) Mid-Atlantic</option>
              <option timeZoneId="27" gmtAdjustment="GMT-01:00" useDaylightTime="0" value="-1">(GMT-01:00) Cape Verde Is.</option>
              <option timeZoneId="28" gmtAdjustment="GMT-01:00" useDaylightTime="1" value="-1">(GMT-01:00) Azores</option>
              <option selected="selected" timeZoneId="29" gmtAdjustment="GMT+00:00" useDaylightTime="0" value="0">(GMT+00:00) Casablanca, Monrovia, Reykjavik</option>
              <option timeZoneId="30" gmtAdjustment="GMT+00:00" useDaylightTime="1" value="0">(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London</option>
              <option timeZoneId="31" gmtAdjustment="GMT+01:00" useDaylightTime="1" value="1">(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna</option>
              <option timeZoneId="32" gmtAdjustment="GMT+01:00" useDaylightTime="1" value="1">(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague</option>
              <option timeZoneId="33" gmtAdjustment="GMT+01:00" useDaylightTime="1" value="1">(GMT+01:00) Brussels, Copenhagen, Madrid, Paris</option>
              <option timeZoneId="34" gmtAdjustment="GMT+01:00" useDaylightTime="1" value="1">(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb</option>
              <option timeZoneId="35" gmtAdjustment="GMT+01:00" useDaylightTime="1" value="1">(GMT+01:00) West Central Africa</option>
              <option timeZoneId="36" gmtAdjustment="GMT+02:00" useDaylightTime="1" value="2">(GMT+02:00) Amman</option>
              <option timeZoneId="37" gmtAdjustment="GMT+02:00" useDaylightTime="1" value="2">(GMT+02:00) Athens, Bucharest, Istanbul</option>
              <option timeZoneId="38" gmtAdjustment="GMT+02:00" useDaylightTime="1" value="2">(GMT+02:00) Beirut</option>
              <option timeZoneId="39" gmtAdjustment="GMT+02:00" useDaylightTime="1" value="2">(GMT+02:00) Cairo</option>
              <option timeZoneId="40" gmtAdjustment="GMT+02:00" useDaylightTime="0" value="2">(GMT+02:00) Harare, Pretoria</option>
              <option timeZoneId="41" gmtAdjustment="GMT+02:00" useDaylightTime="1" value="2">(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius</option>
              <option timeZoneId="42" gmtAdjustment="GMT+02:00" useDaylightTime="1" value="2">(GMT+02:00) Jerusalem</option>
              <option timeZoneId="43" gmtAdjustment="GMT+02:00" useDaylightTime="1" value="2">(GMT+02:00) Minsk</option>
              <option timeZoneId="44" gmtAdjustment="GMT+02:00" useDaylightTime="1" value="2">(GMT+02:00) Windhoek</option>
              <option timeZoneId="45" gmtAdjustment="GMT+03:00" useDaylightTime="0" value="3">(GMT+03:00) Kuwait, Riyadh, Baghdad</option>
              <option timeZoneId="46" gmtAdjustment="GMT+03:00" useDaylightTime="1" value="3">(GMT+03:00) Moscow, St. Petersburg, Volgograd</option>
              <option timeZoneId="47" gmtAdjustment="GMT+03:00" useDaylightTime="0" value="3">(GMT+03:00) Nairobi</option>
              <option timeZoneId="48" gmtAdjustment="GMT+03:00" useDaylightTime="0" value="3">(GMT+03:00) Tbilisi</option>
              <option timeZoneId="50" gmtAdjustment="GMT+04:00" useDaylightTime="0" value="4">(GMT+04:00) Abu Dhabi, Muscat</option>
              <option timeZoneId="51" gmtAdjustment="GMT+04:00" useDaylightTime="1" value="4">(GMT+04:00) Baku</option>
              <option timeZoneId="52" gmtAdjustment="GMT+04:00" useDaylightTime="1" value="4">(GMT+04:00) Yerevan</option>
              <option timeZoneId="54" gmtAdjustment="GMT+05:00" useDaylightTime="1" value="5">(GMT+05:00) Yekaterinburg</option>
              <option timeZoneId="55" gmtAdjustment="GMT+05:00" useDaylightTime="0" value="5">(GMT+05:00) Islamabad, Karachi, Tashkent</option>
              <option timeZoneId="59" gmtAdjustment="GMT+06:00" useDaylightTime="1" value="6">(GMT+06:00) Almaty, Novosibirsk</option>
              <option timeZoneId="60" gmtAdjustment="GMT+06:00" useDaylightTime="0" value="6">(GMT+06:00) Astana, Dhaka</option>
              <option timeZoneId="62" gmtAdjustment="GMT+07:00" useDaylightTime="0" value="7">(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
              <option timeZoneId="63" gmtAdjustment="GMT+07:00" useDaylightTime="1" value="7">(GMT+07:00) Krasnoyarsk</option>
              <option timeZoneId="64" gmtAdjustment="GMT+08:00" useDaylightTime="0" value="8">(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi</option>
              <option timeZoneId="65" gmtAdjustment="GMT+08:00" useDaylightTime="0" value="8">(GMT+08:00) Kuala Lumpur, Singapore</option>
              <option timeZoneId="66" gmtAdjustment="GMT+08:00" useDaylightTime="0" value="8">(GMT+08:00) Irkutsk, Ulaan Bataar</option>
              <option timeZoneId="67" gmtAdjustment="GMT+08:00" useDaylightTime="0" value="8">(GMT+08:00) Perth</option>
              <option timeZoneId="68" gmtAdjustment="GMT+08:00" useDaylightTime="0" value="8">(GMT+08:00) Taipei</option>
              <option timeZoneId="69" gmtAdjustment="GMT+09:00" useDaylightTime="0" value="9">(GMT+09:00) Osaka, Sapporo, Tokyo</option>
              <option timeZoneId="70" gmtAdjustment="GMT+09:00" useDaylightTime="0" value="9">(GMT+09:00) Seoul</option>
              <option timeZoneId="71" gmtAdjustment="GMT+09:00" useDaylightTime="1" value="9">(GMT+09:00) Yakutsk</option>
              <option timeZoneId="74" gmtAdjustment="GMT+10:00" useDaylightTime="0" value="10">(GMT+10:00) Brisbane</option>
              <option timeZoneId="75" gmtAdjustment="GMT+10:00" useDaylightTime="1" value="10">(GMT+10:00) Canberra, Melbourne, Sydney</option>
              <option timeZoneId="76" gmtAdjustment="GMT+10:00" useDaylightTime="1" value="10">(GMT+10:00) Hobart</option>
              <option timeZoneId="77" gmtAdjustment="GMT+10:00" useDaylightTime="0" value="10">(GMT+10:00) Guam, Port Moresby</option>
              <option timeZoneId="78" gmtAdjustment="GMT+10:00" useDaylightTime="1" value="10">(GMT+10:00) Vladivostok</option>
              <option timeZoneId="79" gmtAdjustment="GMT+11:00" useDaylightTime="1" value="11">(GMT+11:00) Magadan, Solomon Is., New Caledonia</option>
              <option timeZoneId="80" gmtAdjustment="GMT+12:00" useDaylightTime="1" value="12">(GMT+12:00) Auckland, Wellington</option>
              <option timeZoneId="81" gmtAdjustment="GMT+12:00" useDaylightTime="0" value="12">(GMT+12:00) Fiji, Kamchatka, Marshall Is.</option>
              <option timeZoneId="82" gmtAdjustment="GMT+13:00" useDaylightTime="0" value="13">(GMT+13:00) Nuku'alofa</option>
            </select>											
            <br></br>
            <br></br>

            <div>
              <table id="tablee">
                <tr>
                    <th> </th>
                    <th> Sunday </th>
                    <th> Monday </th>
                    <th> Tuesday </th>
                    <th> Wednesday </th>
                    <th> Thursday </th>
                    <th> Friday </th>
                    <th> Saturday </th>
                </tr>
                {rows()}

              </table>
            </div>

            <input id = "button" type="submit" value="Submit" />  
          </div>
        </form>
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