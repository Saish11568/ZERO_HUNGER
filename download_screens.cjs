const fs = require('fs');
const https = require('https');

const screens = [
  {
    "id": "3cb7dad2e04b4803a44970917dba61a2",
    "title": "Landing Page",
    "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzNmNGE5ZjYxZjcwNDRjNTFiNTMxNWI0MzBlZTRhYTcwEgsSBxDHsb3_zQEYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDAzOTI3Mjg3MDg4MTExNjk2Mw&filename=&opi=89354086"
  },
  {
    "id": "87d11141fbf64d899684f0fb6a46d692",
    "title": "NGO Dashboard",
    "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzc4NzZiZWQyODY2OTRjNDY4M2RhYzRhNDJhYzAyNDA1EgsSBxDHsb3_zQEYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDAzOTI3Mjg3MDg4MTExNjk2Mw&filename=&opi=89354086"
  },
  {
    "id": "541899ffb40145de96bf5a39271e9efd",
    "title": "Donor Dashboard",
    "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzJhYTQ0M2UxNTIxNzQzYmU5NGQyZGMwOGE1Mzc5OTJiEgsSBxDHsb3_zQEYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDAzOTI3Mjg3MDg4MTExNjk2Mw&filename=&opi=89354086"
  },
  {
    "id": "42b7ee4a0ede46fd89b9b96d65b1e09c",
    "title": "Volunteer Registration",
    "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2EzMWNmMTMzZGNkMTRmOGM4NjI1MTcwODljNTZiM2FiEgsSBxDHsb3_zQEYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDAzOTI3Mjg3MDg4MTExNjk2Mw&filename=&opi=89354086"
  },
  {
    "id": "e2193359a03d490e860294c520be049b",
    "title": "Registration",
    "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzE2ZWE3ZjJjMzliMjQ1OTNhMmZjN2JkNGM2Mzc2MjBjEgsSBxDHsb3_zQEYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDAzOTI3Mjg3MDg4MTExNjk2Mw&filename=&opi=89354086"
  },
  {
    "id": "f7e2fc0a298e4700a7a240210a17e530",
    "title": "NGO Registration",
    "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzVjNTc3MmU5ZDA4NTQwYjliMzVjZjQyZDA0MWJhZWQ3EgsSBxDHsb3_zQEYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDAzOTI3Mjg3MDg4MTExNjk2Mw&filename=&opi=89354086"
  },
  {
    "id": "b4b2a9d3168f494a91f1f6647de8a4c8",
    "title": "Zone Dispatch",
    "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzYzNmE0MDE5Yjg0MzRlNGI5Njg4ZWQxZmUyODYzZTYyEgsSBxDHsb3_zQEYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDAzOTI3Mjg3MDg4MTExNjk2Mw&filename=&opi=89354086"
  },
  {
    "id": "ea60daa90db64b79acf52497e8f12f4d",
    "title": "Supermarket Registration",
    "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzMyMTBkOWQwMzNmMzQwYmJhMzJhZGY1Mjg2OWFlYzE2EgsSBxDHsb3_zQEYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDAzOTI3Mjg3MDg4MTExNjk2Mw&filename=&opi=89354086"
  }
];

if (!fs.existsSync('./screens')) {
  fs.mkdirSync('./screens');
}

screens.forEach(screen => {
  const filename = `./screens/${screen.title.replace(/ /g, '_')}.html`;
  https.get(screen.url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      fs.writeFileSync(filename, data);
      console.log(`Saved ${filename}`);
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${screen.title}:`, err.message);
  });
});
