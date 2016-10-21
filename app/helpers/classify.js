import Ember from 'ember';

export function classify([string]) {
  return Ember.String.classify(string);
}

export default Ember.Helper.helper(classify);
