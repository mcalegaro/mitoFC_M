import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './ligaInfo.html';

class LigaInfoCtrl {
    constructor($scope) {
        $scope.viewModel(this);
        var self = this;
        self.$onInit = function () {
            // console.info(self.liga);
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
    });