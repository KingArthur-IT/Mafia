const getImageUrl = (folder, imgName, extension = 'png') => {
    return new URL(`../../src/assets/${folder}/${imgName}.${extension}`, import.meta.url).href
};

const getCardName = (role, gender) => {
    if (role === 'unknown') return role
    const prefix = gender === 'male' ? '-m' : '-w';
    return role + prefix
}

export {
    getImageUrl, getCardName
}