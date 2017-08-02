import templateUrl from './mitoMenu.html';
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import {
    CARREGANDO,
    COD_ERRO
} from '/client/lib/messages.js';
import {
    EP_ST_MERCADO,
    EP_MEUTIME
} from '/client/main.js';

class MitoMenuCtrl {
    constructor($scope) {
        'ngInject';
        this.$onInit = function () {
            if ($.cookie("glbId") != undefined) {
                this.getStatusMercado(this);
                this.getUserInfo(this, $scope);
            }
        };
    }

    getStatusMercado(vm) {
        vm.msg = CARREGANDO;
        HTTP.get(EP_ST_MERCADO, {}, (error, response) => {
            if (error) {
                console.log(error);
            } else {
                vm.statusMercado = response.data;
            }
        })
    }

    getUserInfo(vm, scope) {
        HTTP.get(EP_MEUTIME, {
            headers: {
                'X-GLB-TOKEN': $.cookie("glbId")
            }
        }, function (error, response) {
            if (!error) {
                vm.logged = true;
            } else {
                console.error(error);
            }
            scope.$digest();
        });

    }
}

const name = 'mitoMenu';
export default angular.module(name, [angularMeteor]).component(name, {
    templateUrl,
    controller: MitoMenuCtrl,
    controllerAs: 'vm'
})