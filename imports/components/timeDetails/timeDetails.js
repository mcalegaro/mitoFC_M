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
        $scope.msg = CARREGANDO;

        HTTP.get(EP_ST_MERCADO, {}, (error, response) => {
            if (error) {
                console.log(error);
                $scope.$digest();
            } else {
                $scope.statusMercado = response.data;
                if ($scope.statusMercado != null && $scope.statusMercado.status_mercado == 2) {
                    $scope.getPontuados();
                } else {
                    $scope.getParciais();
                }
                $scope.$digest();
            }
        });

        $scope.setFormatoFoto = function (url) {
            return url.replace("_FORMATO", "_50x50");
        }

        $scope.getPontuados = function () {
            console.debug("Carregando parciais...");
            HTTP.get(EP_PARCIAIS, {}, (error, response) => {
                if (error) {
                    console.error(error);
                    $scope.$digest();
                } else {
                    $scope.pontuados = response.data;
                    // console.info($scope.pontuados);
                    console.debug("Parciais carregadas.");
                    $scope.getParciais();
                    $scope.$digest();
                }
            })
        };

        $scope.showHideScouts = function (atleta_id) {
            $('#divScouts_' + atleta_id).slideToggle();
        }

        $scope.getParciais = function () {
            HTTP.get(EP_TIME + $stateParams.slug, {}, (error, response) => {
                if (error) {
                    console.error(error);
                    $scope.msg = {
                        cod: COD_ERRO,
                        desc: error
                    }
                    $scope.$digest();
                } else {
                    $scope.time = response.data;
                    var time = $scope.time;
                    time.pontos = {};
                    time.pontos.parcial = 0;
                    time.pontos.atletas = 0;
                    // console.info(time);
                    time.atletas.forEach(function (atleta) {
                        if ($scope.statusMercado != null && $scope.statusMercado.status_mercado == 2) {
                            atleta.parciais = $scope.pontuados.atletas[atleta.atleta_id];
                        } else {
                            atleta.parciais = {};
                            atleta.parciais.pontuacao = atleta.pontos_num;
                            atleta.parciais.scout = atleta.scout;
                        }
                        if (atleta.parciais != undefined) {
                            time.pontos.parcial += atleta.parciais.pontuacao;
                            time.pontos.atletas++;
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
                            $scope.$digest();
                        }

                    }, this);
                    $scope.msg = '';
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
        controller: TimeDetailsCtrl
    }).config(function ($stateProvider) {
        'ngInject';
        $stateProvider.state(name, {
            url: '/time/:slug',
            template: '<time-details></time-details>'
        });
    });