// Wait for the DOM to be fully loaded before executing the code
document.addEventListener('DOMContentLoaded', async function()  {
	// Get reference to the "Add" button (plus icon)
    const addBtn = document.querySelector('.plus-icon');
	
	// Create hidden file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    // Get reference to the image containers container
    const imageContainersParent = document.querySelector('.image-containers');

    // Fetch image URLs from the backend
    try {
        const response = await fetch('/get_image_urls');
        
        if (response.ok) {
            const data = await response.json();
            const imageUrls = data.image_urls;
    
            // Check if imageUrls is defined and not empty
            if (imageUrls && imageUrls.length > 0) {
                // Display images by creating image containers
                imageUrls.forEach(imageUrl => {
                    createImageContainer(imageUrl);
                });
            } else {
                console.error('No image URLs found.');
            }
        } else {
            console.error('Failed to fetch image URLs.');
        }
    } catch (error) {
        console.error('Error fetching image URLs:', error);
    }

	// Listen for file selection
    fileInput.addEventListener('change', async (event) => {
        const selectedFile = event.target.files[0];
		
		// Check if a file was selected
        if (selectedFile) {
			// Call function to create image container
            createImageContainer(selectedFile);

            // Call function to upload image to the server
			//await uploadImage(selectedFile);
        }
    });
    
	// Add click event listener to the "Add" button
    addBtn.addEventListener('click', () => {
		// Trigger the click event of the hidden file input element
        fileInput.click();
    });
    
    // Function to upload image to the server
    async function uploadImage(imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        
        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            
            // Check the status of the response
            if (response.ok) {
                // Parse the response as text (the relative path)
                const data = await response.json();
                
                // Handle response (show success message, update UI, etc.)
            } else {
                // throw an error with the status text
                throw new Error(response.statusText);
            }
        } catch (error) {
            // Show error message to the user
            console.error('Error uploading file:', error);
        }
    }
	
    // Function to create an image container
    function createImageContainer(imageUrl) {
        const container = document.createElement('div');
        container.classList.add('image-container');
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('container-content');
        
        const image = document.createElement('img');
        image.classList.add('container-image');
        image.src = imageUrl;
        
        contentDiv.appendChild(image);
        
        container.appendChild(contentDiv);
        
        imageContainersParent.appendChild(container);
    }
    
   
	// Function to get formatted time
    function getFormattedTime() {
        const currentTime = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return currentTime.toLocaleDateString('en-US', options);
    }
    
	// Get references to elements
    const popup = document.getElementById('popup');
    const popupImage = document.getElementById('popup-image');
    
    imageContainersParent.addEventListener('click', (event) => {
		// Find the closest parent with class '.image-container'
        const clickedContainer = event.target.closest('.image-container');
        if (clickedContainer) {
            const clickedImage = clickedContainer.querySelector('img');
            const imageUrl = clickedImage.src;
            openPopup(imageUrl);
        }
    });
    
	// Function to open the popup
    function openPopup(imageSrc) {
        popupImage.src = imageSrc;
        popup.style.display = 'block';
    }
    
	// Get reference to the close button
    const closePopupButton = document.getElementById('close-popup');
    
	// Add click event listener to close button
    closePopupButton.addEventListener('click', () => {
        popup.style.display = 'none';
    });
});
