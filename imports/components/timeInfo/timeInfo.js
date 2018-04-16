import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './timeInfo.html';
import {
    EP_TIME
} from '/client/main.js';

class TimeInfoCtrl {
    constructor($scope) {
        'ngInject';
        $scope.viewModel(this);
        var vm = this;
        if (vm.time != null) {
            if (vm.partida.time_mandante_pontuacao == null) {
                var response = HTTP.get(EP_TIME + vm.time.slug, {}, (error, response) => {
                    if (error) {
                        console.error(error);
                    } else {
                        vm.time.details = response.data;
                        vm.time.parciais = {};
                        vm.time.parciais.total = 0;
                        vm.time.parciais.atletas = 0;
                        if (vm.pontuados) {
                            vm.time.details.atletas.forEach(function (atleta) {
                                var parciais = vm.pontuados.atletas[atleta.atleta_id];
                                if (parciais != undefined && !(parciais.pontuacao == 0 && atleta.posicao_id == 6)) {
                                    atleta.parciais = parciais;
                                }
                                if (atleta.parciais != undefined) {
                                    if (atleta.atleta_id == vm.time.capitao_id) {
                                        atleta.parciais.pontuacao *= 2;
                                    }
                                    vm.time.parciais.total += atleta.parciais.pontuacao;
                                    vm.time.parciais.atletas++;
                                    $scope.$digest();
                                }
                            }, this);
                        }
                        $scope.$digest();
                    }
                });
            }
        }

        $scope.getPontos = function () {
            if (vm.partida.time_mandante_pontuacao != null) {
                if (vm.time.time_id == vm.partida.time_mandante_id) {
                    return vm.partida.time_mandante_pontuacao;
                } else {
                    return vm.partida.time_visitante_pontuacao;
                }
            }
            return null;
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
        partida: '<',
        pontuados: '<'
    },
    controller: TimeInfoCtrl,
    controllerAs: 'vm'
});