import angular from 'angular';
import angularMeteor from 'angular-meteor';
// import Popover from 'meteor/twbs:bootstrap';
import ligasList from '../imports/components/ligasList/ligasList';
import ligasSearch from '../imports/components/ligasSearch/ligasSearch';
import ligaInfo from '../imports/components/ligaInfo/ligaInfo';

angular.module('mito-m', [
  angularMeteor,
  ligasList.name,
  ligasSearch.name,
  ligaInfo.name
]);