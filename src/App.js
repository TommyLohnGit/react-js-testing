import React from 'react';
import './App.css';
import { NavLink } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import { useState, useEffect } from 'react';
import axios from 'axios';

import RetrieveData from './database/retrieve';
import { HighlightSharp, LocalConvenienceStoreOutlined, MenuTwoTone, StayCurrentLandscape } from '@material-ui/icons';

import AnyChart from 'anychart-react'


class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      subject: '',
      employeelist: [],
      currentsubjectid: '',
      counter: '',
      submitsubject: '',
      tempemployeelist: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmitEmployee = this.handleSubmitEmployee.bind(this);
    this.sendEmployee = this.sendEmployee.bind(this);
    this.getEmployees = this.getEmployees.bind(this);
    this.updateIDs = this.updateIDs.bind(this);
    this.getAllEmployees = this.getAllEmployees.bind(this);
    this.handletemplist = this.handletemplist.bind(this);

  }

  //load what is already present in the database
  onload=this.getAllEmployees();

  handleChange(evt) {
    const value = evt.target.value;
    this.setState({
      ...this.state,
      [evt.target.name]: value

    
    });

    console.log(value)
  }



  handleSubmitEmployee(event) {
    //alert('A name was submitted: ' + this.state.first_name);
    //alert('A last name was submitted: ' + this.state.last_name);
    //alert('An email was submitted: ' + this.state.email);
    console.log('submitsubject', this.state.submitsubject)

    let subject = ''

    if (this.state.submitsubject == 1) {
      subject = 'German'
      console.log('chosen subject is german')
    }

    if (this.state.submitsubject == 2) {
      subject = 'French'
      console.log('chosen subject is french')
    }

    if (this.state.submitsubject == 3) {
      subject = 'English'
      console.log('chosen subject is english')
    }


    var newEmployee = {
      first_name: this.state.first_name, 
      last_name: this.state.last_name, 
      email: this.state.email,
      id: (this.state.employeelist.length + 1),
      subjectname: subject

    };

    console.log('newemployee', newEmployee)
    console.log('employeetest', this.state.employeelist)
    let templist = [...this.state.employeelist]
  
    templist.push(newEmployee)

    this.handletemplist();
    console.log(this.state.tempemployeelist);


    //this.sendEmployee(newEmployee);
    

    /*
    console.log('employeetest', this.state.employeelist)
    console.log('employeetest2', newEmployee)
    let templist = this.state.employeelist
    templist.push(newEmployee)
    console.log('employeetest3', templist)

    
    this.setState(prevState => ({
      employeelist: [...prevState.employeelist, newEmployee]
    }));

    this.sendEmployee(newEmployee);

    */

    event.preventDefault();
  }

   async handletemplist() {

    let promises = [];
    let employees = [];

    promises.push(

     await axios.get(`http://localhost:3001/subjects/${this.state.submitsubject}`)
   .then( response => {
     const info = response.data; 
     console.log('info', info) 

     employees.push(info.employees)

     if (info.employees === undefined) {
       
       this.setState({tempemployeelist: []})
     }
     else{
      
      this.setState({tempemployeelist: info.employees})
     }
     

   })
    )

    console.log('list: ', this.state.tempemployeelist)
    Promise.all(promises).then(() => console.log(employees));



   
 }




   sendEmployee(info) {


    console.log('subjectstate', this.state.submitsubject)

    let subject = ''

    if (this.state.submitsubject == 1) {
      subject = 'German'
    }

    if (this.state.submitsubject == 2) {
      subject = 'French'
    }

    if (this.state.submitsubject == 3) {
      subject = 'English'
    }

    console.log('subject', subject)


    //get employees of this subject and then update the employeelist to be only that subject

    this.setState({subject: subject})


    
    this.state.employeelist.push(info)
    console.log('currentemployeelist:', this.state.employeelist)
      

      axios.put(`http://localhost:3001/subjects/${this.state.submitsubject}/`, {
      
      id: this.state.submitsubject,
      subjectname: subject,
      employees: this.state.employeelist
      
      
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

      this.state.employeelist.pop()

      
    }
    
    

    async getEmployees() {

      
      

      let numberOfSubjects = await axios.get(`http://localhost:3001/subjects/`)
      .then( response => response.data.length);

      console.log('numberOfSubjects:', numberOfSubjects);
      console.log('thissubject: ', this.state.subject)

      let subjectid = ''

      if (this.state.subject == 'All') {
        console.log('the chosen subject was All subjects')
        subjectid = 0
      }

      if (this.state.subject == 'German') {
        console.log('the chosen subject was German')
        subjectid = 1
      }

      if (this.state.subject == 'French') {
        console.log('the chosen subject was French')
        subjectid = 2
      }

      if (this.state.subject == 'English') {
        console.log('the chosen subject was English')
        subjectid = 3
      }

      if (subjectid === 0) 
        {this.getAllEmployees()}
      
        else {

      


        let promises = [];
        let employeetest = [];
          
        promises.push(

            axios.get(`http://localhost:3001/subjects/${subjectid}`)
            .then( response => {
              const info = response.data; 
              console.log('info', info) 
              
              employeetest.push(info)

              
              if (info.employees === undefined) {
                this.setState({employeelist : []})
              }
              else{
              this.setState({employeelist : info.employees}) 
              console.log(`employeelist ${info.subjectname} :`, info.employees);
              }
              

            })

        )
        console.log('list: ', this.state.employeelist)
        Promise.all(promises).then(() => console.log(employeetest));
          }
          
      }

      async getAllEmployees() {

        this.setState({employeelist: []})
      

        let numberOfSubjects = await axios.get(`http://localhost:3001/subjects/`)
        .then( response => response.data.length);
  
        console.log('numberOfSubjects:', numberOfSubjects);
  
        
  
  
        for (let i = 0; i < numberOfSubjects; i++) {
          console.log('text', i)
  
          console.log('id', i)
  
          let promises = [];
          let employeetest = [];
          const subjectid = (i+1)
            
          promises.push(
  
              axios.get(`http://localhost:3001/subjects/${subjectid}`)
              .then( response => {
                const info = response.data;  
                
                employeetest.push(info)
  
                
                if (info.employees === undefined) {
                  this.setState(prevState => ({
                    employeelist: [...prevState.employeelist, []]
                  }));
                }
                else{
                  this.setState(prevState => ({
                    employeelist: [...prevState.employeelist, info.employees]
                  }));
                
                }
                
                this.setState({employeelist: this.state.employeelist.flat(1)})
                console.log('employeelist: ', this.state.employeelist);
  
              })


  
          )
          
  
        }
        
        }


      deleteRow(id, e){  
        console.log('id', id)
        axios.delete(`http://localhost:3001/employees/${id}`)  
          .then(res => {  
            console.log(res);  
            console.log(res.data);  
        
            const employees = this.state.employeelist.filter(item => item.id !== id);  
            console.log('employees: ',employees)
            this.setState({employeelist : employees}); 
            this.updateIDs()
            

            //update existing id's
          });  
          
      }

      updateIDs(){
        const oldlist = this.state.employeelist
        console.log('oldlist', oldlist)

        oldlist.forEach(function (employee, index) {
          for (let info in employee) {
            if (info === 'id') {
            
              
              axios.patch(`http://localhost:3001/employees/${employee[info]}` , {
              
              id: index
                
            
            }) 
            .then(res => {  
                console.log(res);  
                console.log(res.data);  
            
                

                

            //update existing id's
          });

            
            //console.log(`${key}: ${student[key]}`)
          

        }

          }
        })


        
        //const newlist = oldlist 
        //console.log('new list', newlist)

        //this.setState({employeelist : newlist});

              
          
        }
        
            

    

  render() {
    return (
      <div>
      <table className="data table">

        <tbody>
         
            
            {this.state.employeelist.map(
                (info)=>
        
            <tr>
                <td key={info.id}>{info.id}</td>
                <td key={info.first_name}>{info.first_name}</td>
                <td key={info.last_name}>{info.last_name}</td>
                <td key={info.email}>{info.email}</td>
                <td key={info.subjectname}>{info.subjectname}</td>

                <td>  
                    <button className="btn btn-danger" onClick={(e) => this.deleteRow(info.id, e)}>Delete</button>  
                  </td>
            </tr>
    
            )}
            
        </tbody>
    </table>

    
      <form onSubmit={this.handleSubmitEmployee}>
        <label>
          Name:
          <input type="text" name="first_name" required value={this.state.first_name} onChange={this.handleChange} />
          <input type="text" name="last_name" required value={this.state.last_name} onChange={this.handleChange} />
          <input type="text" name="email" required value={this.state.email} onChange={this.handleChange} />
          <select name="submitsubject" id="submitsubject" required value={this.state.submitsubject} onChange={this.handleChange}>
            <option value="" disabled selected>Choose a subject</option>
            <option value="1">German</option>
            <option value="2">French</option>
            <option value="3">English</option>
        </select>
          <br></br>
         
        </label>
        <input type="submit" value="Submit" />
      </form>


      <br></br>
      <label for="subject">subject: </label>
          <select name="subject" id="subject" required value={this.state.subject} onChange={this.handleChange}>
          <option value="" disabled selected>Choose a subject</option>
            <option value="All">All</option>
            <option value="German">German</option>
            <option value="French">French</option>
            <option value="English">English</option>
        </select>
        <td>  
                    <button className="btn btn-danger" onClick={(e) => this.getEmployees()}>employees</button>  
                </td>

      </div>
    );
  }
}

class CalculateNorm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      norm: '', 
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.createGraph = this.createGraph.bind(this);


  }

  handleChange(evt) {
    const value = evt.target.value;
    this.setState({
      ...this.state,
      [evt.target.name]: value
    });
  }
  handleSubmit(event) {
    this.createGraph()
  }

  createGraph() {
    // create data
var data = [
  ["January", 10000],
  ["February", 12000],
  ["March", 18000],
  ["April", 11000],
  ["May", 9000]
];
    
// create a chart
var chart = AnyChart.line();

// create a line series and set the data
var series = chart.line(data);

// set the container id
chart.container("container");

// initiate drawing the chart
chart.draw();

  }
    

  render() {
    return (
      <div>
      <table className="Norm data">

        <tbody>

        
  
            {this.state.norm}
            
        </tbody>
    </table>
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" name="norm" required value={this.state.norm} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      </div>
    );
  }
}


class YearForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupname: '',
      grouplist: [],
      studentlist: [],
      studentfirstname: '',
      studentlastname: '',
      currentgroupid: '',
      currentgroupname: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmitGroup = this.handleSubmitGroup.bind(this);
    this.handleSubmitStudent = this.handleSubmitStudent.bind(this);
    this.sendGroups = this.sendGroups.bind(this);
    this.sendStudent = this.sendStudent.bind(this);
    this.getGroups = this.getGroups.bind(this);
    this.getStudents = this.getStudents.bind(this);

  }

  //load what is already present in the database
  onload=this.getGroups();

  handleChange(evt) {
    const value = evt.target.value;
    this.setState({
      ...this.state,
      [evt.target.name]: value
    });

  }


  handleSubmitGroup(event) {
    //alert('A name was submitted: ' + this.state.groupname);
    //alert('A last name was submitted: ' + this.state.last_name);
    //alert('An email was submitted: ' + this.state.email);
    this.sendGroups(this.state.groupname);

    var newGroup = {
      groupname: this.state.groupname, 
      id: (this.state.grouplist.length + 1)

    };

    this.setState(prevState => ({
      grouplist: [...prevState.grouplist, newGroup]
    }));
    
    event.preventDefault();
  }

  handleSubmitStudent(event) {
 
    //alert('A name was submitted: ' + this.state.studentfirstname);
    //alert('A last name was submitted: ' + this.state.last_name);
    //alert('An email was submitted: ' + this.state.email);
    
    //this.sendStudent(this.state.studentfirstname, this.state.studentlastname);
    
    var newStudent = {
      studentfirstname: this.state.studentfirstname, 
      studentlastname: this.state.studentlastname, 
      id: (this.state.studentlist.length + 1)

    };

    
    console.log(this.state.studentlist)
    this.setState(prevState => ({
      studentlist: [...prevState.studentlist, newStudent]
    }));
    
    

    this.sendStudent(newStudent);

    event.preventDefault();
  
  }




  sendGroups(groupname) {
    axios.post('http://localhost:3001/group', {
      groupname: groupname,
      students: []
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
    }

    sendStudent(info) {

      //const newstudentlist = this.state.studentlist + info

      //for some reason this refreshes the state of the studentlist, So I will add it here to the list and later delete it.
      //console.log('test', this.state.studentlist.push())
      this.state.studentlist.push(info)
      

      axios.put(`http://localhost:3001/group/${this.state.currentgroupid}/`, {
      
      id: this.state.currentgroupid,
      groupname: this.state.currentgroupname,
      students: this.state.studentlist
      
      
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

      this.state.studentlist.pop()
      }

    getGroups() {
      axios.get('http://localhost:3001/group')
      .then( response => {
        const info = response.data;  
        this.setState({grouplist : info}) 
        console.log(response);
      })
      }

      getStudents(id, groupname) {
        axios.get(`http://localhost:3001/group/${id}`)
        .then( response => {
          const info = response.data;  
          this.setState({currentgroupid : id})
          this.setState({currentgroupname : groupname}) 
          console.log(info);
          if (info.students === undefined) {
            this.setState({studentlist : []})
          }
          else{
          this.setState({studentlist : info.students}) 
          console.log('studentlist', info.students);
          //console.log(this.state.studentlist)
          };
        })
        }

      deleteRow(id, e){  
        axios.delete(`http://localhost:3001/group/${id}`)
        .then(res => {  
          console.log(res);  
          console.log(res.data);  
      
          const groups = this.state.grouplist.filter(item => item.id !== id);  
          console.log('groups: ', groups)
          this.setState({grouplist : groups});  

          //update existing id's
        })  
        
      }

      deleteStudent(id, e){  
        const students = this.state.studentlist.filter(item => item.id !== id); 
        
        console.log('studentfilter', students)
        const newlist = this.updateIDs(students)

        axios.put(`http://localhost:3001/group/${this.state.currentgroupid}` , {
          id: this.state.currentgroupid,
          groupname: this.state.currentgroupname,
          students: newlist,
            
        
        }) 
        .then(res => {  
            console.log(res);  
            console.log(res.data);  
        
            
            console.log('students: ', newlist)
            this.setState({studentlist : newlist});  
            

            //update existing id's
          });
      }

      updateIDs(students){

        const oldlist = students

        console.log('old list', oldlist)

        oldlist.forEach(function (student, index) {
          for (let info in student) {
            if (info === 'id') {
              student[info] = index + 1
            }
            //console.log(`${key}: ${student[key]}`)
          }
        });
        
        const newlist = oldlist 
        this.setState({studentlist : newlist});

        return newlist;

      }

    

  render() {

    if (this.state.studentlist.length === 0) {

      return (
        <div className="grid-container">

        <div>
        <h2>Years</h2>
              <table className="data table" id='tableId'>

                <tbody>
                
                    
                    {this.state.grouplist.map(
                        (info)=>
                
                    <tr>
                        <td key={info.id}>{info.id}</td>
                        <td key={info.groupname}>{info.groupname}</td>
                        <td>  
                            <button className="btn btn-danger" onClick={(e) => this.deleteRow(info.id, e)}>Delete</button>  
                          </td>
                          <td>  
                            <button className="btn btn-danger" onClick={(e) => this.getStudents(info.id, info.groupname , e)}>Students</button>  
                          </td>
                    </tr>
            
                    )}
                    
                </tbody>
            </table>
              <form onSubmit={this.handleSubmitGroup}>
                <label>
                  Group:
                  <input type="text" name="groupname" required value={this.state.groupname} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Add" />
              </form>
              </div>

                  <div className="grid-child green">
                  <h2>Students {this.state.currentgroupid} {this.state.currentgroupname}</h2>
                  No students were found


                  <form onSubmit={this.handleSubmitStudent}>
                    <label>
                      Name:
                      <input type="text" name="studentfirstname" required value={this.state.studentfirstname} onChange={this.handleChange} />
                      <input type="text" name="studentlastname" required value={this.state.studentlastname} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                  </form>

                  </div>
        
        </div>


      );



    }

    else {
    return (

      <div className="grid-container">

        <div>
        <h2>Years</h2>
              <table className="data table" id='tableId'>

                <tbody>
                
                    
                    {this.state.grouplist.map(
                        (info)=>
                
                    <tr>
                        <td key={info.id}>{info.id}</td>
                        <td key={info.groupname}>{info.groupname}</td>
                        <td>  
                            <button className="btn btn-danger" onClick={(e) => this.deleteRow(info.id, e)}>Delete</button>  
                          </td>
                          <td>  
                            <button className="btn btn-danger" onClick={(e) => this.getStudents(info.id, info.groupname , e)}>Students</button>  
                          </td>
                    </tr>
            
                    )}
                    
                </tbody>
            </table>
              <form onSubmit={this.handleSubmitGroup}>
                <label>
                  Group:
                  <input type="text" name="groupname" required value={this.state.groupname} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Add" />
              </form>
              </div>

                  <div className="grid-child green">

                  <h2>Students {this.state.currentgroupid} {this.state.currentgroupname}</h2>
                  {this.state.studentlist.map(
                        (info)=>
                
                    <tr>
                        <td key={info.id}>{info.id}</td>
                        <td key={info.studentfirstname}>{info.studentfirstname}</td>
                        <td>  
                            <button className="btn btn-danger" onClick={(e) => this.deleteStudent(info.id, e)}>Delete</button>  
                          </td>
                    </tr>
            
                    )}

                    <form onSubmit={this.handleSubmitStudent}>
                    <label>
                      Name:
                      <input type="text" name="studentfirstname" required value={this.state.studentfirstname} onChange={this.handleChange} />
                      <input type="text" name="studentlastname" required value={this.state.studentlastname} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                  </form>
                  </div>
        
      </div>
      
    );
  }
  }
}


const App = () => {

 return(
 <div className='app'>
    <h1>Demo Application</h1>
    <Navigation />
    <Main />
  </div>
 );
};


const Navigation = () => (
  <nav>
    <ul>
      <li><NavLink exact="true" className={(navData) => (navData.isActive ? "current" : 'null')} to='/'>Home</NavLink></li>
      <li><NavLink exact="true" className={(navData) => (navData.isActive ? "current" : 'null')} to='/about'>About</NavLink></li>
      <li><NavLink exact="true" className={(navData) => (navData.isActive ? "current" : 'null')} to='/contact'>Contact</NavLink></li>
      <li><NavLink exact="true" className={(navData) => (navData.isActive ? "current" : 'null')} to='/norm'>Norm</NavLink></li>
      <li><NavLink exact="true" className={(navData) => (navData.isActive ? "current" : 'null')} to='/year'>Year</NavLink></li>
      <li><NavLink exact="true" className={(navData) => (navData.isActive ? "current" : 'null')} to='/employees'>Employees</NavLink></li>
    </ul>
  </nav>
);


const Home = () => (
  <div className='home'>
    <h1>Welcome to my portfolio website</h1>
    <p> Feel free to browse around and learn more about me.</p>
   
    <NameForm />
    
    
  </div>
);



const About = () => (
  <div className='about'>
    <h1>About Me</h1>
    <p>Ipsum dolor dolorem consectetur est velit fugiat. Dolorem provident corporis fuga saepe distinctio ipsam? Et quos harum excepturi dolorum molestias?</p>
    <p>Ipsum dolor dolorem consectetur est velit fugiat. Dolorem provident corporis fuga saepe distinctio ipsam? Et quos harum excepturi dolorum molestias?</p>
  </div>
);


const Contact = () => (
  <div className='contact'>
    <h1>Contact Me</h1>
    <p>You can reach me via email: <strong>hello@example.com</strong></p>
  </div>
);

const Norm = () => (
  <div className='Norm'>
    <h1>Determine the norm for each test</h1>
    <CalculateNorm />

    
  </div>
);

const Year = () => (
  <div className='year'>
    <h1>Years</h1>
    <YearForm />
    
  </div>
);

const Employees = () => (
  <div className='employees'>
    <h1>Employees</h1>
    <NameForm />
    
  </div>
);


const Main = () => (
  <Routes>
    <Route exact path='/' element={<Home/>}></Route>
    <Route exact path='/about' element={<About/>}></Route>
    <Route exact path='/contact' element={<Contact/>}></Route>
    <Route exact path='/norm' element={<Norm/>}></Route>
    <Route exact path='/year' element={<Year/>}></Route>
    <Route exact path='/employees' element={<Employees/>}></Route>
  </Routes>
);

export default App;
