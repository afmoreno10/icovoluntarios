import { Mongo } from 'meteor/mongo';
export const Voluntariados = new Mongo.Collection('voluntariados');
if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('voluntariados', function voluntariadosPublication() {
    return Voluntariados.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });
}

Meteor.methods({
  'voluntariados.insert'(text) {
    check(text, String);

    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Voluntariados.insert({
      text,
      createdAt: new Date(),
    });
  },
  'voluntariados.setChecked'(voluntariadoId, setChecked) {
    check(voluntariadoId, String);
    check(setChecked, Boolean);

    const voluntariado = Voluntariados.findOne(voluntariadoId);

    if (voluntariado.private && voluntariado.owner !== this.userId) {

      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }
    Voluntariados.update(voluntariadoId, { $set: { checked: setChecked } });
  },
  'voluntariados.setPrivate'(voluntariadoId, setToPrivate) {
    check(voluntariadoId, String);
    check(setToPrivate, Boolean);
    const voluntariado = Voluntariados.findOne(voluntariadosId);

    // Make sure only the task owner can make a task private
    if (voluntariado.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    Voluntariados.update(voluntariadoId, { $set: { private: setToPrivate } });
  },
});
