// Custom proxy for Decap CMS
class CustomProxy {
  constructor(options) {
    this.options = options || {};
    this.backendName = 'proxy';
  }

  authComponent() {
    return () => null; // No auth component needed for proxy backend
  }

  restoreUser() {
    return Promise.resolve();
  }

  logout() {
    return Promise.resolve();
  }

  getToken() {
    return Promise.resolve('LOCAL_TOKEN');
  }

  entriesByFolder(folder, extension) {
    const collection = folder.split('/').pop();
    console.log('Fetching collection:', collection);
    return fetch(`${this.options.proxyUrl}/collections/${collection}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch entries: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched entries:', data);
        return data;
      })
      .catch(error => {
        console.error('Error fetching entries:', error);
        return [];
      });
  }

  entriesByFiles(files) {
    return Promise.resolve([]);
  }

  getEntry(path, slug) {
    const collection = path.split('/').pop();
    return fetch(`${this.options.proxyUrl}/collections/${collection}/${slug}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to get entry: ${response.statusText}`);
        }
        return response.json();
      })
      .catch(error => {
        console.error('Error getting entry:', error);
        throw error;
      });
  }

  persistEntry(entry, mediaFiles, options) {
    const collection = options.collectionName;
    return Promise.all(
      mediaFiles.map(file => this.persistMedia(file))
    ).then(mediaData => {
      // Update entry's mediaFiles with persisted URLs
      const mediaLinks = mediaData.reduce((acc, media) => {
        acc[media.name] = media.url;
        return acc;
      }, {});

      // Replace media pointers with URLs in the entry data
      const entryData = { ...entry.data };
      if (entryData.imageUrl && entryData.imageUrl.includes('/')) {
        entryData.imageUrl = entryData.imageUrl;
      }
      if (entryData.eventImageUrl && entryData.eventImageUrl.includes('/')) {
        entryData.eventImageUrl = entryData.eventImageUrl;
      }

      return fetch(`${this.options.proxyUrl}/collections/${collection}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryData)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to persist entry: ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          return { ...entry, data: data.data };
        });
    });
  }

  persistMedia(mediaFile) {
    const formData = new FormData();
    formData.append('file', mediaFile.file);

    return fetch(`${this.options.proxyUrl}/upload`, {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to persist media: ${response.statusText}`);
        }
        return response.json();
      })
      .then(json => ({
        name: mediaFile.name,
        url: json.url
      }));
  }

  deleteFile(path, commitMessage) {
    return Promise.resolve();
  }

  unpublishedEntries() {
    return Promise.resolve([]);
  }

  unpublishedEntry() {
    return Promise.resolve(null);
  }

  updateUnpublishedEntryStatus() {
    return Promise.resolve();
  }

  publishUnpublishedEntry() {
    return Promise.resolve();
  }

  deleteUnpublishedEntry() {
    return Promise.resolve();
  }
}

// Initialize the CMS
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
  window.CMS_MANUAL_INIT = true;
  
  // Register custom backend
  window.CMS.registerBackend('proxy', CustomProxy);
  
  // Initialize CMS with local config
  fetch('/admin/config.yml')
    .then(response => response.text())
    .then(yamlText => {
      const config = window.decapCmsUtil.parseYaml(yamlText);
      window.CMS.init({ config });
    });
}