import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import templateUrl from './timeDetails.html';
import {
    EP_PARCIAIS,
    EP_TIME
} from '/client/main.js';

class TimeDetailsCtrl {
    constructor($scope, $stateParams) {
        'ngInject';
        $scope.viewModel(this);
        $scope.msg = {
            cod: 'info',
            desc: 'Carregando...'
        };

        console.debug("Carregando parciais...");
        HTTP.get(EP_PARCIAIS, {}, (error, response) => {
            if (error) {
                console.error(error);
                $scope.$digest();
            } else {
                $scope.pontuados = response.data;
                console.info($scope.pontuados);
                console.debug("Parciais carregadas.");
                $scope.getParciais();
            }
        })

        $scope.getParciais = function () {
            HTTP.get(EP_TIME + $stateParams.slug, {}, (error, response) => {
                if (error) {
                    console.error(error);
                    $scope.$digest();
                } else {
                    $scope.time = response.data;
                    var time = $scope.time;
                    time.pontos = {};
                    time.pontos.parcial = 0;
                    time.pontos.atletas = 0;
                    console.info(time);
                    time.atletas.forEach(function (atleta) {
                        atleta.parciais = $scope.pontuados.atletas[atleta.atleta_id];
                        if (atleta.parciais != undefined) {
                            time.pontos.parcial += atleta.parciais.pontuacao;
                            time.pontos.atletas++;
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