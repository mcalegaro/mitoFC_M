import templateUrl from './ligas.html';
import angular from 'angular';
import angularMeteor from 'angular-meteor';

class LigasCtrl {
    constructor($scope) {
        'ngInject';
        $scope.viewModel(this);
    }
}

const name = 'ligas';
export default angular.module(name, [angularMeteor]).component(name, {
    templateUrl,
    bindings: {
        ligas: '<',
        filter: '<'
    },
    controller: LigasCtrl
}).config(function ($stateProvider) {
    'ngInject';
    $stateProvider.state(
        name, {
            url: '/' + name,
            template: '<ligas></ligas>'
        });
})