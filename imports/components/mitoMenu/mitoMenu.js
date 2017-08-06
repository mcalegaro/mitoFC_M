import templateUrl from './mitoMenu.html';
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import {
    HTTP
} from 'meteor/http';
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
        if ($.cookie("glbId") != undefined) {
            this.getStatusMercado(this, $scope);
        }
    }

    getStatusMercado(vm, scope) {
        vm.msg = CARREGANDO;
        HTTP.get(EP_ST_MERCADO, {}, (error, response) => {
            if (error) {
                console.log(error);
            } else {
                vm.statusMercado = response.data;
                switch (vm.statusMercado.status_mercado) {
                    case 1:
                        var fecha = vm.statusMercado.fechamento;
                        var minutos = fecha.minuto > 0 ? ':' + fecha.minuto : 'h'
                        vm.descricaoMercado = 'Mercado fecha às ' + fecha.hora + minutos + ' - ' + fecha.dia +'/'+fecha.mes;
                        break;
                    case 2:
                        vm.descricaoMercado = 'Mercado Fechado';
                        break;
                    case 4:
                        vm.descricaoMercado = 'Mercado em manutenção';
                    break;
                }
                if (vm.statusMercado.status_mercado != 4) {
                    this.getUserInfo(this, scope);
                }
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
                vm.slug = response.data.time.slug;
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