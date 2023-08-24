// Wait for the DOM to be fully loaded before executing the code
document.addEventListener('DOMContentLoaded',  async function()  {
	// Get reference to the "Add" button (plus icon)
    const addBtn = document.querySelector('.plus-icon');
	
	// Create hidden file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
	// Listen for file selection
    fileInput.addEventListener('change', async (event) => {
        const selectedFile = event.target.files[0];
		
		// Check if a file was selected
        if (selectedFile) {
			// Call function to upload image to the server
			await uploadImage(selectedFile);
			
			// Call function to create image container
            createImageContainer(selectedFile);
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
        }	
		catch (error) {
			// Show error mesage to the user
			console.error('Error uploading file:', error);
	    }
    }

     // Function to fetch uploaded image filenames and create image containers
     async function fetchAndDisplayImages() {
        try {
            const response = await fetch('/get_uploaded_images');
            const data = await response.json();

            // Create image containers for each uploaded image
            data.forEach(filename => {
                createImageContainerFromFilename(filename);
            });
        } catch (error) {
            console.error('Error fetching uploaded images:', error);
        }
    }

    // Call the function to fetch and display images when the page loads
    await fetchAndDisplayImages();
	
	// Function to create an image container
    function createImageContainer(imageFile) {
		// Create a new <div> element for the image container
        const container = document.createElement('div');
        container.classList.add('image-container');
        
		// Create a new <div> element to hold image and content
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('container-content');
		
		// Create a new <img> element for the image
        const image = document.createElement('img');
        image.classList.add('container-image');
        image.src = URL.createObjectURL(imageFile);

		// Append image to content div
        contentDiv.appendChild(image);
        
		// Create a new <time> element for the time tag
        const timeTag = document.createElement('time');
        timeTag.textContent = getFormattedTime();
        timeTag.classList.add('changeFontClass');
        
		// Append time tag to content div
        contentDiv.appendChild(timeTag);
        
		// Append content div to main container
        container.appendChild(contentDiv);
    
        const imageContainers = document.querySelector('.image-containers');
		// Append container to image containers
        imageContainers.appendChild(container);
    }

    function createImageContainerFromFilename(filename) {
        // Create a new <div> element for the image container
        const container = document.createElement('div');
        container.classList.add('image-container');
    
        // Create a new <div> element to hold image and content
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('container-content');
    
        // Create a new <img> element for the image
        const image = document.createElement('img');
        image.classList.add('container-image');
        image.src = `static/${filename}`; // Assuming your images are in the "static" folder
    
        // ... your existing code ...
    
        // Append content div to main container
        container.appendChild(contentDiv);
    
        const imageContainers = document.querySelector('.image-containers');
        // Append container to image containers
        imageContainers.appendChild(container);
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
    
	// Add click event listener to individual Image Containers' parent
    const imageContainersParent = document.querySelector('.image-containers');
    
    imageContainersParent.addEventListener('click', (event) => {
		// Find the closest parent with class '.image-container'
        const clickedContainer = event.target.closest('.image-container');
        if (clickedContainer) {
            const clickedImage = clickedContainer.querySelector('img');
            openPopup(clickedImage.src);
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
