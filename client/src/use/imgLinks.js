const getImageUrl = (folder, imgName, extension = 'png') => {
    return new URL(`../../src/assets/${folder}/${imgName}.${extension}`, import.meta.url).href
};

export {
    getImageUrl
}