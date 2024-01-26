// Function to generate the resume as a PDF
async function generateResume() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const education = document.getElementById('education').value;
    const skills = document.getElementById('skills').value;
    const profileSummary = document.getElementById('profileSummary').value;
    const imageFile = document.getElementById('image').files[0];

    // Convert image to Base64 data URL
    const imageBase64 = await getImageBase64(imageFile);

    console.log('generateResume function called');

    // Work experience data
    const workExperienceData = [];
    const workExperienceContainers = document.querySelectorAll('.work-experience-container');
    workExperienceContainers.forEach(container => {
        const jobTitle = container.querySelector('.job-title').value;
        const company = container.querySelector('.company').value;
        const duration = container.querySelector('.duration').value;
        workExperienceData.push({ jobTitle, company, duration });
    });

    // Create HTML content for the resume
    const resumeHTML = `
        <div>
            <h1>${fullName}</h1>
            <p>${email} | ${phone}</p>
            <img src="${imageBase64}" alt="Profile Image">
            <p><strong>Education:</strong><br>${education}</p>
            <p><strong>Skills:</strong><br>${skills}</p>
            <p><strong>Profile Summary:</strong><br>${profileSummary}</p>
            <p><strong>Work Experience:</strong></p>
            <ul>${workExperienceData.map(exp => `<li>${exp.jobTitle} at ${exp.company} (${exp.duration})</li>`).join('')}</ul>
        </div>
    `;

    // Convert HTML to PDF using html2pdf
    const pdfOptions = { margin: 10, filename: 'resume.pdf', image: { type: 'jpeg', quality: 0.98 } };
    html2pdf().from(resumeHTML).set(pdfOptions).outputPdf(pdf => {
        // Create a Blob from the PDF data
        const blob = new Blob([pdf], { type: 'application/pdf' });

        // Create a download link and trigger a click to download the PDF
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'resume.pdf';
        link.click();
    });
}

// Function to convert image to Base64 data URL
async function getImageBase64(imageFile) {
    return new Promise((resolve, reject) => {
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                resolve(event.target.result);
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsDataURL(imageFile);
        } else {
            // If no image is selected, use a placeholder image
            resolve('images/avatar-placeholder.png');
        }
    });
}

// Function to add a new work experience section
function addWorkExperience() {
    const container = document.getElementById('workExperienceContainer');

    const workExperienceHTML = `
        <div class="work-experience-container">
            <label for="jobTitle">Job Title:</label>
            <input type="text" class="job-title" required>

            <label for="company">Company:</label>
            <input type="text" class="company" required>

            <label for="duration">Duration:</label>
            <input type="text" class="duration" required>

            <button type="button" onclick="removeWorkExperience(this)">Remove</button>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', workExperienceHTML);
}

// Function to remove a work experience section
function removeWorkExperience(button) {
    const container = button.parentNode;
    container.parentNode.removeChild(container);
}

// Function to change the color theme
function changeTheme() {
    const selectedTheme = document.getElementById('theme').value;
    document.documentElement.setAttribute('data-theme', selectedTheme);
}
