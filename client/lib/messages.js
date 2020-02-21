export const CARREGANDO = {
    cod: 'loading',
    desc: 'Carregando...'
};

export const COD_ERRO = 'erro';
export const MSG_RECESSO = {
    cod: 'info',
    desc: 'Aguardando retorno da temporada.'
};

export function getMsg(vm) {
    vm.msg = {};
    if (vm.statusMercado.status_mercado == 6) {
        vm.msg = MSG_RECESSO;
    }
}
