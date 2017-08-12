import templateUrl from './minhasLigas.html';
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import {
    HTTP
} from 'meteor/http';
import {
    EP_ST_MERCADO,
    EP_MINHASLIGAS
} from '/client/main.js';
import {
    CARREGANDO,
    COD_ERRO
} from '/client/lib/messages.js';

class MinhasLigasCtrl {
    constructor($scope, $filter) {
        'ngInject';
        $scope.viewModel(this);
        var vm = this;

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

        vm.msg = CARREGANDO;
        vm.doPopover = false;

        vm.minhasFilter = function(liga){
            return liga.vencedor == null;
        }

        vm.finalizadosFilter = function(liga){
            return liga.vencedor != null;
        }

        HTTP.get(EP_ST_MERCADO, {}, (error, response) => {
            if (error) {
                console.log(error);
                vm.msg = {
                    cod: COD_ERRO,
                    desc: error
                }
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
                    //
                    if (!$.cookie("glbId")) {
                        window.location.href = "/login";
                    } else {
                        HTTP.get(EP_MINHASLIGAS, {
                            headers: {
                                'X-GLB-TOKEN': $.cookie("glbId")
                            }
                        }, (error, response) => {
                            if (error) {
                                console.error(error);
                                vm.msg = {
                                    cod: COD_ERRO,
                                    desc: error
                                }
                                $scope.$digest();
                            } else {
                                vm.ligas = response.data.ligas;
                                vm.msg = {};
                                vm.doPopover = response.data.ligas.length > 0;

                                vm.minhas = $filter('filter')(vm.ligas, {
                                    time_dono_id: ''
                                });

                                vm.finalizados = $filter('filter')(vm.ligas, {
                                    time_dono_id: ''
                                });

                                $scope.$digest();
                            }
                        });
                    }
                }
            }
        });

    }
}

const name = 'minhasLigas';
export default angular.module(name, [angularMeteor, uiRouter]).component(name, {
    templateUrl,
    controller: MinhasLigasCtrl,
    controllerAs: 'vm'
}).config(function ($stateProvider) {
    'ngInject';
    $stateProvider.state(
        name, {
            url: '/' + name,
            template: '<minhas-ligas></minhas-ligas>'
        });
});