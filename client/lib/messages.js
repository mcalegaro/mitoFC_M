import scouts from '/imports/api/scouts.json';

export const CARREGANDO = {
    cod: 'loading',
    desc: 'Carregando...'
};

export const COD_ERRO = 'erro';
export const MSG_RECESSO = {
    cod: 'info',
    desc: 'Aguardando retorno da temporada. Pontuação:\n'
        // + new DOMParser().parseFromString(JSON.stringify(scouts, null, '\t').split("\n").join('<br/>'), 'text/html').getElementsByTagName('body').valueOf()[0].innerHTML
        + JSON.stringify(scouts, null, ' ')
};

export function getMsg(vm) {
    vm.msg = {};
    if (vm.statusMercado.status_mercado == 6) {
        vm.msg = MSG_RECESSO;
    }
}
