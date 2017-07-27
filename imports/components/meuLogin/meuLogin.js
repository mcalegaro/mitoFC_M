import templateUrl from './meuLogin.html';
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import {
    HTTP
} from 'meteor/http';
import {
    EP_MEUTIME
} from '/client/main.js';

class MeuLoginCtrl {
    constructor($scope) {
        'ngInject';
        $scope.viewModel(this);
        $scope.user = {};
        $scope.msg = {};
        this.$onInit = function () {

            $scope.glbId = $.cookie("glbId");

            if ($scope.glbId) {
                HTTP.get(EP_MEUTIME, {
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
                        console.info(response.data.time);
                        $scope.usr = {
                            nome: response.data.time.nome_cartola
                        }
                        $scope.$digest();
                    }
                });
            } else {
                window.location.href = "/login";
            }
        };

        $scope.logout = () => {
            $.removeCookie("glbId", {
                path: '/'
            });
            window.location.href = "/login";
        }

    }
}

const name = 'meuLogin';
export default angular.module(name, [angularMeteor]).component(name, {
    templateUrl,
    controller: MeuLoginCtrl
}).config(function ($stateProvider) {
    'ngInject';
    $stateProvider.state(
        name, {
            url: '/' + name,
            template: '<meu-login></meu-login>'
        });
})