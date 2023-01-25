import React from 'react';


import { useState, useEffect } from 'react';
import axios from 'axios';

const RetrieveData = () => {
    const [people, setPeople] = useState([])
    const hook = () => {
      axios.get('http://localhost:3001/employees')
      .then(response => {
        setPeople(response.data)
      })
    }
  
  useEffect(hook, [])


const RetrievedEmployees=Object.values(people).map(
    (info)=>
        
            <tr>
                <td key={info.id}>{info.id}</td>
                <td key={info.first_name}>{info.first_name}</td>
                <td key={info.last_name}>{info.last_name}</td>
                <td key={info.email}>{info.email}</td>
            </tr>
    
)


  
  
   return(
    <div>
    <table className="data table">
        <thead>
            <tr>
            <th>id</th>
            <th>first name</th>
            <th>last name</th>
            <th>email</th>
            </tr>
        </thead>
        <tbody>
         
            
            {RetrievedEmployees}
            
        </tbody>
    </table>
     
</div>
   );
  };

  export default RetrieveData;