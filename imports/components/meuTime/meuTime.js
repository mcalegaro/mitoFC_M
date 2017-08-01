import templateUrl from './meuTime.html';
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
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

class MeuTimeCtrl {
    constructor($scope) {
        'ngInject';
        $scope.viewModel(this);

        var vm = this;
        vm.msg = CARREGANDO;
        if (!$.cookie("glbId")) {
            window.location.href = "/login";
        } else {
            HTTP.get(EP_MEUTIME, {
                headers: {
                    'X-GLB-TOKEN': $.cookie("glbId")
                }
            }, (error, response) => {
                if (error) {
                    console.error(error);
                    vm.msg = {
                        cod: COD_ERRO,
                        desc: JSON.parse(response.content).mensagem
                    }
                    $scope.$digest();
                } else {
                    console.info(response.data);
                    window.location.href = "/time/" + response.data.time.slug;
                }
            });
        }

    }
}

const name = 'meuTime';
export default angular.module(name, [angularMeteor, uiRouter]).component(name, {
    templateUrl,
    controller: MeuTimeCtrl,
    controllerAs: 'vm'
}).config(function ($stateProvider) {
    'ngInject';
    $stateProvider.state(
        name, {
            url: '/' + name,
            template: '<meu-time></meu-time>'
        });
});