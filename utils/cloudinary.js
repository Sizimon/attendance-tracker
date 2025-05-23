const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});



/**
 * Upload an image to Cloudinary.
 * @param {string} imageUrl - The local file path or URL of the image to upload.
 * @returns {Promise<string>} - The secure URL of the uploaded image.
 */
async function uploadImageToCloudinary(imageUrl) {
    try {
        const result = await cloudinary.uploader.upload(imageUrl, { folder: 'discord-events' });
        return result.secure_url;
    } catch (error) {
        console.error('Error uploading image to Cloudinary', error);
        throw error;
    }
}

async function uploadCustomsToCloudinary(imageUrl) {
    try {
        const result = await cloudinary.uploader.upload(imageUrl, { folder: 'discord-customs' });
        return result.secure_url;
    } catch (error) {
        console.error('Error uploading image to Cloudinary', error);
        throw error;
    }
}




// DELETE IMAGES RELATED TO EVENT IF EVENT IS DELETES --- TESTING!
async function deleteImagesFromCloudinary(imageUrls) {
    try {
        console.log('Recieved images for deletion:', imageUrls);
        // Extract public IDs from the URLs
        const publicIds = imageUrls.map(url => {
            const parts = url.split('/');
            const folderAndPublicId = parts.slice(parts.length - 2).join('/'); // e.g., "discord-events/vck915a58ci7czqpgt7y.png" to specify the folder
            const publicId = folderAndPublicId.split('.')[0]; // remove the file extension"
            console.log(`Extracted public ID from URL "${url}":`, publicId);
            return publicId;
        });

        // Delete the images using their public IDs
        if (publicIds.length > 0) {
            const result = await cloudinary.api.delete_resources(publicIds);
            console.log(`Deleted images from Cloudinary: ${publicIds.join(', ')}`);
            console.log('Cloudinary API response:', result);
        }
    } catch (error) {
        console.error('Error deleting images from Cloudinary', error);
        throw error;
    }
}

module.exports = {
    uploadImageToCloudinary,
    uploadCustomsToCloudinary,
    deleteImagesFromCloudinary,
}
    