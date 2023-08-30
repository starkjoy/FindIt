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
        const response = await fetch('/get_image_data');
        
        if (response.ok) {
            const data = await response.json();
            const imageData = data.image_data;
    
            // Check if imageUrls is defined and not empty
            if (imageData && imageData.length > 0) {
                // Display images by creating image containers
                imageData.forEach(imageItem => {
                    createImageContainer(imageItem.image_url, imageItem.upload_time);
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
            createImageContainer(URL.createObjectURL(selectedFile), getFormattedTime());

            // Call function to upload image to the server
			await uploadImage(selectedFile);
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
    function createImageContainer(imageUrl, timestamp) {
        const container = document.createElement('div');
        container.classList.add('image-container');
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('container-content');
        
        const image = document.createElement('img');
        image.classList.add('container-image');
        image.src = imageUrl;
        
        contentDiv.appendChild(image);

        // Create a new <time> element for the timestamp
        const timeTag = document.createElement('time');
        timeTag.textContent = timestamp;
        timeTag.classList.add('changeFontClass');
        contentDiv.appendChild(timeTag);
        
        container.appendChild(contentDiv);
        
        // Insert the new container at the beginning of the parent
        imageContainersParent.insertBefore(container, imageContainersParent.firstChild);
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

    // Set the initial scale, position, and drag state
    let scale = 1;
    let positionX = 0;
    let positionY = 0;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    // Add a scroll event listener to the popup image for zooming
    popupImage.addEventListener('wheel', (event) => {
        // Calculate the new scale based on the scroll direction
        if (event.deltaY > 0) {
            scale -= 0.1;
        } else {
            scale += 0.1;
        }
        // Limit the scale within a certain range
        scale = Math.max(0.5, Math.min(2, scale));

        // Apply the scale to the image
        popupImage.style.transform = `scale(${scale})`;

        // Prevent the default scrolling behavior
        event.preventDefault();
    });

    // Add mousedown event listener to start dragging
    popupImage.addEventListener('mousedown', (event) => {
        // Prevent the default drag-and-drop behavior
        event.preventDefault();
        
        isDragging = true;
        lastX = event.clientX;
        lastY = event.clientY;
        popupImage.style.cursor = 'grabbing';
    });
    
    // Add mouseup event listener to stop dragging
    window.addEventListener('mouseup', () => {
        isDragging = false;
        popupImage.style.cursor = 'grab';
    });
    
    // Add mousemove event listener for panning
    window.addEventListener('mousemove', (event) => {
        if (!isDragging) return;
        const deltaX = event.clientX - lastX;
        const deltaY = event.clientY - lastY;
        
        positionX += deltaX;
        positionY += deltaY;
        popupImage.style.transform = `scale(${scale}) translate(${positionX}px, ${positionY}px)`;
        
        lastX = event.clientX;
        lastY = event.clientY;
    });

    particlesJS("particles-js", {particles: 
        {
            number: { value: 50 }, 
            size: { value: 3 }, 
            color: { value: "#1E90FF" },
            shape: { type: "circle" },
            line_linked: { enable: true, distance: 150, color: "#9c9c9b" },
        },interactivity: 
        {
            events: {onhover: {enable: true, mode: "connect",},},
        },
        });
      

});
