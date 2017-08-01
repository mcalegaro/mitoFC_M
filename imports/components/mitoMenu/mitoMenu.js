import templateUrl from './mitoMenu.html';
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import {
    CARREGANDO,
    COD_ERRO
} from '/client/lib/messages.js';
import {
    EP_ST_MERCADO
} from '/client/main.js';

class MitoMenuCtrl {
    constructor($scope) {
        'ngInject';
        this.$onInit = function () {
            if ($.cookie("glbId") != undefined) {
                this.getStatusMercado(this);
            }
        };
    }

    getStatusMercado(vm) {
        vm.msg = CARREGANDO;
        HTTP.get(EP_ST_MERCADO, {}, (error, response) => {
            if (error) {
                console.log(error);
                vm.msg = {
                    cod: COD_ERRO,
                    desc: error
                };
                scope.$digest();
            } else {
                vm.statusMercado = response.data;
            }
        })
    }
}

const name = 'mitoMenu';
export default angular.module(name, [angularMeteor]).component(name, {
    templateUrl,
    controller: MitoMenuCtrl,
    controllerAs: 'vm'
})