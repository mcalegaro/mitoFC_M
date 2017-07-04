import angular from 'angular';
import angularMeteor from 'angular-meteor';
import {
    HTTP
} from 'meteor/http';
import template from './ligasSearch.html';
import ligaInfo from '../ligaInfo/ligaInfo';

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
        // this.refreshData = function () {
        //     // if (this.toRefresh) {
        //     console.debug('refresh results.');
        //     $scope.doPopover = true;
        //     // $scope.ligasSearchResult = this.ligasSearchResult;
        //     // this.toRefresh = false;
        //     // }
        // };
        this.searchLigas = () => {
            $scope.msg = {
                cod: 'info',
                desc: 'Carregando...'
            };
            $scope.ligasSearchResult = '';
            var prx = "http://localhost:3000/api?url=";
            var prefix = "https://api.cartolafc.globo.com/ligas?q=";
            try {
                HTTP.get(prx + prefix + this.searchLiga, {}, (error, response) => {
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
                        // $scope.toRefresh = true;
                        // document.activeElement.text = '';
                        // document.activeElement.blur();
                        // document.getElementById('toRefresh').click();
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
            // var url = "https://api.cartolafc.globo.com/ligas?q=fornax%20ch";
            // var url = "http://localhost:3000/proxy?url=https://api.cartolafc.globo.com/ligas?q=fornax%20ch";
            // var url = "https://mito-api.herokuapp.com/mitoAPI/ligas?q=fornax%20ch";
        };
    }
}

export default angular.module('ligasSearch', [
        angularMeteor
    ])
    .component('ligasSearch', {
        templateUrl: 'imports/components/ligasSearch/ligasSearch.html',
        controller: ['$scope', LigasSearchCtrl]
    })

;