import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import templateUrl from './ligaDetails.html';
import {
    HTTP
} from 'meteor/http';
import {
    EP_LIGA,
    EP_PARCIAIS,
    EP_TIME,
    TOKEN
} from '/client/main.js';

class LigaDetailsCtrl {
    constructor($scope, $stateParams) {
        'ngInject';
        $scope.viewModel(this);
        this.slug = $stateParams.slug;
        var opts = {
            headers: {
                'X-GLB-Token': TOKEN
            }
        };
        this.setOrder = function (newOrder) {
            $scope.orderProp = newOrder;
        };

        HTTP.get(EP_LIGA + this.slug, opts, (error, response) => {
            if (error) {
                console.log(error);
                $scope.msg = {
                    cod: 'erro',
                    desc: 'Serviço indisponível ;('
                };
                $scope.$digest();
            } else {
                $scope.msg = '';
                $scope.liga = response.data;
                $scope.orderProp = 'pontos.parcial';
                $scope.getParciais();
                $scope.doPopover = $scope.liga.liga.nome != '';
                if (!$scope.doPopover) {
                    $scope.msg = {
                        cod: 'info',
                        desc: 'Sem resultados.'
                    }
                }
            }
        });

        $scope.getParciais = function () {
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