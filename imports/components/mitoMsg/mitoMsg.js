import templateUrl from './mitoMsg.html';
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

class MitoMsgCtrl {
    constructor($scope) {
        'ngInject';
        $scope.viewModel(this);
    }
}

const name = 'mitoMsg';
export default angular.module(name, [angularMeteor, uiRouter]).component(name, {
    templateUrl,
    bindings: {
        msg: '<'
    },
    controller: MitoMsgCtrl
}).config(function ($stateProvider) {
    'ngInject';
    $stateProvider.state(
        name, {
            url: '/' + name,
            template: '<mito-msg></mito-msg>'
        });
});