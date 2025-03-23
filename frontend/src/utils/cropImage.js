const getCroppedImg = (imageSrc, pixelCrop) => {
    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    const image = new Image();
    return new Promise((resolve, reject) => {
        image.onload = () => {
            ctx.drawImage(
                image,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                pixelCrop.width,
                pixelCrop.height
            );
            resolve(canvas.toDataURL('image/jpeg')); // You can change the format here
        };
        image.onerror = (error) => {
            reject(error);
        };
        image.src = imageSrc;
    });
};

export default getCroppedImg;