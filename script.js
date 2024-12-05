// Ensure your existing code is placed above this point in your script.js

// New OCR functionality starts here
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const outputSection = document.querySelector('.output-section');
    const outputText = document.getElementById('output-text');
    const progressSection = document.querySelector('.progress-section');
    const progressBar = document.querySelector('.progress');
    const copyIcon = document.querySelector('.copy-icon');
    const downloadIcon = document.querySelector('.download-icon');
    const startOverBtn = document.querySelector('.start-over-btn');

    // Convert Button functionality
    document.querySelector('.convert-btn').addEventListener('click', () => {
        if (fileInput.files.length === 0) {
            alert('Please upload an image first!');
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const imageData = e.target.result;

            // Show progress bar
            progressSection.style.display = 'block';
            progressBar.style.width = '0%';

            let img = new Image();
            img.src = imageData;

            img.onload = () => {
                // Use Tesseract.js to process the image and extract text
                Tesseract.recognize(img, 'eng', {
                    logger: ({ status, progress }) => {
                        if (status === 'recognizing text') {
                            progressBar.style.width = `${Math.round(progress * 100)}%`;
                        }
                    }
                })
                .then(({ data: { text } }) => {
                    progressSection.style.display = 'none';

                    // Clean the extracted text
                    const cleanedText = cleanExtractedText(text);

                    // Display the text or show a default message if no text is found
                    outputText.textContent = cleanedText || 'No text recognized.';
                    outputSection.style.display = 'block';
                })
                .catch((error) => {
                    progressSection.style.display = 'none';
                    alert('Error processing image.');
                    console.error(error);
                });
            };
        };

        reader.readAsDataURL(file);
    });

    // Function to clean extracted text by removing unwanted characters
    function cleanExtractedText(text) {
        let cleanedText = text.trim();
        cleanedText = cleanedText.replace(/[^\w\s.,!?-]/g, '');  // Remove special characters
        cleanedText = cleanedText.replace(/\s+/g, ' ');  // Replace extra spaces
        return cleanedText;
    }

    // Copy Text to Clipboard
    copyIcon.addEventListener('click', () => {
        navigator.clipboard.writeText(outputText.value);
        alert('Text copied to clipboard!');
    });

    // Download Extracted Text as a Text File
    downloadIcon.addEventListener('click', () => {
        const blob = new Blob([outputText.value], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'extracted-text.txt';
        link.click();
    });

    // Start Over - Reset the UI and form
    startOverBtn.addEventListener('click', () => {
        fileInput.value = '';
        outputText.textContent = '';
        outputSection.style.display = 'none';
        progressSection.style.display = 'none';
        progressBar.style.width = '0%';
    });
});
