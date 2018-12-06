import React, { Component } from 'react';
import classnames from 'classnames';
import { Voluntariados } from '../api/voluntariados.js';

// Task component - represents a single todo item
export default class Voluntariado extends Component {

  toggleChecked() {
    Meteor.call('voluntariados.setChecked', this.props.voluntariados._id, !this.props.voluntariado.checked);
  }

  deleteThisVoluntariado() {
    Meteor.call('voluntariados.remove', this.props.voluntariado._id);
  }

  togglePrivate() {
    Meteor.call('voluntariados.setPrivate', this.props.voluntariado._id, ! this.props.voluntariado.private);
  }
  render() {
  }
}
