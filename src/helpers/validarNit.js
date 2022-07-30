export default (nit) => {
    if (nit === "" || nit === undefined) return true;
    let nd = /^(\d+)-?([\dk])$/i.exec(nit)
    let add = 0;
    if (nd) {
        nd[2] = (nd[2].toLowerCase() === 'k') ? 10 : parseInt(nd[2]);
        for (var i = 0; i < nd[1].length; i++) {
            add += ((((i - nd[1].length) * -1) + 1) * nd[1][i]);
        }
        return ((11 - (add % 11)) % 11) === nd[2];
    } else {
        return false;
    }
}