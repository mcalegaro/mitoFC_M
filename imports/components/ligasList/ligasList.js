import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './ligasList.html';
import {
    Ligas
} from '../../api/ligas.js';

class LigasListCtrl {
    constructor($scope) {
        $scope.viewModel(this);
        this.helpers({
            ligas() {
                return Ligas.find({});
            }
        })
    }
}

export default angular.module('ligasList', [
        angularMeteor
    ])
    .component('ligasList', {
        templateUrl: 'imports/components/ligasList/ligasList.html',
        controller: ['$scope', LigasListCtrl]
    });