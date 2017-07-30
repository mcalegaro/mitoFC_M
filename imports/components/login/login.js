import templateUrl from './login.html';
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import {
    HTTP
} from 'meteor/http';
import {
    EP_LOGIN
} from '/client/main.js';

class LoginCtrl {
    constructor($scope) {
        'ngInject';
        $scope.viewModel(this);
        this.$onInit = function () {
            gotoMeuTime();
        };

        gotoMeuTime = () => {
            var glbId = $.cookie("glbId");
            if (glbId) {
                window.location.href = '/meuTime';
            }
        };

        $scope.user = {};
        $scope.msg = {};
        $scope.login = () => {
            var opts = {
                data: {
                    "payload": {
                        "email": $scope.user.id,
                        "password": $scope.user.password,
                        "serviceId": 438
                    }
                }
            };
            HTTP.post(EP_LOGIN, opts, function (error, response) {
                if (error) {
                    console.error(error);
                    $scope.msg.cod = 'erro';
                    $scope.msg.desc = "Erro de autenticação.";
                    if (error.response.statusCode == 401) {
                        $scope.msg.desc += " Credenciais inválidas.";
                    }
                    $scope.$digest();
                } else {
                    console.log(response.data.glbId);
                    $scope.glbId = response.data.glbId;
                    $scope.msg.cod = 'sucesso';
                    $scope.msg.desc = "Sucesso.";
                    $.cookie("glbId", $scope.glbId, {
                        expires: 365,
                        path: '/'
                    });
                    gotoMeuTime();
                    $scope.$digest();
                }
            });
        }
    }
}

const name = 'login';
export default angular.module(name, [angularMeteor]).component(name, {
    templateUrl,
    controller: LoginCtrl
}).config(function ($stateProvider) {
    'ngInject';
    $stateProvider.state(
        name, {
            url: '/' + name,
            template: '<login></login>'
        });
})