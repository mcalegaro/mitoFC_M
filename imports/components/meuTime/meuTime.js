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

class MeuTimeCtrl {
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
                        console.info(response.data);
                        window.location.href = "/time/"+response.data.time.slug;
                    }
                });
            }
        };
    }
}

const name = 'meuTime';
export default angular.module(name, [angularMeteor, uiRouter]).component(name, {
    templateUrl,
    controller: MeuTimeCtrl
}).config(function ($stateProvider) {
    'ngInject';
    $stateProvider.state(
        name, {
            url: '/' + name,
            template: '<meu-time></meu-time>'
        });
});