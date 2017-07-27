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

class MinhasLigasCtrl {
    constructor($scope) {
        'ngInject';
        $scope.viewModel(this);
        this.$onInit = () => {
            $scope.msg = {
                cod: 'info',
                desc: 'Carregando'
            };
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
                            cod: 'erro',
                            desc: error
                        }
                    } else {
                        console.info(response.data.ligas);
                        $scope.ligasSearchResult = response.data.ligas;
                        $scope.msg = {};
                        $scope.$digest();
                    }
                });
            }
        };
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