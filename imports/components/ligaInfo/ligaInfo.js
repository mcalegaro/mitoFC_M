import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './ligaInfo.html';

class LigaInfoCtrl {
    constructor($scope) {
        $scope.viewModel(this);
        var self = this;
        self.$onInit = function () {
            console.debug(self.liga);
        };
        this.showLeague = () => {
            alert(self.liga.slug);
        };
        this.showDescricao = () => {
            alert(self.liga.descricao);
        };
        this.showTipoLiga = () => {
            alert(self.liga.mata_mata ? "Mata-mata" : "Pontos corridos");
        };
        this.showToolTip = () => {

        };
    }
}

const name = 'ligaInfo';

export default angular.module(name, [
        angularMeteor
    ])
    .component(name, {
        templateUrl: '/imports/components/ligaInfo/ligaInfo.html',
        bindings: {
            liga: '<'
        },
        controller: ['$scope', LigaInfoCtrl]
    })
    .directive('ligaTipo', function () {
        return {
            templateUrl: '/client/templates/ligaTipo.html',
            bindings: {
                liga: '<'
            }
        }
    });