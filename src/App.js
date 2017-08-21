import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import './App.css';

/*
 * Form for search users
 */
class SearchForm extends React.Component {
    render() {
        return (
            <div className="form-group">
                <input type="email" className="form-control" placeholder="Username or email" value={this.props.query} />
            </div>
        )
    }
}

/*
 * Result list of users
 */
class List extends React.Component {
    render() {
        return (
            <div className="list-group">
                {this.props.users.map((v) =>
                    <Link to={`user/${v.id}`} key={v.id} className="list-group-item list-group-item-action">{v.display_name} ({v.email})</Link>
                )}
            </div>
        )
    }
}

/*
 * Main component of the first step
 * Contains search form (<SearchForm />) and result list of users (<List />)
 */
class UserList extends React.Component {
    
    constructor(props){
        super(props)
        /* initial state of application */
        this.state = {
            'users': [],
            'filteredUsers': [],
            'query': ''
        }
    }
    
    componentWillMount(){
        fetch('/data/response.json')
                .then((r) => r.json())
                .then((r) => {this.setState({users: r, filteredUsers: r})});
    }
    
    handleOnChange(e){
        let val = e.target.value
        let filteredUsers = this.state.users.filter((v) => 
            v.display_name.toUpperCase().indexOf(val.toUpperCase()) > -1 ||
            v.first_name.toUpperCase().indexOf(val.toUpperCase()) > -1 ||
            v.last_name.toUpperCase().indexOf(val.toUpperCase()) > -1 ||
            v.email.toUpperCase().indexOf(val.toUpperCase()) > -1
        )
        this.setState({
            filteredUsers: filteredUsers,
            query: val
        })
    }
    
    render() {
        return (
            <div className="user-list" onChange={this.handleOnChange.bind(this)} >
                <h2>List of users</h2>
                <SearchForm query={this.state.query} />
                <List users={this.state.filteredUsers}/>
            </div>
        )
    }
}

/*
 * Main component of the second step
 */
class UserForm extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            userId: props.match.params.userId,
            user: null
        }
    }

    componentWillMount(){
        fetch('/data/response.json')
                .then((r) => r.json())
                .then((r) => r.filter((v) => v.id == this.state.userId))
                .then((r) => this.setState({user: r[0]}))
    }
    
    render() {
        if (this.state.user)
            return (
                <div className="col-xs-12 col-md-6">
                    <h2>{this.state.user.display_name}</h2>
                    <div>
                        <img src={this.state.user.photo_url} className="img-thumbnail rounded float-left" alt={this.state.user.display_name} title={this.state.user.display_name} /><br /><br />
                        <dl>
                            <dt>First Name</dt>
                            <dd>{this.state.user.first_name}</dd>
                            <dt>Last Name</dt>
                            <dd>{this.state.user.last_name}</dd>
                            <dt>Email</dt>
                            <dd><a href={`mailto:${this.state.user.email}`}>{this.state.user.email}</a></dd>
                        </dl>
                    </div>
                </div>
            )
        else
            return (<div />)
    }
}

/*
 * Root component
 */
class App extends React.Component {

    render() {
        return (
            <div className="col-xs-12 col-md-6 app">
                <BrowserRouter>
                    <Switch>
                        <Route exact path='/' component={UserList} />
                        <Route path='/user/:userId' component={UserForm} />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
