import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import templateUrl from './timeDetails.html';
import scoutsJson from '/imports/api/scouts.json';
import {
    EP_PARCIAIS,
    EP_TIME,
    EP_ST_MERCADO
} from '/client/main.js';
import {
    CARREGANDO,
    COD_ERRO
} from '/client/lib/messages.js';

class TimeDetailsCtrl {
    constructor($scope, $stateParams) {
        'ngInject';
        $scope.viewModel(this);
        var vm = this;
        vm.msg = CARREGANDO;

        HTTP.get(EP_ST_MERCADO, {}, (error, response) => {
            if (error) {
                console.log(error);
                $scope.$digest();
            } else {
                vm.statusMercado = response.data;
                if (vm.statusMercado.status_mercado == 4) {
                    vm.msg = {
                        cod: COD_ERRO,
                        desc: 'Mercado em manutenção. Tente mais tarde );'
                    }
                    $scope.$digest();
                } else {
                    vm.mostrarParciais = vm.statusMercado != null && vm.statusMercado.status_mercado == 2 && ($stateParams.rodada == vm.statusMercado.rodada_atual || !$stateParams.rodada);
                    if (vm.mostrarParciais) {
                        vm.getPontuados();
                    } else {
                        vm.getParciais();
                    }
                    $scope.$digest();
                }
            }
        });

        vm.setFormatoFoto = function (url) {
            return url.replace("_FORMATO", "_50x50");
        }

        vm.getPontuados = function () {
            console.debug("Carregando parciais...");
            HTTP.get(EP_PARCIAIS, {}, (error, response) => {
                if (error) {
                    console.error(error);
                    $scope.$digest();
                } else {
                    vm.pontuados = response.data;
                    console.debug("Parciais carregadas.");
                    vm.getParciais();
                    $scope.$digest();
                }
            })
        };

        vm.showHideScouts = function (atleta_id) {
            $('#divScouts_' + atleta_id).slideToggle();
        }

        vm.getParciais = function () {
            var epCall = EP_TIME + $stateParams.slug;
            if ($stateParams.rodada) {
                epCall += '/' + $stateParams.rodada;
            }
            HTTP.get(epCall, {}, (error, response) => {
                if (error) {
                    console.error(error);
                    vm.msg = {
                        cod: COD_ERRO,
                        desc: error
                    }
                    $scope.$digest();
                } else {
                    vm.time = response.data;
                    var time = vm.time;
                    time.pontos = {};
                    time.pontos.parcial = 0;
                    time.pontos.atletas = 0;
                    time.atletas.forEach(function (atleta) {
                        console.info(atleta);
                        if (vm.mostrarParciais) {
                            var parciais = vm.pontuados.atletas[atleta.atleta_id];
                            if (parciais != undefined && !(parciais.pontuacao == 0 && atleta.posicao_id == 6)) {
                                atleta.parciais = parciais;
                            }
                        } else {
                            atleta.parciais = {};
                            atleta.parciais.pontuacao = atleta.pontos_num;
                            atleta.parciais.scout = atleta.scout;
                        }
                        if (atleta.parciais != undefined) {
                            var scoutAux = atleta.parciais.scout;
                            atleta.parciais.scoutInfo = JSON.stringify(scoutAux).replace(/\"|\{|\}/g, "").replace(/\,/g, ", ");
                            atleta.parciais.scoutDesc = [];
                            for (var scout in scoutAux) {
                                var scoutDesc = scoutAux[scout] + " " + (scoutAux[scout] > 1 ? scoutsJson[scout].descricaoPl : scoutsJson[scout].descricao) + ": ";
                                var pts = new Number(scoutsJson[scout].pts);
                                var qtd = new Number(scoutAux[scout]);
                                var scoutPts = qtd * pts;
                                scoutDesc + scoutPts.toFixed(1);
                                atleta.parciais.scoutDesc.push({
                                    "descricao": scoutDesc,
                                    "pts": scoutPts
                                });
                            };
                            
                            vm.time.pontos.parcial += atleta.parciais.pontuacao;
                            if (atleta.atleta_id == time.capitao_id) {
                                vm.time.pontos.parcial += atleta.parciais.pontuacao;
                            }
                            if (!(atleta.parciais.pontuacao == 0 && atleta.posicao_id == 6)) {
                                vm.time.pontos.atletas++;
                            }
                            $scope.$digest();
                        }

                    }, this);
                    vm.msg = '';
                    $scope.$digest();
                }
            })
        }
    }
}

const name = 'timeDetails';

export default angular.module(name, [
    angularMeteor,
    uiRouter
])
    .component(name, {
        templateUrl,
        controller: TimeDetailsCtrl,
        controllerAs: 'vm'
    }).config(function ($stateProvider) {
        'ngInject';
        $stateProvider
            .state(name + 'Rodada', {
                url: '/time/:slug/:rodada',
                template: '<time-details></time-details>'
            })
            .state(name, {
                url: '/time/:slug',
                template: '<time-details></time-details>'
            });
    });