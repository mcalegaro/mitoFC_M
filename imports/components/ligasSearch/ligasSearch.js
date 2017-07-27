import angular from 'angular';
import angularMeteor from 'angular-meteor';
import {
    HTTP
} from 'meteor/http';
import templateUrl from './ligasSearch.html';
import ligaInfo from '../ligaInfo/ligaInfo';
import {
    EP_LIGAS
} from '/client/main.js';
import uiRouter from 'angular-ui-router';

class LigasSearchCtrl {
    constructor($scope) {
        $scope.viewModel(this);
        $scope.$watch("doPopover", function (value) {
            if (value) {
                console.debug('init popovers.');
                $('[data-toggle="popover"]').popover();
                $('div').on('click', function (e) {
                    //did not click a popover toggle, or icon in popover toggle, or popover
                    if ($(e.target).data('toggle') !== 'popover' &&
                        $(e.target).parents('[data-toggle="popover"]').length === 0 &&
                        $(e.target).parents('.popover.in').length === 0) {
                        $('[data-toggle="popover"]').popover('hide');
                    }
                });
            }
        });
        this.searchLigas = () => {
            $scope.msg = {
                cod: 'info',
                desc: 'Carregando...'
            };
            $scope.ligasSearchResult = '';
            $scope.doPopover = false;

            try {
                HTTP.get(EP_LIGAS + this.searchLiga, {}, (error, response) => {
                    if (error) {
                        console.log(error);
                        $scope.msg = {
                            cod: 'erro',
                            desc: 'Serviço indisponível ;('
                        };
                        $scope.$digest();
                    } else {
                        $scope.msg = '';
                        $scope.ligasSearchResult = response.data;
                        $scope.$digest();
                        $scope.doPopover = $scope.ligasSearchResult.length > 0;
                        if (!$scope.doPopover) {
                            $scope.msg = {
                                cod: 'info',
                                desc: 'Sem resultados.'
                            }
                        }
                        $scope.$digest();
                    }
                })
            } catch (err) {
                console.log(err);
                $scope.msg = {
                    cod: 'erro',
                    desc: 'Serviço indisponível ;('
                };
                $scope.$digest();
            }
        };
    }
}

const name = 'ligasSearch';
export default angular.module(name, [
        angularMeteor,
        uiRouter
    ])
    .component(name, {
        templateUrl,
        controller: ['$scope', LigasSearchCtrl]
    })
    .config(
        function ($stateProvider) {
            'ngInject';
            $stateProvider
                .state(name, {
                    url: '/ligasSearch',
                    template: '<ligas-search></ligas-search>'
                });
        }
    ).directive('ligaTipo', function () {
        return {
            templateUrl: '/client/templates/ligaTipo.html',
            bindings: {
                liga: '<'
            }
        }
    });