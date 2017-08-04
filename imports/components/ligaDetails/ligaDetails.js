import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import templateUrl from './ligaDetails.html';
import ligaInfo from '../ligaInfo/ligaInfo';
import {
    HTTP
} from 'meteor/http';
import {
    EP_ST_MERCADO,
    EP_LIGA,
    EP_PARCIAIS,
    EP_TIME
} from '/client/main.js';

import {
    CARREGANDO,
    COD_ERRO
} from '/client/lib/messages.js';

class LigaDetailsCtrl {

    constructor($scope, $stateParams) {
        'ngInject';
        $scope.viewModel(this);
        var vm = this;
        vm.slug = $stateParams.slug;

        vm.msg = CARREGANDO;
        if ($.cookie("glbId")) {
            vm.getStatusMercado(vm, $scope);
        } else {
            window.location.href = "/login";
        }
    }

    getStatusMercado(vm, scope) {
        HTTP.get(EP_ST_MERCADO, {}, (error, response) => {
            if (error) {
                console.log(error);
                vm.msg = {
                    cod: COD_ERRO,
                    desc: error
                };
                scope.$digest();
            } else {
                vm.statusMercado = response.data;
                if (vm.statusMercado.status_mercado == 4) {
                    vm.msg = {
                        cod: COD_ERRO,
                        desc: 'Mercado em manutenção. Tente mais tarde );'
                    }
                    scope.$digest();
                } else {
                    if (vm.statusMercado != null && vm.statusMercado.status_mercado == 2) {
                        vm.getPontuados(vm, scope);
                    } else {
                        vm.getTimes(vm, scope);
                    }
                    scope.$digest();
                }
            }
        });
    }

    getPontuados(vm, scope) {
        HTTP.get(EP_PARCIAIS, {}, (error, response) => {
            if (error) {
                console.log(error);
                scope.$digest();
            } else {
                vm.pontuados = response.data;
                vm.getTimes(vm, scope);
            }
        })
    }

    getParcialTime(vm, scope, time) {
        if (!time.pontos) time.pontos = {};
        time.pontos.parcial = 0.0;
        time.pontos.atletas = 0;
        HTTP.get(EP_TIME + time.slug, {}, (error, response) => {
            if (error) {
                console.log(error);
                scope.$digest();
            } else {
                time.details = response.data;
                time.details.atletas.forEach(function (atleta) {
                    var parciais = vm.pontuados.atletas[atleta.atleta_id];
                    if (parciais != undefined && !(parciais.pontuacao == 0 && atleta.posicao_id == 6)) {
                        atleta.parciais = parciais;
                    }
                    // atleta.parciais = vm.pontuados.atletas[atleta.atleta_id];
                    if (atleta.parciais != undefined) {
                        time.pontos.campeonato += atleta.parciais.pontuacao;
                        time.pontos.mes += atleta.parciais.pontuacao;
                        time.pontos.parcial += atleta.parciais.pontuacao;
                        time.pontos.atletas++;
                        // scope.$digest();
                    }
                }, vm);
                scope.$digest();
            }
        })
    }

    getTimeById(id) {
        var timeR = null;
        this.liga.times.forEach(function (time) {
            if (time.time_id == id) {
                timeR = time;
                return;
            }
        }, this);
        return timeR;
    };

    setOrder(newOrder) {
        this.orderProp = newOrder;
    };

    getTimes(vm, scope) {

        //liga
        var opts = {
            headers: {
                'X-GLB-Token': $.cookie("glbId")
            }
        };
        HTTP.get(EP_LIGA + vm.slug, opts, (error, response) => {
            if (error) {
                console.log(error);
                vm.msg = {
                    cod: COD_ERRO,
                    desc: error
                };
                scope.$digest();
            } else {
                vm.liga = response.data;
                vm.msg = {};
                if (vm.statusMercado != null && vm.statusMercado.status_mercado == 2) {
                    vm.orderProp = 'pontos.parcial';
                    vm.liga.times.forEach(function (time) {
                        vm.getParcialTime(vm, scope, time);
                    }, vm);
                } else {
                    vm.orderProp = 'pontos.campeonato';
                    vm.liga.times.forEach(function (time) {
                        if (time.pontos == undefined) {
                            time.pontos = {};
                        }
                        time.pontos.parcial = 0;
                        time.pontos.atletas = 0;
                    }, vm);
                }
                scope.$digest();
            }
        });
        //liga
    };

}

const name = 'ligaDetails';

export default angular.module(name, [
    angularMeteor,
    uiRouter
]).component(name, {
    templateUrl,
    controller: LigaDetailsCtrl,
    controllerAs: 'vm'
}).config(function ($stateProvider) {
    'ngInject';
    $stateProvider.state('ligaDetails', {
        url: '/ligas/:slug',
        template: '<liga-details></liga-details>'
    });
}).directive('ngUpDown', function () {
    return {
        templateUrl: '/client/templates/up-down.html',
        bindings: {
            diff: '<'
        }
    }
});