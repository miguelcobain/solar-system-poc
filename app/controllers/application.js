import Ember from 'ember';
const { Controller } = Ember;

export default Controller.extend({
  objects: [
    'sun', 'mercury', 'venus', 'earth', 'mars',
    'jupiter', 'saturn', 'uranus', 'neptune'
  ]
});