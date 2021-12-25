const MgpSdk = require('../../mgp-auth-nodejs');

const appId = "1461564080052506636";
const appSecret = "xJL0HU9ailVSGInqPyNK3Ev3qNHReRbR";
const Client = MgpSdk.NewSudMGPAuth(appId, appSecret);

const BaseRespSuccess = {ret_code: 0, ret_msg: "成功", sdk_error_code: 0};
const BaseRespError = {ret_code: 1, ret_msg: "参数错误"};

function newRespError(sdkErrorCode) {
    let ret = {};
    ret.ret_code = BaseRespError.ret_code;
    ret.ret_msg = BaseRespError.ret_msg;
    ret.sdk_error_code = sdkErrorCode;
    return JSON.stringify(ret);
}

function randRange(start, end) {
    let range = end - start + 1;
    return Math.floor((Math.random() * range) + start);
}

exports.create = function (app) {
    app.post('/login', function (request, response) {
        // 生成code 有效期默认2小时
        let codeResp = Client.getCode(request.body.user_id);
        let result = {};
        result.ret_code = BaseRespSuccess.ret_code;
        result.ret_msg = BaseRespSuccess.ret_msg;
        result.sdk_error_code = BaseRespSuccess.sdk_error_code;
        result.data = {code: codeResp.code, expire_date: codeResp.expireDate};
        response.write(JSON.stringify(result));
        response.end();
    })

    app.post('/get_sstoken', function (request, response) {
        let uidResp = Client.getUidByCode(request.body.code);
        if (!uidResp.isSuccess) {
            console.error("error code=" + request.body.code);
            response.write(newRespError(uidResp.errorCode));
            response.end();
            return;
        }

        // 生成token和有效期（有效期默认2小时）
        let ssTokenResp = Client.getSSToken(uidResp.uid);
        let result = {};
        result.ret_code = BaseRespSuccess.ret_code;
        result.ret_msg = BaseRespSuccess.ret_msg;
        result.sdk_error_code = BaseRespSuccess.sdk_error_code;
        result.data = {ss_token: ssTokenResp.token, expire_date: ssTokenResp.expireDate};
        response.write(JSON.stringify(result));
        response.end();
    });

    app.post('/update_sstoken', function (request, response) {
        let uidResp = Client.getUidBySSToken(request.body.ss_token);
        if (!uidResp.isSuccess) {
            console.error("error ss_token=" + request.body.ss_token);
            response.write(newRespError(uidResp.errorCode));
            response.end();
            return;
        }

        // 生成token和有效期（有效期默认2小时）
        let ssTokenResp = Client.getSSToken(uidResp.uid);
        let result = {};
        result.ret_code = BaseRespSuccess.ret_code;
        result.ret_msg = BaseRespSuccess.ret_msg;
        result.sdk_error_code = BaseRespSuccess.sdk_error_code;
        result.data = {ss_token: ssTokenResp.token, expire_date: ssTokenResp.expireDate};
        response.write(JSON.stringify(result));
        response.end();
    });

    app.post('/get_user_info', function (request, response) {
        let uidResp = Client.getUidBySSToken(request.body.ss_token);
        if (!uidResp.isSuccess) {
            console.error("error ss_token=" + request.body.ss_token);
            response.write(newRespError(uidResp.errorCode));
            response.end();
            return;
        }
        let userInfo = {};
        userInfo.uid = 'uid' + randRange(1, 100);
        userInfo.nick_name = 'name' + randRange(1, 100);
        userInfo.gender = 'male';
        userInfo.avatar_url = "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi2.hdslb.com%2Fbfs%2Fface%2F3d4f30235a8f3bb9914fe59ff58e1009e5498ba6.jpg%4068w_68h.jpg&refer=http%3A%2F%2Fi2.hdslb.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1637226890&t=63d2ca921e1fde4abe30329f67e3612d";

        let result = {};
        result.ret_code = BaseRespSuccess.ret_code;
        result.ret_msg = BaseRespSuccess.ret_msg;
        result.sdk_error_code = BaseRespSuccess.sdk_error_code;
        result.data = userInfo;
        response.write(JSON.stringify(result));
        response.end();
    });
};