import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ligasList from '../imports/components/ligasList/ligasList';
import ligasSearch from '../imports/components/ligasSearch/ligasSearch';
import ligaInfo from '../imports/components/ligaInfo/ligaInfo';
import ligaDetails from '../imports/components/ligaDetails/ligaDetails';
import timeDetails from '../imports/components/timeDetails/timeDetails';
import scouts from '/imports/api/scouts.json';
import uiRouter from 'angular-ui-router';

angular.module('mito-m', [
  angularMeteor,
  ligasList.name,
  ligasSearch.name,
  ligaInfo.name,
  ligaDetails.name,
  timeDetails.name,
  uiRouter
]).config(function ($locationProvider, $urlRouterProvider) {
  'ngInject';

  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/ligasSearch');
});


const PROXY = "http://localhost:3000/api?url=";
const PFX_API = "https://api.cartolafc.globo.com";
export const TOKEN = "15bca6b59813af4dac3f61992503dd92f694b6c6d3433414b736e6763785876663375717530596f7a787331517a4b76705364574f5a656c705374476b566d7361586f41373655494d61647353636b433061474235355455546239715f387764544771416438673d3d3a303a6d63616c656761726f2e32303135";
export const EP_ST_MERCADO = PROXY + PFX_API + "/mercado/status";
export const EP_LIGAS = PROXY + PFX_API + "/ligas?q=";
export const EP_LIGA = PROXY + PFX_API + "/auth/liga/";//{slug}
export const EP_PARCIAIS = PROXY + PFX_API + "/atletas/pontuados";
export const EP_TIME = PROXY + PFX_API + "/time/slug/";//{slug}
//"https://mito-api.herokuapp.com/mitoAPI/ligas?q=fornax%20ch";