import templateUrl from './meuLogin.html';
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import {
    HTTP
} from 'meteor/http';
import {
    EP_MEUTIME
} from '/client/main.js';
import {
    CARREGANDO,
    COD_ERRO
} from '/client/lib/messages.js';

class MeuLoginCtrl {
    constructor($scope) {
        'ngInject';
        $scope.viewModel(this);
        var vm = this;
        vm.user = {};
        vm.msg = CARREGANDO;

        if ($.cookie("glbId")) {
            HTTP.get(EP_MEUTIME, {
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
                } else {
                    vm.time = response.data.time;
                    vm.msg = {};
                    $scope.$digest();
                }
            });
        } else {
            window.location.href = "/login";
        }

        vm.logout = () => {
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
    controller: MeuLoginCtrl,
    controllerAs: 'vm'
}).config(function ($stateProvider) {
    'ngInject';
    $stateProvider.state(
        name, {
            url: '/' + name,
            template: '<meu-login></meu-login>'
        });
})