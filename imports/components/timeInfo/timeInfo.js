import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './timeInfo.html';

class TimeInfoCtrl {
    constructor($scope, $stateParams) {
        'ngInject';
        $scope.viewModel(this);
        this.$onInit = function () {
            $scope.time = this.time;
            $scope.partida = this.partida;

            $scope.getPontos = function () {
                if ($scope.partida.time_mandante_pontuacao != null) {
                    if ($scope.time.time_id == $scope.partida.time_mandante_id) {
                        return $scope.partida.time_mandante_pontuacao;
                    } else {
                        return $scope.partida.time_visitante_pontuacao;
                    }
                } else if ($scope.time != null) {
                    if ($scope.time.pontos != null) {
                        return $scope.time.pontos.parcial;
                    }
                }
            }
            $scope.getAtletas = function () {
                return 9;
            }
        }
    }
}

const name = 'timeInfo';

export default angular.module(name, [
    angularMeteor
]).component(name, {
    templateUrl,
    bindings: {
        time: '<',
        partida: '<'
    },
    controller: TimeInfoCtrl
});