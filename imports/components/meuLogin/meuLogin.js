import templateUrl from './meuLogin.html';
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import {
    HTTP
} from 'meteor/http';
import {
    EP_ST_MERCADO,
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
        vm.getStatusMercado(vm, $scope);
    }

    getStatusMercado(vm, scope) {
        vm.msg = CARREGANDO;
        HTTP.get(EP_ST_MERCADO, {}, (error, response) => {
            if (error) {
                console.log(error);
                msg = {
                    cod: COD_ERRO,
                    desc: error
                }
                scope.$digest();
            } else {
                vm.statusMercado = response.data;
                if (vm.statusMercado.status_mercado != 4) {
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
                                scope.$digest();
                            } else {
                                vm.time = response.data.time;
                                vm.msg = {};
                                scope.$digest();
                            }
                        });
                    } else {
                        window.location.href = "/login";
                    }
                } else {
                    vm.msg = {
                        cod: COD_ERRO,
                        desc: 'Mercado em manutenção. Tente mais tarde );'
                    }
                    scope.$digest();
                }
            }
        })
    }

    logout() {
        $.removeCookie("glbId", {
            path: '/'
        });
        window.location.href = "/login";
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