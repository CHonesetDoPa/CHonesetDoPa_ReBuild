/**
 * InteractionHandler
 * 负责注册全局函数和处理点击事件
 */
export class InteractionHandler {
    /**
     * 更新全局函数
     * @param {Object} config - 配置对象
     */
    updateGlobalFunctions(config) {
        if (!config) return;

        // 更新邮箱函数
        if (config.personal?.email) {
            window.email = () => {
                window.swal({
                    title: "E-mail",
                    text: config.personal.email,
                    buttons: ["Copy", true],
                }).then((OK) => {
                    if (!OK && window.copy) {
                        window.copy(config.personal.email);
                    }
                });
            };
        }

        // 更新 Session ID 函数
        if (config.personal?.sessionId) {
            window.session_id = () => {
                window.swal({
                    title: "Session ID",
                    text: config.personal.sessionId,
                    buttons: ["Copy", true],
                }).then((OK) => {
                    if (!OK && window.copy) {
                        window.copy(config.personal.sessionId);
                    }
                });
            };
        }

        // 更新 PGP 函数
        if (config.personal?.pgpKey) {
            window.pgp_id = () => {
                window.swal("Choose a download link", {
                    buttons: {
                        cancel: "Cancel",
                        cloud: {
                            text: "Via OpenPGP.org",
                            value: "cloud",
                        },
                        local: {
                            text: "Via NekoCloud",
                            value: "local",
                        }
                    },
                }).then((value) => {
                    switch (value) {
                        case "local":
                            window.location.href = config.personal.pgpKey.local;
                            break;
                        case "cloud":
                            window.location.href = config.personal.pgpKey.remote;
                            break;
                    }
                });
            };
        }

        // 更新赞助函数
        if (config.sponsor) {
            window.sponsor_patreon = () => {
                window.swal({
                    title: '真的要请cc喝奶茶吗',
                    text: '你果然是大好人！',
                    buttons: ["No,thanks", "OK"],
                }).then((OK) => {
                    if (OK) {
                        window.location.href = config.sponsor.patreon;
                    }
                });
            };

            window.sponsor_afdian = () => {
                window.swal({
                    title: '真的要请cc喝奶茶吗',
                    text: '你果然是大好人！',
                    buttons: ["No,thanks", "OK"],
                }).then((OK) => {
                    if (OK) {
                        window.location.href = config.sponsor.afdian;
                    }
                });
            };

            window.sponsor_opencollective = () => {
                window.swal({
                    title: '真的要请cc喝奶茶吗',
                    text: '你果然是大好人！',
                    buttons: ["No,thanks", "OK"],
                }).then((OK) => {
                    if (OK) {
                        window.location.href = config.sponsor.opencollective;
                    }
                });
            };

            window.sponsor_wechat = () => {
                window.swal({
                    title: '真的要请cc喝奶茶吗',
                    text: '你果然是大好人！',
                    content: {
                        element: "img",
                        attributes: {
                            src: config.sponsor.wechatQR,
                            width: 200,
                            height: 200,
                        },
                    },
                    buttons: ["No,thanks", true],
                });
            };
        }
    }
}
