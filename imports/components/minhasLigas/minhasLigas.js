import templateUrl from './minhasLigas.html';
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import {
    HTTP
} from 'meteor/http';
import {
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

        // this.$onInit = () => {
        $scope.msg = CARREGANDO;
        $scope.doPopover = false;
        $scope.glbId = $.cookie("glbId");
        if (!$scope.glbId) {
            window.location.href = "/login";
        } else {
            HTTP.get(EP_MINHASLIGAS, {
                headers: {
                    'X-GLB-TOKEN': $scope.glbId
                }
            }, (error, response) => {
                if (error) {
                    console.error(error);
                    $scope.msg = {
                        cod: COD_ERRO,
                        desc: error
                    }
                    $scope.$digest();
                } else {
                    console.info(response.data.ligas);
                    $scope.ligas = response.data.ligas;
                    $scope.msg = {};
                    $scope.doPopover = response.data.ligas.length > 0;

                    $scope.minhas = $filter('filter')($scope.ligas, {
                        time_dono_id: '',
                        tipo_fase: '!F'
                    });

                    $scope.finalizados = $filter('filter')($scope.ligas, {
                        time_dono_id: '',
                        tipo_fase: 'F'
                    });

                    $scope.$digest();
                }
            });
        }
        // };
    }
}

const name = 'minhasLigas';
export default angular.module(name, [angularMeteor, uiRouter]).component(name, {
    templateUrl,
    controller: MinhasLigasCtrl
}).config(function ($stateProvider) {
    'ngInject';
    $stateProvider.state(
        name, {
            url: '/' + name,
            template: '<minhas-ligas></minhas-ligas>'
        });
});