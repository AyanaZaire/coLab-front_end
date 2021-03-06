import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import {Route, Switch} from 'react-router-dom'

import NewProject from './components/NewProject.js'
import NavBar from './components/NavBar.js'
import UserProfile from './components/UserProfile.js'
import SignUp from './components/SignUp.js'
import Search from './components/Search.js';
import UserContainer from './containers/UserContainer.js'
import ProjectContainer from './containers/ProjectContainer.js'
import ProjectDetail from './components/ProjectDetail.js'


const URL = 'http://localhost:3000/api/v1/users'
const PROJECT = 'http://localhost:3000/api/v1/projects'

class App extends Component {

  state = {
    allUsers: [],
    searchTerm: "",
    clickedUser: null,
    clickedUserId: null,
    allProjects: [],
    selectedProject: null
  }

  fetchUsers = () => {
   fetch(URL)
   .then(response => response.json())
   .then(users => {
     this.setState({
       allUsers: users
     }, () => {console.log(this.state.allUsers)})
   })
  }

  fetchProjects() {
   fetch(PROJECT)
   .then(response => response.json())
   .then(projects => {
     this.setState ({
       allProjects: projects
     })
   })
  }

  componentDidMount = () => {
    this.fetchUsers()
    this.fetchProjects()
  }

  onSearchHandler = event => {
    this.setState({ searchTerm: event.target.value });
  };

  handleNewUser = (e, value) => {
    fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: value.name,
        skill: value.skill,
        img_url: value.image_url,
        bio: value.bio,
        availability: value.availability
      })
    })
    .then(response => response.json())
    .then(data => {
      this.setState({
        allUsers: [...this.state.allUsers, data]
      })
    })
    // this.history.push('/')
    e.currentTarget.reset()
  }

  handleClickedUser = (user) => {
    // console.log(user)
    this.setState({
      clickedUser: user,
      clickedUserId: user.id
    })
  }

  handleEditUser = (value) => {
    // console.log(value)
    let id = this.state.clickedUserId
    fetch(URL + `/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: value.name,
        skill: value.skill,
        img_url: value.image_url,
        bio: value.bio,
        availability: value.availability
      })
    })
    .then(response => response.json())
    .then(data => {
      // console.log(data)
      let editedUser = this.state.allUsers.map(user => {
        if (user.id === id) {
          return data
        } else {
          return user
        }
      })
      this.setState({
        allUsers: editedUser
      })
    })
  }

  handleDeleteUser = (user) => {
    // e.preventDefault()
    let id = this.state.clickedUserId
    let arr = [...this.state.allUsers]
    let index = arr.indexOf(user)
    arr.splice(index, 1)
    fetch(URL + `/${id}`, {
    method: "DELETE"
  })
  // .then(response => response.json())
  // .then(data => {
  //   // console.log(data)
  //   this.setState({
  //     // ...this.state.allUsers,
  //     allUsers: this.state.allUsers
  //   })
  // })
  this.updateDeletedUser(arr)
}

  updateDeletedUser = (arr) => {
    this.setState({
      allUsers: arr,
      clickedUser: null
    })
  }

  userUnselect = () => {
    this.setState({
      clickedUser: null
    })
  }

  postProject = (e) => {
    fetch('http://localhost:3000/api/v1/projects', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: e.currentTarget.form[0].value,
        img_url: e.currentTarget.form[1].value,
        description: e.currentTarget.form[5].value,
        start_date: e.currentTarget.form[2].value,
        end_date: e.currentTarget.form[3].value,
        max_member: e.currentTarget.form[4].value
      })
  }).then (r => r.json())
    .then(project => this.updateProject(project)
  )
  e.currentTarget.form.reset()
}

  projectHandleClick = (project) => {
    this.setState({
      selectedProject: project
    })
  }

  projectUnselect = () => {
    this.setState({
      selectedProject: null
    })
  }

  updateProject = (project) => {
    this.setState({
      allProjects: [...this.state.allProjects, project]
    })
  }

  updateDeletedProject = (arr) => {
    this.setState({
      allProjects: arr,
      selectedProject: null
    })
  }

  deleteProject = (project) => {
    let arr = [...this.state.allProjects]
    let index = arr.indexOf(project)
    arr.splice(index, 1)
    fetch(`${PROJECT}/${project.id}`, {
      method: 'DELETE'
    })
    this.updateDeletedProject(arr)
  }

  filterUser = () => {
    console.log('working')
    return this.state.allUsers.filter(user => user.name.toLowerCase().includes(this.state.searchTerm.toLowerCase()))
  }

  userComponentLogic = () => {
    if (this.state.clickedUser === null) {
      console.log(this.state.allUsers);
      let results = this.state.searchTerm === '' ? this.state.allUsers : this.filterUser();
      return <UserContainer users={results} filterTerm={this.state.searchTerm}
      clickedUserFunction={this.handleClickedUser}/>
    } else {
      return <UserProfile clickedUserState={this.state.clickedUser}
      handleEditUserForm={this.handleEditUser}
      handleDeleteUserButton={this.handleDeleteUser} userUnselect={this.userUnselect}/>
    }
  }

  render() {
    const userComponent = this.userComponentLogic()
    return (
      <React.Fragment>
        <NavBar
            title="coLab"
            icon="users"
            color="light red"
            subtitle="Build A Team"
          />
        <Switch>
          <Route
            path='/signup'
            render={() => {
              return(
                <SignUp handleNewUserForm={this.handleNewUser}
                />
              )
            }}
          />
          <Route
            path='/'
            exact
            render={() => {
              return(
                <React.Fragment>
                  <div class='topheader'>
                    <Search  onChangeHandler={this.onSearchHandler} value={this.state.searchTerm}/>
                  </div>
                  <div className="App">
                    {userComponent}
                    {/* {this.state.clickedUser === null ? <UserContainer allUsersState={this.state.allUsers} filterTerm={this.state.searchTerm}
                    clickedUserFunction={this.handleClickedUser}/> : <UserProfile
                    clickedUserState={this.state.clickedUser}
                    handleEditUserForm={this.handleEditUser}
                    userUnselect={this.userUnselect}
                    handleDeleteUserButton={this.handleDeleteUser}/>} */}
                   </div>
                </React.Fragment>
              )
            }}
          />
          <Route
            path='/projects'
            render={() => {
              return(
                <React.Fragment>
                  <div class='projecttopheader'>
                    <NewProject postProject={this.postProject}/>
                    {/* <Search  onChangeHandler={this.onSearchHandler} value={this.state.searchTerm}/> */}
                  </div>
                  <div className="App">
                    <div className="project">
                      {this.state.selectedProject === null ? <ProjectContainer allProjects={this.state.allProjects} projectHandleClick={this.projectHandleClick} updateProject={this.updateProject}/> : <ProjectDetail
                      allUsersState={this.state.allUsers} currentProject={this.state.selectedProject} projectUnselect={this.projectUnselect} deleteProject={this.deleteProject}/>}
                    </div>
                  </div>
                </React.Fragment>
              )
            }}
          />
        </Switch>
    </React.Fragment>
    );
  }
}

export default App;
