import {
  Meteor
} from 'meteor/meteor';
import {
  setupApi
} from './imports/api';
import '../imports/api/ligas.js';

Meteor.startup(() => {
  // code to run on server at startup

  setupApi();

});