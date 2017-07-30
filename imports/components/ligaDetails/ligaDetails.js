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
        this.slug = $stateParams.slug;
        $scope.msg = CARREGANDO;
        if ($.cookie("glbId")) {
            var opts = {
                headers: {
                    'X-GLB-Token': $.cookie("glbId")
                }
            };
            this.setOrder = function (newOrder) {
                $scope.orderProp = newOrder;
            };

            HTTP.get(EP_LIGA + this.slug, opts, (error, response) => {
                if (error) {
                    console.log(error);
                    $scope.msg = {
                        cod: COD_ERRO,
                        desc: error
                    };
                    $scope.$digest();
                } else {
                    $scope.msg = {};
                    $scope.liga = response.data;
                    console.info($scope.liga);
                    $scope.orderProp = 'pontos.parcial';
                    $scope.getParciais();
                    $scope.doPopover = $scope.liga.liga.nome != '';
                    if (!$scope.doPopover) {
                        $scope.msg = CARREGANDO;
                        $scope.msg.desc = 'Sem resultados.';
                    }
                }
            });
        } else {
            window.location.href = "/login";
        }

        $scope.getParciais = function () {
            HTTP.get(EP_ST_MERCADO, {}, (error, response) => {
                if (error) {
                    console.log(error);
                    $scope.msg = {
                        cod: COD_ERRO,
                        desc: error
                    };
                    $scope.$digest();
                } else {
                    $scope.statusMercado = response.data;
                    if ($scope.statusMercado != null && $scope.statusMercado.status_mercado == 2) {
                        console.info("Carregando parciais...");
                        HTTP.get(EP_PARCIAIS, {}, (error, response) => {
                            if (error) {
                                console.log(error);
                                $scope.$digest();
                            } else {
                                $scope.pontuados = response.data;
                                $scope.liga.times.forEach(function (time) {
                                    $scope.getParcialTime(time);
                                }, this);
                                console.info("Parciais carregadas.");
                            }
                        })
                    } else {
                        $scope.orderProp = 'pontos.campeonato';
                        $scope.liga.times.forEach(function (time) {
                            time.pontos.parcial = 0;
                            time.pontos.atletas = 0;
                        }, this);
                    }
                    $scope.$digest();
                }
            });
        };

        $scope.getParcialTime = function (time) {
            time.pontos.parcial = 0.0;
            time.pontos.atletas = 0;
            HTTP.get(EP_TIME + time.slug, {}, (error, response) => {
                if (error) {
                    console.log(error);
                    $scope.$digest();
                } else {
                    time.details = response.data;
                    time.details.atletas.forEach(function (atleta) {
                        // console.info(atleta.atleta_id);
                        atleta.parciais = $scope.pontuados.atletas[atleta.atleta_id];
                        if (atleta.parciais != undefined) {
                            time.pontos.campeonato += atleta.parciais.pontuacao;
                            time.pontos.mes += atleta.parciais.pontuacao;
                            time.pontos.parcial += atleta.parciais.pontuacao;
                            time.pontos.atletas++;
                            $scope.$digest();
                        }
                    }, this);
                    $scope.$digest();
                }
            })
        };

    }
}

const name = 'ligaDetails';

export default angular.module(name, [
    angularMeteor,
    uiRouter
]).component(name, {
    templateUrl,
    controller: LigaDetailsCtrl
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