import angular from 'angular';
import angularMeteor from 'angular-meteor';
import templateUrl from './main.html';
import mitoMsg from '../imports/components/mitoMsg/mitoMsg';
import meuLogin from '../imports/components/meuLogin/meuLogin';
import meuTime from '../imports/components/meuTime/meuTime';
import minhasLigas from '../imports/components/minhasLigas/minhasLigas';
import ligasList from '../imports/components/ligasList/ligasList';
import ligasSearch from '../imports/components/ligasSearch/ligasSearch';
import ligaInfo from '../imports/components/ligaInfo/ligaInfo';
import ligaDetails from '../imports/components/ligaDetails/ligaDetails';
import timeDetails from '../imports/components/timeDetails/timeDetails';
import login from '../imports/components/login/login'
import scouts from '/imports/api/scouts.json';
import uiRouter from 'angular-ui-router';

const name = 'mito-m';
angular.module(name, [
    angularMeteor,
    mitoMsg.name,
    meuLogin.name,
    meuTime.name,
    minhasLigas.name,
    ligasList.name,
    ligasSearch.name,
    ligaInfo.name,
    ligaDetails.name,
    timeDetails.name,
    login.name,
    uiRouter
  ])
  .config(function ($locationProvider, $urlRouterProvider) {
    'ngInject';

    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/meuTime');
  });

const PROXY = window.location.origin + "/api?url=";
const PFX_API = "https://api.cartolafc.globo.com";
export const EP_LOGIN = PROXY + "https://login.globo.com/api/authentication";
export const EP_MEUTIME = PROXY + PFX_API + "/auth/time/info";
export const EP_MINHASLIGAS = PROXY + PFX_API + "/auth/ligas";
export const EP_ST_MERCADO = PROXY + PFX_API + "/mercado/status";
export const EP_LIGAS = PROXY + PFX_API + "/ligas?q=";
export const EP_LIGA = PROXY + PFX_API + "/auth/liga/"; //{slug}
export const EP_PARCIAIS = PROXY + PFX_API + "/atletas/pontuados";
export const EP_TIME = PROXY + PFX_API + "/time/slug/"; //{slug}