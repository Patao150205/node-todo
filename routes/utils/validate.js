function validateContent(body) {
  let isValidated = true;
  const error = {};
  if (!body.contentName) {
    isValidated = false;
    error.contentName = "項目名を入力してください。";
  }
  if (!body.time) {
    isValidated = false;
    error.time = "予定の時間を入力してください";
  }
  return isValidated ? undefined : error;
}

function validateUserInfo(body) {
  let isValidated = true;
  const error = {};
  if (body.password < 6) {
    isValidated = false;
    error.password = "パスワードは6文字以上で入力してください。";
  }
  const isVerifiedEmail = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/.test(body.email);
  if (!isVerifiedEmail) {
    const a = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/.test(body.email);
    isValidated = false;
    error.email = "正しいメールアドレスを入力してください。";
  }
  if (body.password !== body.reconfirmation) {
    isValidated = false;
    error.notMatchPSW = "パスワードとパスワード(再確認)が一致しません。";
  }
  return isValidated ? undefined : error;
}

module.exports = {
  validateContent,
  validateUserInfo,
};
