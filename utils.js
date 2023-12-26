const isTfLink = (link) => {
    const tfDomain = "https://testflight.apple.com/join/"
    return link.includes(tfDomain);
}

const getTfCode = (link) => {
    const tfDomain = "https://testflight.apple.com/join/"
    const tfCode = link.replace(tfDomain, "");
    return tfCode;
}

const utils = {
    isTfLink,
    getTfCode
}
export default utils;