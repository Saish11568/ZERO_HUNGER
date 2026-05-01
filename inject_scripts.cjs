const fs = require('fs');
const path = require('path');

const files = [
    'index.html',
    'Registration.html',
    'NGO_Registration.html',
    'Supermarket_Registration.html',
    'Volunteer_Registration.html',
    'NGO_Dashboard.html',
    'Donor_Dashboard.html',
    'Zone_Dispatch.html'
];

const injectString = `
<script src="/src/js/auth.js"></script>
<script src="/src/js/main.js"></script>
</body>`;

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if(fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        if(!content.includes('/src/js/auth.js')) {
            content = content.replace('</body>', injectString);
            fs.writeFileSync(filePath, content);
            console.log(`Injected scripts into ${file}`);
        }
    }
});
