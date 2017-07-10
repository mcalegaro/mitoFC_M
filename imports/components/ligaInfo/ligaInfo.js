import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './ligaInfo.html';

class LigaInfoCtrl {
    constructor($scope) {
        $scope.viewModel(this);
        var self = this;
        $scope.msg = {
            cod: 'info',
            desc: 'Carregando...'
        };
    }
}

const name = 'ligaInfo';

export default angular.module(name, [
        angularMeteor
    ])
    .component(name, {
        templateUrl,
        bindings: {
            liga: '<'
        },
        controller: ['$scope', LigaInfoCtrl]
    })
    .directive('ligaTipo', function () {
        return {
            templateUrl: '/client/templates/ligaTipo.html',
            bindings: {
                liga: '<'
            }
        }
    });