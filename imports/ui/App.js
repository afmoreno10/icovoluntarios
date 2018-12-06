import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Tasks } from '../api/tasks.js';
import { Formualrios } from '../formulario/formulario.js';
import Task from './Task.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';
import Voluntariados from './Voluntariado.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
    };
  }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    Meteor.call('tasks.insert', text);

    Tasks.insert({
      text,
      createdAt: new Date(), // current time
      owner: Meteor.userId(),           // _id of logged in user
      username: Meteor.user().username,  // username of logged in user
    });

    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;

      return (
        <Task
        key={task._id}
        task={task}
        showPrivateButton={showPrivateButton}
        />
      );
    });
  }

  renderVoluntariados(){
    return this.props.voluntariados.map((voluntariado) => (
      <Voluntariados key={voluntariado._id} voluntariado={voluntariado} />
    ));
  }

  handleSubmitVoluntariados(event) {

    event.preventDefault();

    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    Meteor.call('voluntariados.insert', text);
    Voluntariados.insert({
      text,
      createdAt: new Date(), // current time
    });

    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  render() {
    return (
      <div className="container">

      <header>

      <h1>Agregar preguntas ({this.props.incompleteCount})</h1>

      <label className="hide-completed">
      <input
      type="checkbox"
      readOnly
      checked={this.state.hideCompleted}
      onClick={this.toggleHideCompleted.bind(this)}
      />

      </label>

      <AccountsUIWrapper />

      { this.props.currentUser ?
        <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
        <input
        type="text"
        ref="textInput"
        placeholder="Ingresa un nuevo comentario"
        />
        </form> : ''
      }

      </header>

      <ul>
      {this.renderTasks()}
      </ul>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('tasks');
  Meteor.subscribe('formulario');
  Meteor.subscribe("voluntariados");
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
})(App);
