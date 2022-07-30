import { ACTIVATE_AUTH_LAYOUT, ACTIVATE_NON_AUTH_LAYOUT } from './actionTypes';

export const activateAuthLayout = () => {
    window.scrollTo(0, 0);
    return {
        type: ACTIVATE_AUTH_LAYOUT,
        payload: {
            topbar: true,
            sidebar: true,
            footer: true,
            layoutType: 'Auth'
        }
    }
}

export const activateNonAuthLayout = () => {
    return {
        type: ACTIVATE_NON_AUTH_LAYOUT,
        payload: {
            topbar: false,
            sidebar: false,
            footer: false,
            layoutType: 'NonAuth'
        }
    }
}


